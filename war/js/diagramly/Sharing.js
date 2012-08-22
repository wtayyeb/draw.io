/*
 * $Id: Sharing.js,v 1.4 2012-06-18 14:42:27 gaudenz Exp $
 * Copyright (c) 2006-2011, JGraph Ltd
 */
/**
 * Creates an instance that synchronizes the graph model and given sharejs
 * document. The sharejs document contains a global counter which is
 * incremented for each client and which is used as a prefix for all cell IDs.
 * 
 * The cells are stored in a top-level object which maps from IDs to a JSON
 * representation of each cell. By convention, the root cell is the entry point
 * and uses ID "0". Each JSON object contains the list of child IDs in order.
 */
function Sharing(model, doc)
{
	this.logging = false;
	this.model = model;
	this.doc = doc;
	this.codec = new mxCodec();
	this.init();
};

/**
 * Specifies the ID of the root element in the model.
 */
Sharing.prototype.rootId = '0';

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
Sharing.prototype.scheduled = false;

/**
 * Synchronizes the collaboration model and the graph model and installs
 * the required listeners to keep them in sync.
 */
Sharing.prototype.init = function()
{
	// Syncs initial state from graph model to collab model
	if (this.doc.created)
	{
		// Creates an empty object to map from IDs to cells
		// and initializes a global counter for ID prefixes
		this.submit([{p:[], oi:{}}, {p:['counter'], oi:Number(1)}]);

    	// Recursively add cells to collab model
		this.putCell(this.model.root);
	}
	// Syncs initial state from collab model to graph model
	else
	{
		// Increments the global counter for each client
		this.submit([{p:['counter'], na:1}]);
		
		// Makes sure the model is completely empty so that no IDs
		// are resolved to root or default layer on initial sync.
		//graph.model.remove(graph.model.root);
		this.model.root = null;
		this.model.cells = null;
		
		// Recursively add cells to graph model. By convention the root
		// cell always uses ID '0' to be able to restore the hierarchy.
		//mxLog.debug('reading cell hierarchy');
		var root = this.getCell(this.rootId);
		
		//mxLog.debug('adding cell hierarchy');
		// Executes synchronously to update the initial state
		this.executeChange(new mxRootChange(this.model, root), true);
	}
	
	// Adds a prefix for cell IDs
	this.model.prefix = this.doc.snapshot.counter + '-';
	
	// Removes cells from graph model when removed from collab model
	// See children event listeners for adding cells into the graph
	this.doc.at().on('delete', mxUtils.bind(this, function(key, data)
	{
		if (this.model.getCell(key) != null)
		{
			if (this.logging)
			{
				mxLog.debug('remove cell: ' + key);
			}
			
			this.executeChange(new mxChildChange(this.model, null, this.model.getCell(key)));
		}
	}));
	
	// Handles root changes by replacing the model
	this.doc.at().on('insert', mxUtils.bind(this, function(key, data)
	{
		if (key == this.rootId)
		{
			// Clears the model before restoring the cell hierarchy
			this.model.cells = null;
			this.executeChange(new mxRootChange(this.model, this.getCell(key)));
		}
	}));
	
	// Listens to changes on the graph model and maps them to the collab
	// model as a single transaction.
	this.notifyListener = mxUtils.bind(this, function(sender, evt)
	{
		var edit = evt.getProperty('edit');
		var changes = edit.changes;
		
		var step = (edit.undone) ? -1 : 1;
		var i0 = (edit.undone) ? changes.length - 1 : 0;

		// Processes undone edits in reverse order
		for (var i = i0; i >= 0 && i < changes.length; i += step)
		{	
			this.processChange(changes[i]);	
		}
	});
	
	this.model.addListener(mxEvent.NOTIFY, this.notifyListener);
};

/**
 * Returns a string representation of the given ops.
 */
Sharing.prototype.processChange = function(change)
{
	if (change instanceof mxRootChange)
	{
		// Creates an empty object to map from IDs to cells
		// and initializes a global counter for ID prefixes
		this.submit([{p:[], oi:{}}, {p:['counter'], oi:Number(1)}]);

    	// Recursively add cells to collab model
		this.putCell(this.model.root);
	}
	else if (change instanceof mxChildChange)
	{
		//mxLog.debug(i, 'mxChildChange');
		// Removes index from old parent
		if (change.previous != null && this.doc.snapshot[change.previous.id] != null)
		{
			this.submit([{p:[change.previous.id, 'children', change.previousIndex], ld:null}]);
		}
		
		// Inserts or removes child from collab model
		if (change.previous == null && change.parent != null)
		{
			this.putCell(change.child);
		}
		else if (change.parent == null)
		{
			this.submit([{p:[change.child.id], od:null}]);
		}
		
		// Adds index to new parent
		// Change might reference a parent which hasn't been created in the collab
		if (change.parent != null && this.doc.snapshot[change.parent.id] != null)
		{
			this.submit([{p:[change.parent.id, 'children', change.index], li:String(change.child.id)}]);
		}
	}
	else if (this.doc.snapshot[change.cell.id] != null)
	{
		//mxLog.debug(i, mxUtils.getFunctionName(change.constructor));
		if (change instanceof mxTerminalChange)
		{
			var term = this.model.getTerminal(change.cell, change.source);
			var key = (change.source) ? 'source' : 'target';
			var id = (term != null) ? term.id : '';
			this.submit([{p:[change.cell.id, key], oi:String(id)}]);
		}
		else if (change instanceof mxGeometryChange)
		{
			var xml = mxUtils.getXml(this.codec.encode(change.cell.geometry));
			this.submit([{p:[change.cell.id, 'geometry'], oi:xml}]);
		}
		else if (change instanceof mxStyleChange)
		{
			this.submit([{p:[change.cell.id, 'style'], oi:change.cell.style}]);
		}
		else if (change instanceof mxValueChange)
		{
			this.submit([{p:[change.cell.id, 'value'], oi:String(change.cell.value)}]);
		}
		else if (change instanceof mxCollapseChange)
		{
			this.submit([{p:[change.cell.id, 'collapsed'], oi:(change.cell.collapsed) ? '1' : '0'}]);
		}
		else if (change instanceof mxVisibleChange)
		{
			this.submit([{p:[change.cell.id, 'visible'], oi:(change.cell.visible) ? '1' : '0'}]);
		}
	}
};

/**
 * Returns a string representation of the given ops.
 */
Sharing.prototype.submit = function(ops)
{
	if (this.logging)
	{
		for (var i = 0; i < ops.length; i++)
		{
			var op = ops[i];
			var path = '[';
			
			for (var j = 0; j < op.p.length; j++)
			{
				path += op.p[j] + ',';
			}
			
			path = ((path.length > 1) ? path.substring(0, path.length - 1) : path) + ']';
			
			var str = 'od/ld:null';
			
			if (op.oi != null)
			{
				str = 'oi:' + op.oi;
			}
			else if (op.li != null)
			{
				str = 'li:' + op.li;
			}
			else if (op.na != null)
			{
				str = 'na:' + op.na;
			}
			
			mxLog.debug((i + 1) + '/' + ops.length + ': path=' + path + ' op=' + str);
		}
	}
	
	this.doc.submitOp(ops);
};

/**
 * Adds existing cells from graph model into collab model recursively
 * and installs the required listeners to keep stuff in sync
 */
Sharing.prototype.putCell = function(cell)
{
	if (this.doc.snapshot[cell.id] == null)
	{
		if (this.logging)
		{
			mxLog.debug('putCell', cell.id);
		}
		
		// The change events for these can be ignored as the information
		// is collected in getCell when the cell is initially created.
		var obj = this.writeCell(cell, new Object());
		var childCount = this.model.getChildCount(cell);
		var children = [];
		
		for (var i = 0; i < childCount; i++)
		{
			var child = this.putCell(this.model.getChildAt(cell, i));
			children.push(String(child.id));
		}

		obj.children = children;
		this.submit([{p:[cell.id], oi:obj}]);
		this.installListeners(cell, obj);
	}
	
	return cell;
};

// Creates cell instance from information in collab model and
// installs the required listeners to keep the instance in sync
Sharing.prototype.getCell = function(id)
{
	if (this.logging)
	{
		mxLog.debug('getCell', id);
	}
	
	var obj = this.doc.snapshot[id];
	var cell = this.readCell(obj, new mxCell());
	cell.id = id;

	if (obj.children != null)
	{
		for (var i = 0; i < obj.children.length; i++)
		{
			var childId = obj.children[i];
			var child = this.model.getCell(childId);
			
			// Child is not yet in model so incarnate it from shared model
			if (child == null)
			{
				child = this.getCell(childId);
			}
			
			cell.insert(child);
		}
	}
	
	this.installListeners(cell);
	//mxLog.debug('added to graph: '+cell.id);
	
	return cell;
};

Sharing.prototype.installListeners = function(cell)
{
	var subdoc = this.doc.at(cell.id);
	var children = subdoc.at('children');
	
	// Listen to child insertions
	children.on('insert', mxUtils.bind(this, function(index, childId)
	{
		var child = this.model.getCell(childId);
		var isNew = child == null;
		
		// Creates new cell from collab model
		if (isNew)
		{
			//mxLog.debug('add cell: ' + childId);
			child = this.getCell(childId);
		}
		
		this.executeChange(new mxChildChange(this.model, cell, child, index));
	}));
	
	// Listen to property changes
	subdoc.on('insert', mxUtils.bind(this, function(key, value)
	{
		if (value != null)
		{
			//mxLog.debug('changed: ', cell.id + '.' + key + '=' + value);
    		if (key == 'vertex')
    		{
    			cell.vertex = true;
    		}
    		else if (key == 'edge')
    		{
    			cell.edge = true;
    		}
    		else if (key == 'connectable')
    		{
    			cell.connectable = (value == '1');
    		}
    		else if (key == 'source' || key == 'target')
    		{
    			var terminal = (value.length > 0) ? this.model.getCell(value) : null;
    			this.executeChange(new mxTerminalChange(this.model, cell, terminal, (key == 'source')));
    		}
    		else if (key == 'value')
    		{
    			this.executeChange(new mxValueChange(this.model, cell, value));
    		}
    		else if (key == 'style')
    		{
    			this.executeChange(new mxStyleChange(this.model, cell, value));
    		}
    		else if (key == 'geometry')
    		{
    			var geometry = this.codec.decode(mxUtils.parseXml(value).documentElement);
    			this.executeChange(new mxGeometryChange(this.model, cell, geometry));
    		}
    		else if (key == 'collapsed')
    		{
    			this.executeChange(new mxCollapseChange(this.model, cell, value == '1'));
    		}
    		else if (key == 'visible')
    		{
    			this.executeChange(new mxVisibleChange(this.model, cell, value == '1'));
    		}
		}
	}));
};

Sharing.prototype.executeChange = function(change, immediate)
{
	if (this.logging)
	{
		mxLog.debug('executeChange', mxUtils.getFunctionName(change.constructor));
	}
	
	if (this.changes == null)
	{
		this.changes = [change];
	}
	else
	{
		this.changes.push(change);
	}

	change.execute();

	if (!this.scheduled)
	{
		this.scheduled = true;
		
		var exec = mxUtils.bind(this, function()
		{
			if (this.changes != null)
			{
	    		var edit = new mxUndoableEdit(this.model, true);
	    		edit.changes = this.changes;
	    		this.changes = null;
	    		this.scheduled = false;
	    		
	    		// Restores graph structure after all cells have been
	    		// inserted. This is required for all IDs to resolve.
	    		for (var i = 0; i < edit.changes.length; i++)
	    		{
	    			var change = edit.changes[i];
	    			
		    		if (change instanceof mxRootChange)
		    		{
		    			this.restoreCell(this.model.root);
		    			break;
		    		}
		    		else if (change instanceof mxChildChange)
		    		{
		    			// Cell was inserted
		    			if (change.previous == null && change.parent != null)
		    			{
		    				this.restoreCell(change.child);
		    			}
		    		}
	    		}
	    		
	    		edit.notify = function()
	    		{
	    			edit.source.fireEvent(new mxEventObject(mxEvent.CHANGE,
	    				'edit', edit, 'changes', edit.changes));
	    			edit.source.fireEvent(new mxEventObject(mxEvent.NOTIFY,
	    				'edit', edit, 'changes', edit.changes));
	    		};
	    		
	    		this.model.fireEvent(new mxEventObject(mxEvent.CHANGE,
					'edit', edit, 'changes', edit.changes));
	    		this.model.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
	    		
	    		if (this.logging)
	    		{
	    			mxLog.debug('fired', edit.changes.length + ' change(s)');
	    		}
			}
		});
		
		if (immediate)
		{
			exec();
		}
		else
		{
			window.setTimeout(exec, 0);
		}
	}
};

/**
 * Writes all persistent properties from the cell to the object.
 */
Sharing.prototype.writeCell = function(cell, obj)
{
	if (cell.vertex)
	{
		obj.vertex = '1';
	}
	else if (cell.edge)
	{
		obj.edge = '1';
	}
	
	if (cell.value != null)
	{
		obj.value = String(cell.value);
	}
	
	if (cell.style != null)
	{
		obj.style = cell.style;
	}
	
	if (cell.geometry != null)
	{
		obj.geometry = mxUtils.getXml(this.codec.encode(cell.geometry));
	}

	// True (default) is ignored
	if (!cell.visible)
	{
		obj.visible = (cell.visible) ? '1' : '0';
	}
	
	// False (default) is ignored
	if (cell.collapsed)
	{
		obj.collapsed = (cell.collapsed) ? '1' : '0';
	}

	// True (default) is ignored
	if (!cell.connectable)
	{
		obj.connectable = (cell.connectable) ? '1' : '0';
	}

	if (cell.source != null)
	{
		obj.source = String(cell.source.id);
	}
	
	if (cell.target != null)
	{
		obj.target = String(cell.target.id);
	}
	
	return obj;
};

/**
 * Reads all persistent properties from the object into the cell.
 */
Sharing.prototype.readCell = function(obj, cell)
{
	if (obj.vertex != null)
	{
		cell.vertex = true;
	}
	else if (obj.edge != null)
	{
		cell.edge = true;
	}

	if (obj.value != null)
	{
		cell.value = obj.value;
	}
	
	if (obj.style != null)
	{
		cell.style = obj.style;
	}
	
	if (obj.geometry != null)
	{
		cell.geometry = this.codec.decode(mxUtils.parseXml(obj.geometry).documentElement);
	}
	
	if (obj.visible != null)
	{
		cell.visible = obj.visible == '1';
	}
	
	if (obj.collapsed != null)
	{
		cell.collapsed = obj.collapsed == '1';
	}
	
	if (obj.connectable != null)
	{
		cell.connectable = obj.connectable == '1';
	}

	return cell;
};

/**
 * Establishes connections after inserting all cells into the model.
 */
Sharing.prototype.restoreCell = function(cell)
{
	var obj = this.doc.snapshot[cell.id];
	
	if (this.logging)
	{
		mxLog.debug('restoreCell', cell.id);
	}
	
	if (obj != null)
	{
		if (obj.source != null)
		{
			var terminal = this.model.getCell(obj.source);
			terminal.insertEdge(cell, true);
		}
		
		if (obj.target != null)
		{
			var terminal = this.model.getCell(obj.target);
			terminal.insertEdge(cell, false);
		}
	}
	
	var childCount = this.model.getChildCount(cell);
	
	if (childCount > 0)
	{
		for (var i = 0; i < childCount; i++)
		{
			this.restoreCell(this.model.getChildAt(cell, i));
		}
	}
};

/**
 * Destroys the instance and removes all listeners.
 */
Sharing.prototype.destroy = function()
{
	if (this.notifyListener != null)
	{
		this.model.removeListener(this.notifyListener);
		this.notifyListener = null;
	}
	
	this.model = null;
	this.doc = null;
};
