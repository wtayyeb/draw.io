/*
 * $Id: Diagramly.js,v 1.35 2012-10-16 21:38:12 boris Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
// For compatibility with open servlet on GAE
function setCurrentXml(data, filename)
{
	if (window.parent != null && window.parent.openFile != null)
	{
		window.parent.openFile.setData(data, filename);
	}
};

(function()
{
	// -----------------------------------------------
	// Experimental code for rich text in-place editor
	// -----------------------------------------------
	if (!touchStyle && urlParams['tiny'] != '0')
	{
		var mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
		mxCellEditor.prototype.startEditing = function(cell, trigger)
		{
			mxCellEditorStartEditing.apply(this, arguments);
			
			// Replaces linefeeds for richt text editing
			if (this.graph.isHtmlLabel(cell) && typeof(tinyMCE) != 'undefined')
			{
				this.textarea.style.display = 'none';
				
				var tbHeight = (mxClient.IS_IE || urlParams['tiny'] == '2') ? 90 : 30;
								
				this.text2 = document.createElement('textarea');
				this.text2.setAttribute('id', 'mxCellEditor1');
				this.text2.style.position = 'absolute';
				this.text2.style.visibility = 'hidden';
				this.text2.className = 'mxCellEditor';
				this.text2.value = this.textarea.value.replace(/\n/g, '<br/>');
				this.text2.style.height = (parseInt(this.textarea.style.height) + tbHeight + 14) + 'px'
				this.text2.style.width = (parseInt(this.textarea.style.width) + 16) + 'px'

				var div = document.createElement('div');
				div.style.position = 'absolute';

				div.style.left = (parseInt(this.textarea.style.left) - 8) + 'px';
				div.style.top = Math.max(0, (parseInt(this.textarea.style.top) - tbHeight)) + 'px';

				div.appendChild(this.text2);
				this.graph.container.appendChild(div);
				this.wrapperDiv = div;

				if (this.installedListener == null)
				{
					tinyMCE.onAddEditor.add(mxUtils.bind(this, function(mgr, ed)
					{
						// Applies current style as default settings
						ed.onInit.add(mxUtils.bind(this, function(ed)
						{
							var style = ed.getBody().style;

							if (style != null)
							{
								style.fontSize = this.textarea.style.fontSize;
								style.fontFamily = this.textarea.style.fontFamily;
								style.textAlign = this.textarea.style.textAlign;
								style.color = this.textarea.style.color;
								style.fontWeight = this.textarea.style.fontWeight;
								style.margin = '2px';
							}
						}));
					}));

					mxEvent.addListener(document, 'mousedown', mxUtils.bind(this, function(evt)
					{
						if (this.wrapperDiv != null)
						{
							var node = mxEvent.getSource(evt);
							
							while (node != this.wrapperDiv && node != null && node != this.graph.container)
							{
								node = node.parentNode;
							}
	
							if (node == this.graph.container)
							{
								this.graph.cellEditor.stopEditing(!this.graph.isInvokesStopCellEditing());
							}
						}
					}));

					this.installedListener = true;
				}

				tinyMCE.execCommand("mceAddControl", true, "mxCellEditor1");
			}
			else
			{
				this.textarea.style.display = 'block';
				this.textarea.focus();
				this.textarea.select();
			}
		};
		
		var mxCellEditorStopEditing = mxCellEditor.prototype.stopEditing;
		mxCellEditor.prototype.stopEditing = function(cancel)
		{
			if (this.wrapperDiv != null)
			{
				var editor = tinyMCE.get('mxCellEditor1');
		
				if (editor != null)
				{
					var content = editor.getContent();
					
					if (this.textarea.value != content)
					{
						// FIXME: Roundtrip for newlines in IE
						this.textarea.value = content.replace(/\n/g, '');
						this.setModified(true);
					}
				}
			}
			
			mxCellEditorStopEditing.apply(this, arguments);
			
			if (this.wrapperDiv != null)
			{
				tinyMCE.execCommand('mceRemoveControl',false,'mxCellEditor1');
				this.wrapperDiv.parentNode.removeChild(this.wrapperDiv);
				this.wrapperDiv = null;
			}
		};
		
		var mxCellEditorFocusLost = mxCellEditor.prototype.focusLost;
		mxCellEditor.prototype.focusLost = function()
		{
			if (!this.graph.isHtmlLabel(this.getEditingCell()) || typeof(tinyMCE) == 'undefined')
			{
				mxCellEditorFocusLost.apply(this, arguments);
			}
		};
		
		// Creates function to apply value
		ColorDialog.prototype.createApplyFunction = function()
		{
			return mxUtils.bind(this, function(color)
			{
				var graph = this.editorUi.editor.graph;
				var active = typeof(tinyMCE) != 'undefined' && graph.isEditing() && graph.isHtmlLabel(graph.cellEditor.getEditingCell());

				if (active && this.currentColorKey == 'fontColor')
				{
					tinyMCE.execCommand('forecolor', false, color);
				}
				else if (active && this.currentColorKey == 'labelBackgroundColor')
				{
					tinyMCE.execCommand('backcolor', false, color);
				}
				else
				{
					this.editorUi.editor.graph.setCellStyles(this.currentColorKey, (color == 'none') ? 'none' : color);					
				}
			});
		};
		
		// Extends style change to redirect to tinyMCE
		Menus.prototype.styleChange = function(menu, label, keys, values, sprite, parent)
		{
			return menu.addItem(label, null, mxUtils.bind(this, function()
			{
				var graph = this.editorUi.editor.graph;
				var active = typeof(tinyMCE) != 'undefined' && graph.isEditing() && graph.isHtmlLabel(graph.cellEditor.getEditingCell());

				if (active && keys[0] == 'fontFamily')
				{
					tinyMCE.execCommand('fontname', false, values[0]);
				}
				else if (active && keys[0] == 'fontSize')
				{
					tinyMCE.execCommand('fontsize', false, values[0]);
				}
				else if (active && keys[0] == 'fontColor')
				{
					tinyMCE.execCommand('forecolor', false, values[0]);
				}
				else if (active && keys[0] == 'align' && values[0] == 'left')
				{
					tinyMCE.execCommand('justifyleft', false, values[0]);
				}
				else if (active && keys[0] == 'align' && values[0] == 'center')
				{
					tinyMCE.execCommand('justifycenter', false, values[0]);
				}
				else if (active && keys[0] == 'align' && values[0] == 'right')
				{
					tinyMCE.execCommand('justifyright', false, values[0]);
				}
				else
				{
					var graph = this.editorUi.editor.graph;
					
					graph.getModel().beginUpdate();
					try
					{
						for (var i = 0; i < keys.length; i++)
						{
							graph.setCellStyles(keys[i], values[i]);
						}
					}
					finally
					{
						graph.getModel().endUpdate();
					}
				}
			}), parent, sprite);
		};
	}
	// ------------------------------------------------------
	// End of Experimental code for rich text in-place editor
	// ------------------------------------------------------
	
	// Adds all Sign stencils
	var signs = ['Animals', 'Food', 'Healthcare', 'Nature', 'People', 'Safety', 'Science', 'Sports', 'Tech', 'Transportation', 'Travel'];

	// Adds all mockup stencils
	var mockups = ['Calendars', 'Carousel', 'Charts and Tables', 'Controls', 'Form Elements', 'Menus and Buttons', 'Misc', 'Tabs'];

	// Adds all Electrical stencils
	var ee = ['Abstract', 'Capacitors', 'Diodes', 'Electro-mechanical', 'IEC logic gates', 'IEC417', 'Inductors',
	         'Instruments', 'Logic gates', 'Miscellaneous', 'MOSFETs1', 'MOSFETs2', 'Op amps', 'Opto-electronics',
	         'PLC ladder', 'Power semiconductors', 'Radio', 'Resistors', 'Signal sources', 'Thermionic devices',
	         'Transistors', 'Waveforms'];

	// Adds all PID stencils
	var pids = ['Compressors', 'Heat Exchangers', 'Instruments', 'Pumps', 'Valves', 'Vessels'];

	// Overrides gear image URL
	Sidebar.prototype.gearImage = GRAPH_IMAGE_PATH + '/clipart/Gear_128x128.png';
	
	// Default submenu image is replaced in Diagram.ly for black menu
	// so we have to change the URL to point to our local image
	mxPopupMenu.prototype.submenuImage = IMAGE_PATH + '/submenu.gif';

	// Fetches footer from page
	EditorUi.prototype.createFooter = function()
	{
		var footer = this.createDiv('geFooter');
		var contents = document.getElementById('geFooter');
		
		if (contents != null)
		{
			footer.appendChild(contents);
			contents.style.visibility = 'visible';
		}
		
		return footer;
	};

	// Overrides footer height
	EditorUi.prototype.footerHeight = 44;

	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);
		
		// Adds style input in test mode
		if (urlParams['test'] == '1')
		{
			var footer = document.getElementById('geFooter');
			
			if (footer != null)
			{
				this.styleInput = document.createElement('input');
				this.styleInput.setAttribute('type', 'text');
				this.styleInput.style.position = 'absolute';
				this.styleInput.style.left = '2px';
				// Workaround for ignore right CSS property in FF
				this.styleInput.style.width = '98%';
				this.styleInput.style.visibility = 'hidden';
				
				mxEvent.addListener(this.styleInput, 'change', mxUtils.bind(this, function()
				{
					this.editor.graph.getModel().setStyle(this.editor.graph.getSelectionCell(), this.styleInput.value);
				}));
				
				footer.appendChild(this.styleInput);
				
				this.editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
				{
					if (this.editor.graph.getSelectionCount() > 0)
					{
						var cell = this.editor.graph.getSelectionCell();
						var style = this.editor.graph.getModel().getStyle(cell);
						
						this.styleInput.value = style;
						this.styleInput.style.visibility = 'visible';
					}
					else
					{
						this.styleInput.style.visibility = 'hidden';
					}
				}));
			}
			
			var isSelectionAllowed = this.isSelectionAllowed;
			this.isSelectionAllowed = function(evt)
			{
				if (mxEvent.getSource(evt) == this.styleInput)
				{
					return true;
				}
				
				return isSelectionAllowed.apply(this, arguments);
			};
		}

		// Changes default extension for Google Drive
		this.editor.getOrCreateFilename = function()
		{
			return this.filename || mxResources.get('drawing', [counter]) + ((driveDomain) ? '' : '.xml');
		};

		// Removes info text in page
		var info = document.getElementById('geInfo');
		
		if (info != null)
		{
			info.parentNode.removeChild(info);
		}
		
		// Hides libraries
		var stc = urlParams['libs'];
		
		// Default libraries for domains
		if (stc == null)
		{
			if (umlDomain)
			{
				stc = 'general;uml;flowchart;basic;arrows;images';	
			}
			else
			{
				stc = 'general;images;uml;bpmn;flowchart;basic;arrows;clipart';
			}
		}
		
		var tmp = stc.split(';');
		
		// Individual libs
		var all = ['general', 'images', 'uml', 'bpmn', 'flowchart', 'basic', 'arrows', 'leanMapping']
		
		for (var i = 0; i < all.length; i++)
		{
			if (mxUtils.indexOf(tmp, all[i]) < 0)
			{
				this.sidebar.togglePalettes('', [all[i]]);
			}
		}

		if (mxUtils.indexOf(tmp, 'clipart') < 0)
		{
			this.sidebar.togglePalettes('', ['computer', 'finance', 'clipart', 'networking', 'people', 'telco']);
		}
		
		if (mxUtils.indexOf(tmp, 'mockups') < 0)
		{
			this.sidebar.togglePalettes('ui', mockups);
		}
		
		if (mxUtils.indexOf(tmp, 'signs') < 0)
		{
			this.sidebar.togglePalettes('signs', signs);
		}
		
		if (mxUtils.indexOf(tmp, 'electrical') < 0)
		{
			this.sidebar.togglePalettes('electrical', ee);
		}
		
		if (mxUtils.indexOf(tmp, 'aws') < 0)
		{
			this.sidebar.togglePalettes('aws', ['Compute', 'ContentDelivery', 'Database', 'DeploymentManagement',
				                             'Groups', 'Messaging', 'Misc', 'Networking', 'NonServiceSpecific',
				                             'OnDemandWorkforce', 'Storage']);
		}
		
		if (mxUtils.indexOf(tmp, 'pid') < 0)
		{
			this.sidebar.togglePalettes('pid', pids);
		}
		
		// TODO: Expand the first entry

		// Adds zoom via shift-wheel
		mxEvent.addMouseWheelListener(mxUtils.bind(this, function (evt, up)
		{
			var outlineWheel = false;
			
			if (this.editor.outline.outline.dialect == mxConstants.DIALECT_SVG)
			{
				var source = mxEvent.getSource(evt);
				
				while (source != null)
				{
					if (source == this.editor.outline.outline.view.canvas.ownerSVGElement)
					{
						outlineWheel = true;
						break;
					}
				
					source = source.parentNode;
				}
			}
			
			if (mxEvent.isShiftDown(evt) || outlineWheel)
			{
				if (up)
				{
					this.editor.graph.zoomIn();
				}
				else
				{
					this.editor.graph.zoomOut();
				}
				
				mxEvent.consume(evt);
			}
		}));
		
		// Installs popup menu in Sidebar
		var menu = new mxPopupMenu(this.menus.get('moreShapes').funct);
		var ignoreEvent = false;
		
		mxEvent.addListener(this.sidebarContainer, 'mousedown', function(evt)
		{
			if (!ignoreEvent)
			{
				menu.hideMenu();
			}
			
			if (!mxEvent.isConsumed(evt) && mxEvent.isPopupTrigger(evt))
			{
				var origin = mxUtils.getScrollOrigin();
				var point = new mxPoint(mxEvent.getClientX(evt) + origin.x,
						mxEvent.getClientY(evt) + origin.y);

				// Menu is shifted by 1 pixel so that the mouse up event
				// is routed via the underlying shape instead of the DIV
				menu.popup(point.x + 1, point.y + 1, null, evt);
				mxEvent.consume(evt, false);
				ignoreEvent = true;
			}
		});
		
		mxEvent.addListener(this.sidebar.moreShapes, 'mousedown', function(evt)
		{
			menu.hideMenu();
			
			if (!mxEvent.isConsumed(evt))
			{
				var origin = mxUtils.getScrollOrigin();
				var point = new mxPoint(mxEvent.getClientX(evt) + origin.x,
						mxEvent.getClientY(evt) + origin.y);
				// Menu is shifted by 1 pixel so that the mouse up event
				// is routed via the underlying shape instead of the DIV
				menu.popup(point.x + 1, point.y + 1, null, evt);
				mxEvent.consume(evt, false);
				ignoreEvent = true;
			}
		});
		
		// NOTE: In quirks mode the event is not the same instance as above
		mxEvent.addListener(document.body, 'mousedown', function(evt)
		{
			if (!ignoreEvent)
			{
				menu.hideMenu();
			}
			
			ignoreEvent = false;
		});
		
		// Disables crisp rendering in SVG except for connectors, actors, cylinder,
		// ellipses must be enabled after rendering the sidebar items
		if (urlParams['aa'] == '0')
		{
			mxShape.prototype.crisp = false;
			mxCellRenderer.prototype.defaultShapes['folder'].prototype.crisp = false;
		}

		// Starts the collab
		if (collab != null && typeof(startCollab) == 'function')
		{
			startCollab();
		}
		
		// Initial page layout view, scrollBuffer and timer-based scrolling
		var graph = this.editor.graph;
		var pageBorder = 800;
		graph.timerAutoScroll = true;

		var graphSizeDidChange = graph.sizeDidChange;
		graph.sizeDidChange = function()
		{
			var bounds = this.getGraphBounds();

			if (this.container != null)
			{
				if (this.scrollbars && !touchStyle)
				{
					var border = this.getBorder();
					
					var t = this.view.translate;
					var s = this.view.scale;
					var width = Math.max(0, bounds.x + bounds.width + 1 + border - t.x * s);
					var height = Math.max(0, bounds.y + bounds.height + 1 + border - t.y * s);
					var fmt = this.pageFormat;
					var ps = this.pageScale;
					var page = new mxRectangle(0, 0, fmt.width * ps, fmt.height * ps);
		
					var hCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(width / (page.width * s))) : 1;
					var vCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(width / (page.height * s))) : 1;
					
					var gb = this.getGraphBounds();
					
					// Computes unscaled, untranslated graph bounds
					var x = (gb.width > 0) ? gb.x / this.view.scale - this.view.translate.x : 0;
					var y = (gb.height > 0) ? gb.y / this.view.scale - this.view.translate.y : 0;
					var w = gb.width / this.view.scale;
					var h = gb.height / this.view.scale;
					
					var fmt = this.pageFormat;
					var ps = this.pageScale;

					var pw = fmt.width * ps;
					var ph = fmt.height * ps;

					var x0 = Math.floor(Math.min(0, x) / pw);
					var y0 = Math.floor(Math.min(0, y) / ph);
					
					hCount -= x0;
					vCount -= y0;
					
					// Extends the page border based on current scale
					var pb = pageBorder;
					
					var minWidth = (pb * 2 + pw * hCount);
					var minHeight = (pb * 2 + ph * vCount);
					var m = graph.minimumGraphSize;

					if (m == null || m.width != minWidth || m.height != minHeight)
					{
						graph.minimumGraphSize = new mxRectangle(0, 0, minWidth, minHeight);
					}

					var autoDx = pb - x0 * fmt.width;
					var autoDy = pb - y0 * fmt.height;
					
					if (!this.autoTranslate && (graph.view.translate.x != autoDx || graph.view.translate.y != autoDy))
					{
						this.autoTranslate = true;
						
						// NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE
						// IS NO WAY AROUND THIS SINCE THE BOUNDS ARE KNOWN AFTER
						// THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A
						// REVALIDATION. SHOULD MOVE TRANSLATE/SCALE TO VIEW.
						var tx = graph.view.translate.x;
						var ty = graph.view.translate.y;
						
						graph.view.setTranslate(autoDx, autoDy);
						graph.container.scrollLeft += (autoDx - tx) * graph.view.scale;
						graph.container.scrollTop += (autoDy - ty) * graph.view.scale;
						
						this.autoTranslate = false;
						return;
					}
				}
				else
				{
					graph.minimumGraphSize = null;
				}
			
				graphSizeDidChange.apply(this, arguments);
			}
		};
		
		// LATER: Cleanup
		graph.getPreferredPageSize = function(bounds, width, height)
		{
			var border = this.getBorder();
			var t = this.view.translate;
			var s = this.view.scale;
			width = Math.max(0, bounds.x + bounds.width + 1 + border - t.x * s);
			height = Math.max(0, bounds.y + bounds.height + 1 + border - t.y * s);
			var fmt = this.pageFormat;
			var ps = this.pageScale;
			var page = new mxRectangle(0, 0, fmt.width * ps, fmt.height * ps);

			var hCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(width / (page.width * s))) : 1;
			var vCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(width / (page.height * s))) : 1;
			
			var gb = this.getGraphBounds();
			
			// Computes unscaled, untranslated graph bounds
			var x = (gb.width > 0) ? gb.x / this.view.scale - this.view.translate.x : 0;
			var y = (gb.height > 0) ? gb.y / this.view.scale - this.view.translate.y : 0;
			var w = gb.width / this.view.scale;
			var h = gb.height / this.view.scale;
			
			var fmt = this.pageFormat;
			var ps = this.pageScale;

			var pw = fmt.width * ps;
			var ph = fmt.height * ps;

			var x0 = Math.floor(Math.min(0, x) / pw);
			var y0 = Math.floor(Math.min(0, y) / ph);
			
			hCount -= x0;
			vCount -= y0;
			
			return new mxRectangle(hCount * page.width + 2, vCount * page.height + 2);
		};

		// LATER: Zoom to multiple pages using minimumGraphSize
		var outlineGetSourceContainerSize = this.editor.outline.getSourceContainerSize;
		this.editor.outline.getSourceContainerSize = function()
		{
			if (graph.scrollbars && ! touchStyle)
			{
				var scale = this.source.view.scale;
				return new mxRectangle(0, 0, this.source.container.scrollWidth - pageBorder * 2 * scale,
					this.source.container.scrollHeight - pageBorder * 2 * scale);
			}
			
			return outlineGetSourceContainerSize.apply(this, arguments);
		};
		
		this.editor.outline.getOutlineOffset = function(scale)
		{
			if (graph.scrollbars && ! touchStyle)
			{
				var fmt = this.source.pageFormat;
				var ps = this.source.pageScale;

				var pw = fmt.width * ps;
				var ph = fmt.height * ps;
				
				var dx = this.outline.container.clientWidth / scale - pw;
				var dy = this.outline.container.clientHeight / scale - ph;

				return new mxPoint(-pageBorder + dx / 2, -pageBorder + dy / 2);
			}
			
			return null;
		};

		graph.sizeDidChange();

		// Sets the default edge
		var cells = [new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none')];
		cells[0].edge = true;
		
		// Uses edge template for connect preview
		graph.connectionHandler.createEdgeState = function(me)
		{
    		return graph.view.createState(cells[0]);
	    };

	    // Creates new connections from edge template
	    graph.connectionHandler.factoryMethod = function()
	    {
    		return graph.cloneCells([cells[0]])[0];
	    };

	    // Switch to page view by default
		this.actions.get('pageView').funct();
		
		var editorUi = this;
		
		if(driveDomain) 
		{
			var userControlsEl = document.createElement('div');
			userControlsEl.style.padding = '4px 12px 5px 10px';
			userControlsEl.style.cssFloat = 'right';
			userControlsEl.style.styleFloat = 'right';
			
			var emailEl = document.createElement('span');
			emailEl.style.display = 'none';
			emailEl.style.cssFloat = 'left';
			emailEl.style.styleFloat = 'left';
			emailEl.style.padding = '0px 8px 5px 10px';
			emailEl.style.fontStyle = 'italic';
			
			var logoutEl = document.createElement('a');
			logoutEl.className = 'geItem';
			logoutEl.style.cssFloat = 'left';
			logoutEl.style.styleFloat = 'left';
			logoutEl.style.display = 'none';
			logoutEl.style.padding = '0px 12px 5px 10px';
			logoutEl.href = 'javascript:void(0);';
			logoutEl.innerHTML = mxResources.get('signOut', 'Sign Out');
			
			mxEvent.addListener(logoutEl, 'mouseup', function(evt) 
			{
				editorUi.userInfo.isLogout = true;// this gets checked in onunload
				// redirect somewhere
				window.location.href = 'http://drive.google.com';
			});
			
			var clearDiv = document.createElement('div');
			clearDiv.style.clear = 'both';
			
			userControlsEl.appendChild(emailEl);
			userControlsEl.appendChild(logoutEl);
			userControlsEl.appendChild(clearDiv);
			editorUi.menubar.container.appendChild(userControlsEl);
			editorUi.userInfo = editorUi.userInfo || {};
			editorUi.userInfo.emailEl = emailEl;
			editorUi.userInfo.logoutEl = logoutEl;
			
			setInterval(function()
			{
				editorUi.checkSession();
			}, 1000);
		}
	};

	/**
	 * Returns the URL for a copy of this editor with no state.
	 */
	EditorUi.prototype.getUrl = function(pathname)
	{
		var href = (pathname != null) ? pathname : window.location.pathname;
		var parms = (href.indexOf('?') > 0) ? 1 : 0;
		
		// Removes template URL parameter for new blank diagram
		for (var key in urlParams)
		{
			if (key != 'tmp' && key != 'libs' && key != 'state' &&
				key != 'fileId' && key != 'code' && key != 'share' &&
				key != 'url')
			{
				if (parms == 0)
				{
					href += '?';
				}
				else
				{
					href += '&';
				}
			
				href += key + '=' + urlParams[key];
				parms++;
			}
		}
		
		return href;
	};

	// Spinner only loaded for Google Drive operations in Init
	function createSpinner(container)
	{
		var opts = {
		  lines: 12, // The number of lines to draw
		  length: 12, // The length of each line
		  width: 5, // The line thickness
		  radius: 10, // The radius of the inner circle
		  rotate: 0, // The rotation offset
		  color: '#000', // #rgb or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  left: container.scrollLeft + container.clientWidth / 2 - 12, // Left position relative to parent in px
		  top: container.scrollTop + container.clientHeight / 2 - 12 // Top position relative to parent in px
		};

		return new Spinner(opts).spin(container);
	};
	
	// Loads the specified template
	var editorUiOpen = EditorUi.prototype.open;
	EditorUi.prototype.open = function()
	{
		// Cross-domain window access is not allowed in FF, so if we
		// were opened from another domain then this will fail.
		var openingFile = false;
		
		try
		{
			openingFile = !(window.opener == null || window.opener.openFile == null);
		}
		catch(e)
		{
			// ignore
		}
		
		// Checks if we're in Google Drive mode
		if (driveDomain)
		{
			// Creates a dummy Google File entry
			this.editor.googleFile =
			{
				'title': 'untitled.html',
				'content': '',
				'mimeType': 'application/mxe',
				'description': ''
			};
		}

		if (!openingFile)
		{
			// Checks if we should connect to a shared diagram
			var documentName = urlParams['share'];
			var urlParam = urlParams['url'];
			
			if (documentName != null)
			{
				this.connect(documentName);
			}
			else if (urlParam != null)
			{
				// Loads diagram from the given URL
				var spinner = createSpinner(this.editor.graph.container);
				this.editor.setStatus(mxResources.get('loading') + '...');
				mxUtils.get('proxy?url=' + urlParam,
					mxUtils.bind(this, function(req)
					{
						spinner.stop();
						if (req.getStatus() != 200)
						{
							this.editor.setStatus(mxResources.get('fileNotLoaded'));
							mxUtils.alert(mxResources.get('fileNotLoaded'));
						}
						else
						{
							var text = req.getText();
							
							if (text != null && text.length > 0)
							{
								var doc = mxUtils.parseXml(text);
								this.editor.setGraphXml(doc.documentElement);
								
								// Restores initial diagram state
								this.editor.modified = false;
								this.editor.undoManager.clear();
								this.editor.filename = null;
								
								this.editor.setStatus('');
								this.editor.graph.container.focus();
							}
							else
							{
								this.editor.setStatus(mxResources.get('fileNotLoaded'));
								mxUtils.alert(mxResources.get('fileNotLoaded'));
							}
						}
					}), function()
					{
						spinner.stop();
						this.editor.setStatus(mxResources.get('errorLoadingFile'));
						mxUtils.alert(mxResources.get('errorLoadingFile'));
					}
				);
			}
			
			// Checks if we're in Google Drive mode
			else if (driveDomain)
			{
				// Checks if a file should be loaded via URL parameters
				var code = urlParams['code'];
				var cparam = (code != null) ? '&code=' + code : '';

				if (urlParams['error'] != null)
				{
					var err = urlParams['error'];
					err = mxResources.get(err) || mxResources.get('notConnected');
					this.editor.setStatus(mxResources.get('error') + ': ' + err);
				}
				else
				{
					var spinner = createSpinner(this.editor.graph.container);
					var fileId = urlParams['fileId'];
					var state = urlParams['state'];

					if (state != null)
					{
						try
						{
							var tmp = JSON.parse(decodeURIComponent(state));
							
							if (tmp.ids != null && tmp.ids.length > 0)
							{
								fileId = tmp.ids[0];
							}
							else if (tmp.parentId != null)
							{
								this.editor.googleFile.parentsCollection = [{'kind': 'drive#fileLink', 'id': tmp.parentId}];
							}
						}
						catch (e)
						{
							// Invalid state ignored
						}
					}
					else if (fileId != null)
					{
						// Required for passing file ID through auth
						state = encodeURIComponent(JSON.stringify({
					      'ids': [fileId],
					      'action': 'open'
						}));
					}
					
					var sparam = (state != null) ? '&state=' + state : '';
					
					if (fileId != null)
					{
						this.editor.setStatus(mxResources.get('loading') + '...');
						var href = '/svc?file_id=' + fileId + sparam + cparam;
						
						if (urlParams['state'] != null)
						{
							href += '&state=' + urlParams['state'];
						}
	
						mxUtils.get(href,
							mxUtils.bind(this, function(req)
							{
								spinner.stop();
								
								if (req.getStatus() == 404)
								{
									this.editor.setStatus(mxResources.get('fileNotFound'));
									mxUtils.alert(mxResources.get('fileNotFound'));
								}
								else if (req.getStatus() != 200)
								{
									window.location.href = req.getText();
								}
								else
								{
									var text = req.getText();
									
									if (text != null && text.length > 0)
									{
										this.editor.googleFile = JSON.parse(text);
										
										var doc = mxUtils.parseXml(this.editor.googleFile.content);
										this.editor.setGraphXml(doc.documentElement);
										
										// Restores initial diagram state
										this.editor.modified = false;
										this.editor.undoManager.clear();
										this.editor.filename = this.editor.googleFile.title;
										
										this.editor.setStatus('');
										this.editor.graph.container.focus();
										
										this.setUserInfo(this.editor.googleFile.email, this.editor.googleFile.id);
									}
									else
									{
										this.editor.setStatus(mxResources.get('fileNotLoaded'));
										mxUtils.alert(mxResources.get('fileNotLoaded'));
									}
								}
							}), function()
							{
								spinner.stop();
								this.editor.setStatus(mxResources.get('errorLoadingFile'));
								mxUtils.alert(mxResources.get('errorLoadingFile'));
							}
						);
					}
					else
					{
						this.editor.setStatus(mxResources.get('connecting') + '...');
						var href = '/svc?status=1' + cparam + sparam;

						mxUtils.get(href,
							mxUtils.bind(this, function(req)
							{
								spinner.stop();
								this.editor.setStatus('');
																
								if (req.getStatus() != 200)
								{
									window.location.href = req.getText();
								}
								else {
									var userInfo = JSON.parse(req.getText());
									this.setUserInfo(userInfo.email, userInfo.id);
								}
							}), function()
							{
								spinner.stop();
							
								this.editor.setStatus(mxResources.get('notConnected'));
								mxUtils.alert(mxResources.get('notConnected'));
							}
						);
					}
				}
			}

			// Opens the given template
			var template = urlParams['tmp'];
			
			if (template != null && template.length > 0)
			{
				mxUtils.get('/templates/xml/' + template + '.xml', mxUtils.bind(this, function(req)
				{
					this.editor.setGraphXml(req.getDocumentElement());
					
					// Restores initial diagram state
					this.editor.modified = false;
					this.editor.undoManager.clear();
				}));
			}
		}
		else
		{
			editorUiOpen.apply(this, arguments);
		}
	};

	/**
	 * Saves the current graph under the given filename.
	 */
	EditorUi.prototype.save = function(name)
	{
		if (name != null)
		{
			var xml = mxUtils.getXml(this.editor.getGraphXml());
			
			try
			{					
				if (this.editor.googleFile != null)
				{
					if (!this.blocking)
					{
						this.blocking = true;
						this.editor.googleFile.title = name;
						this.editor.googleFile.content = xml;
						var spinner = createSpinner(this.editor.graph.container);
						
						var jsonObj =
						{
					      'content': this.editor.googleFile.content,
					      'title': this.editor.googleFile.title,
					      'description': this.editor.googleFile.description,
					      // Replaces all existing mime types with this new one
					      'mimeType': 'application/mxe',
					      'resource_id': this.editor.googleFile.resource_id,
					      'userId' : this.userInfo.id
					    };
						
						// TODO: This is ignored in the Files class, need to add support for it
						if (this.editor.googleFile.parentsCollection != null)
						{
							jsonObj.parentsCollection = this.editor.googleFile.parentsCollection;
						}

						var json = JSON.stringify(jsonObj);
						
						this.editor.setStatus(mxResources.get('saving') + '...');
						var method = (this.editor.googleFile.resource_id != null) ? 'PUT' : 'POST';
						
						var request = new mxXmlRequest('/svc', json, method);
						request.setRequestHeaders = function(rq , params) {
							rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
						};
						
						request.send(
							mxUtils.bind(this, function(req)
							{
								// Stores new file id
								this.editor.googleFile.resource_id = req.getStatus() == 200 ? mxUtils.eval(req.getText()) : this.editor.googleFile.resource_id;
								this.blocking = false;
								spinner.stop();
								
								if (req.getStatus() != 200)
								{
									// Handles app not installed error
									if (req.getStatus() == 403)
									{
										this.editor.setStatus(mxResources.get('appNotInstalledStatus'));
										mxUtils.alert(mxResources.get('appNotInstalledAlert'));
										wnd = window.open(req.getText());
									}
									else
									{
										// Do not redirect to avoid loosing data
										this.editor.setStatus(mxResources.get('fileNotSaved'));
										mxUtils.alert(mxResources.get('failedToSaveTryReconnect') + '...');
	
										var wnd = null;
										
										// Hack to do stuff after new editor loads
										window.openFile = new OpenFile(mxUtils.bind(this, function()
										{
											if (wnd != null)
											{
												window.openFile = null;
												var href = wnd.location.href;
												wnd.close();
												
												// Extracting code from URL
												var index = href.indexOf('?');
												href = '/svc?status=1&' + href.substring(index + 1);
												
												mxUtils.get(href,
													mxUtils.bind(this, function(req)
													{
														this.editor.setStatus('');
														
														if (req.getStatus() == 200)
														{
															// Tries to save again
															this.save(name);
														}
														else
														{
															this.reconnecting = false;
															this.editor.setStatus(mxResources.get('notConnected'));
														}
													}), function()
													{
														this.editor.setStatus(mxResources.get('notConnected'));
													}
												);
											}
										}));
										window.openFile.setConsumer = function()
										{
											this.cancel();
										};
										
										if (!this.reconnecting)
										{
											this.reconnecting = true;
											this.editor.setStatus(mxResources.get('reconnecting') + '...');
											wnd = window.open(req.getText());
										}
										else
										{
											this.reconnecting = false;
											this.editor.setStatus(mxResources.get('notConnected'));
											mxUtils.alert(mxResources.get('notConnected'));
										}
									}
								}
								else
								{
									this.reconnecting = false;
						    		this.editor.filename = name;
									this.editor.modified = false;
									this.editor.setStatus('');
									this.userInfo.emailEl.style.display = 'inline';
									this.userInfo.logoutEl.style.display = 'inline';
									this.userInfo.loggedOut = false;
								}
							}),
							mxUtils.bind(this, function()
							{
								this.blocking = false;
								spinner.stop();
								this.editor.setStatus(mxResources.get('errorSavingFile'));
								mxUtils.alert(mxResources.get('errorSavingFile'));
							})
						);
					}
				}
				else if (useLocalStorage)
				{
					if (localStorage.getItem(name) != null &&
						!mxUtils.confirm(mxResources.get('replace', [name])))
					{
						return;
					}

					localStorage.setItem(name, xml);
					this.editor.setStatus(mxResources.get('saved'));
					
		    		this.editor.filename = name;
					this.editor.modified = false;
				}
				else
				{
					if (xml.length < MAX_REQUEST_SIZE)
					{
						xml = encodeURIComponent(xml);
						new mxXmlRequest(SAVE_URL, 'filename=' + name + '&xml=' + xml).simulate(document, "_blank");
					}
					else
					{
						mxUtils.alert(mxResources.get('drawingTooLarge'));
						mxUtils.popup(xml);
						
						return;
					}

		    		this.editor.filename = name;
					this.editor.modified = false;
				}
			}
			catch (e)
			{
				this.editor.setStatus(mxResources.get('errorSavingFile'));
			}
		}
	};
	
	// Sharing
	EditorUi.prototype.connect = function(name, highlight)
	{
		if (this.sharing == null)
		{
			this.editor.setStatus(mxResources.get('connecting') + '...');
			
			try
			{
				sharejs.open(name, 'json', SHARE_HOST + '/sjs', mxUtils.bind(this, function(error, doc, connection)
				{
					if (doc == null)
					{
						mxUtils.alert(error);
					}
					else
					{
						this.sharing = new Sharing(this.editor.graph.getModel(), doc);
						this.editor.undoManager.clear();
						var url = this.getSharingUrl();
						
						// Together with the overridden hook below, this allows selection inside the input that shows
						// the share URL. It also allows context menu for copy paste, deselects when the focus is lost
						// and selects all if the mouse is clicked inside the input element.
						var select = 'var text=document.getElementById(\'shareUrl\');text.style.backgroundColor=\'\';text.focus();text.select();if(window.event!=null){window.event.cancelBubble=true;}return false;';
						var handlers = 'onmousedown="' + select + '" onclick="' + select + '"';
						
						if (mxClient.IS_IE && mxClient.IS_SVG)
						{
							handlers += ' onblur="document.selection.empty();"';
						}
						else if (mxClient.IS_IE)
						{
							handlers += ' onmouseup="' + select + '"';
						}
						
						var style = 'color:gray;border:0px;margin:0px;';
						
						if (highlight)
						{
							style += 'background-color:yellow;';
						}
		
						var url = this.getSharingUrl();
						var footer = document.getElementById('geFooter');
		
						this.editor.setStatus('<input id="shareUrl" style="' + style +'" type="text" size="50" ' +
							'value="' + url + '" readonly ' + handlers + ' title="' + mxResources.get('shareLink') + '"/>');
						
						connection.on('disconnect', mxUtils.bind(this, function()
						{
							this.disconnect();
							this.editor.setStatus(mxResources.get('notConnected'));
						}));
					}
				}));
			}
			catch (err)
			{
				mxUtils.alert(err);
			}
		}
	};
	
	var editorUiIsSelectionAllowed = EditorUi.prototype.isSelectionAllowed;
	EditorUi.prototype.isSelectionAllowed = function(evt)
	{
		var txt = document.getElementById('shareUrl');
		
		if (txt != null && mxEvent.getSource(evt) == txt)
		{
			return true;
		}
		
		return editorUiIsSelectionAllowed.apply(this, arguments);
	};
	
	// Currently not available via UI
	EditorUi.prototype.disconnect = function()
	{
		if (this.sharing != null)
		{
			this.editor.setStatus('');
			this.sharing.doc.close();
			this.sharing.destroy();
			this.sharing = null;
		}
	};
	
	EditorUi.prototype.getSharingUrl = function()
	{
		if (this.sharing != null)
		{
			var port = (window.location.port != '' && window.location.port != '80') ? (':' + window.location.port) : '';
			var host = window.location.hostname;
			
			if (host == 'drive.diagram.ly')
			{
				host = 'www.draw.io';
			}
			
			return this.getUrl(window.location.protocol + '//' + host + port +
				window.location.pathname + '?share=' + this.sharing.doc.name);
		}
		
		return null;
	};
	
	/**
	 * Toggle palette.
	 */
	Sidebar.prototype.togglePalettes = function(prefix, ids)
	{
		for (var i = 0; i < ids.length; i++)
		{
			this.togglePalette(prefix + ids[i]);
		}
	};

	/**
	 * Toggle palette.
	 */
	Sidebar.prototype.togglePalette = function(id)
	{
		var elts = this.palettes[id];
		
		if (elts != null)
		{
			var vis = (elts[0].style.display == 'none') ? 'block' : 'none';
			
			for (var i = 0; i < elts.length; i++)
			{
				elts[i].style.display = vis;
			}
		}
	};

	// Replaces the sidebar
	Sidebar.prototype.init = function()
	{
		var imgDir = GRAPH_IMAGE_PATH;
		var dir = STENCIL_PATH;

		if (umlDomain)
		{
			this.addUmlPalette(true);
			this.addGeneralPalette(false);
			this.addIconfinder();
		}
		else
		{
			this.addGeneralPalette(true);
			this.addIconfinder();
			this.addUmlPalette(false);
		}

		this.addBpmnPalette(dir, false);
		this.addStencilPalette('flowchart', 'Flowchart', dir + '/flowchart.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addStencilPalette('basic', mxResources.get('basic'), dir + '/basic.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addStencilPalette('arrows', mxResources.get('arrows'), dir + '/arrows.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addImagePalette('computer', 'Clipart / Computer', imgDir
				+ '/lib/clip_art/computers/', '_128x128.png', [ 'Antivirus',
				'Data_Filtering', 'Database', 'Database_Add', 'Database_Minus',
				'Database_Move_Stack', 'Database_Remove', 'Fujitsu_Tablet',
				'Harddrive', 'IBM_Tablet', 'iMac', 'iPad', 'Laptop', 'MacBook',
				'Mainframe', 'Monitor', 'Monitor_Tower',
				'Monitor_Tower_Behind', 'Netbook', 'Network', 'Network_2',
				'Printer', 'Printer_Commercial', 'Secure_System', 'Server',
				'Server_Rack', 'Server_Rack_Empty', 'Server_Rack_Partial',
				'Server_Tower', 'Software', 'Stylus', 'Touch', 'USB_Hub',
				'Virtual_Application', 'Virtual_Machine', 'Virus',
				'Workstation' ]);
		this.addImagePalette('finance', 'Clipart / Finance', imgDir
				+ '/lib/clip_art/finance/', '_128x128.png', [ 'Arrow_Down',
				'Arrow_Up', 'Coins', 'Credit_Card', 'Dollar', 'Graph',
				'Pie_Chart', 'Piggy_Bank', 'Safe', 'Shopping_Cart',
				'Stock_Down', 'Stock_Up' ]);
		this.addImagePalette('clipart', 'Clipart / Various', imgDir
				+ '/lib/clip_art/general/', '_128x128.png', [ 'Battery_0',
				'Battery_100', 'Battery_50', 'Battery_75', 'Battery_allstates',
				'Bluetooth', 'Earth_globe', 'Empty_Folder', 'Full_Folder',
				'Gear', 'Keys', 'Lock', 'Mouse_Pointer', 'Plug', 'Ships_Wheel',
				'Star', 'Tire' ]);
		this.addImagePalette('networking', 'Clipart / Networking', imgDir
				+ '/lib/clip_art/networking/', '_128x128.png', [ 'Bridge',
				'Certificate', 'Certificate_Off', 'Cloud', 'Cloud_Computer',
				'Cloud_Computer_Private', 'Cloud_Rack', 'Cloud_Rack_Private',
				'Cloud_Server', 'Cloud_Server_Private', 'Cloud_Storage',
				'Concentrator', 'Email', 'Firewall_02', 'Firewall',
				'Firewall-page1', 'Ip_Camera', 'Modem',
				'power_distribution_unit', 'Print_Server',
				'Print_Server_Wireless', 'Repeater', 'Router', 'Router_Icon',
				'Switch', 'UPS', 'Wireless_Router', 'Wireless_Router_N' ]);
		this.addImagePalette('people', 'Clipart / People', imgDir
				+ '/lib/clip_art/people/', '_128x128.png', [ 'Suit_Man',
				'Suit_Man_Black', 'Suit_Man_Blue', 'Suit_Man_Green',
				'Suit_Man_Green_Black', 'Suit_Woman', 'Suit_Woman_Black',
				'Suit_Woman_Blue', 'Suit_Woman_Green',
				'Suit_Woman_Green_Black', 'Construction_Worker_Man',
				'Construction_Worker_Man_Black', 'Construction_Worker_Woman',
				'Construction_Worker_Woman_Black', 'Doctor_Man',
				'Doctor_Man_Black', 'Doctor_Woman', 'Doctor_Woman_Black',
				'Farmer_Man', 'Farmer_Man_Black', 'Farmer_Woman',
				'Farmer_Woman_Black', 'Nurse_Man', 'Nurse_Man_Black',
				'Nurse_Man_Green', 'Nurse_Man_Red', 'Nurse_Woman',
				'Nurse_Woman_Black', 'Nurse_Woman_Green', 'Nurse_Woman_Red',
				'Military_Officer', 'Military_Officer_Black',
				'Military_Officer_Woman', 'Military_Officer_Woman_Black',
				'Pilot_Man', 'Pilot_Man_Black', 'Pilot_Woman',
				'Pilot_Woman_Black', 'Scientist_Man', 'Scientist_Man_Black',
				'Scientist_Woman', 'Scientist_Woman_Black', 'Security_Man',
				'Security_Man_Black', 'Security_Woman', 'Security_Woman_Black',
				'Soldier', 'Soldier_Black', 'Tech_Man', 'Tech_Man_Black',
				'Telesales_Man', 'Telesales_Man_Black', 'Telesales_Woman',
				'Telesales_Woman_Black', 'Waiter', 'Waiter_Black',
				'Waiter_Woman', 'Waiter_Woman_Black', 'Worker_Black',
				'Worker_Man', 'Worker_Woman', 'Worker_Woman_Black' ]);
		this.addImagePalette('telco', 'Clipart / Telecommunication', imgDir
				+ '/lib/clip_art/telecommunication/', '_128x128.png', [
				'BlackBerry', 'Cellphone', 'HTC_smartphone', 'iPhone',
				'Palm_Treo', 'Signal_tower_off', 'Signal_tower_on' ]);

		for (var i = 0; i < signs.length; i++)
		{
			this.addStencilPalette('signs' + signs[i], 'Signs / ' + signs[i],
				dir + '/signs/' + signs[i].toLowerCase() + '.xml',
				';fillColor=#000000;strokeColor=none');
		}
		
		for (var i = 0; i < mockups.length; i++)
		{
			this.addStencilPalette('ui' + mockups[i], 'Mockup / ' + mockups[i],
				dir + '/mockup/' + mockups[i].toLowerCase().replace(/ /g, '_') + '.xml');
		}
		
		for (var i = 0; i < ee.length; i++)
		{
			this.addStencilPalette('electrical' + ee[i], 'Electrical / ' + ee[i],
				dir + '/electrical/' + ee[i].toLowerCase().replace(/ /g, '_') + '.xml',
				';fillColor=white;strokeColor=black');
		}

		// Adds AWS stencils
		this.addStencilPalette('awsCompute', 'AWS / Compute', dir + '/aws/compute.xml', ';fillColor=#FF9800;strokeColor=none');
		this.addStencilPalette('awsContentDelivery', 'AWS / Content Delivery', dir + '/aws/content_delivery.xml', ';fillColor=#1EA4DD;strokeColor=none');
		this.addStencilPalette('awsDatabase', 'AWS / Database', dir + '/aws/database.xml', ';fillColor=#6F2D6E;strokeColor=none');
		this.addStencilPalette('awsDeploymentManagement', 'AWS / Deployment Management', dir + '/aws/deployment_management.xml', ';fillColor=#296934;strokeColor=none');
		this.addStencilPalette('awsGroups', 'AWS / Groups', dir + '/aws/groups.xml');
		this.addStencilPalette('awsMessaging', 'AWS / Messaging', dir + '/aws/messaging.xml', ';fillColor=#B8B58A;strokeColor=none');
		this.addStencilPalette('awsMisc', 'AWS / Misc', dir + '/aws/misc.xml', ';fillColor=#F7981F;strokeColor=none');
		this.addStencilPalette('awsNetworking', 'AWS / Networking', dir + '/aws/networking.xml', ';fillColor=#262261;strokeColor=none');
		this.addStencilPalette('awsNonServiceSpecific', 'AWS / Non Service Specific', dir + '/aws/non_service_specific.xml', ';fillColor=#C5C7C9;strokeColor=none');
		this.addStencilPalette('awsOnDemandWorkforce', 'AWS / On Demand Workforce', dir + '/aws/on_demand_workforce.xml', ';fillColor=#C5C7C9;strokeColor=none');
		this.addStencilPalette('awsStorage', 'AWS / Storage', dir + '/aws/storage.xml', ';fillColor=#146EB4;strokeColor=none');

		for (var i = 0; i < pids.length; i++)
		{
			this.addStencilPalette('pid' + pids[i], 'P&ID / ' + pids[i],
				dir + '/pid/' + pids[i].toLowerCase().replace(' ', '_') + '.xml',
				';fillColor=#ffffff;strokeColor=#000000');
		}
		
		this.addStencilPalette('leanMapping', 'Lean Mapping', dir + '/lean_mapping.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addMoreShapes();
	};
	
	// Adds the more shapes entry
	Sidebar.prototype.addMoreShapes = function()
	{
		var elt = this.createTitle(mxResources.get('moreShapes') + '...');
		this.container.appendChild(elt);
		
		// Block handling as link in IE
		mxEvent.addListener(elt, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
		
		this.moreShapes = elt;
 	};
 	
	// Adds the iconfinder library
	Sidebar.prototype.addIconfinder = function()
	{
		// TODO: Fix delayed typing, occasional error in library creation in quirks mode
		var elt = this.createTitle(mxResources.get('images'));
		this.container.appendChild(elt);
		
		var div = document.createElement('div');
		div.className = 'geSidebar';
	    div.style.display = 'none';
		div.style.overflow = 'hidden';
		div.style.width = '100%';
		div.style.padding = '0px';
		
		var inner = document.createElement('div');
		inner.className = 'geTitle';
		inner.style.backgroundColor = 'transparent';
		inner.style.borderColor = 'transparent';
		inner.style.padding = '4px';
		inner.style.textOverflow = 'clip';
		inner.style.cursor = 'default';
		
		if (!mxClient.IS_VML)
		{
			inner.style.paddingRight = '20px';
		}

		var searchResource = mxResources.get('search');
		
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.value = searchResource;
		input.style.border = 'solid 1px #d5d5d5';
		input.style.width = '100%';
		input.style.backgroundImage = 'url(' + IMAGE_PATH + '/clear.gif)';
		input.style.backgroundRepeat = 'no-repeat';
		input.style.backgroundPosition = '100% 50%';
		input.style.paddingRight = '14px';
		inner.appendChild(input);

		var cross = document.createElement('div');
		cross.setAttribute('title', mxResources.get('reset'));
		cross.style.position = 'relative';
		cross.style.left = '-16px';
		cross.style.width = '12px';
		cross.style.height = '14px';
		cross.style.cursor = 'pointer';

		// Workaround for inline-block not supported in IE
		cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
		cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
		
		// Needed to block event transparency in IE
		cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';
		
		var find;

		mxEvent.addListener(cross, 'click', function()
		{
			input.value = '';
			find();
			input.focus();
		});
		
		inner.appendChild(cross);
		div.appendChild(inner);

		var center = document.createElement('center');
		var button = mxUtils.button(searchResource, function()
		{
			find();
		});
		button.setAttribute('disabled', 'true');
		// Workaround for inherited line-height in quirks mode
		button.style.lineHeight = 'normal';
		center.style.paddingTop = '4px';
		center.style.marginBottom = '12px';
		
		center.appendChild(button);
		div.appendChild(center);
		
		var searchTerm = '';
		var modified = false;
		var active = false;
		var complete = false;
		var page = 0;
		var count = 25;
		
		function clearDiv()
		{
			var child = div.firstChild;
			
			while (child != null)
			{
				var next = child.nextSibling;
				
				if (child != inner && child != center)
				{
					child.parentNode.removeChild(child);
				}
				
				child = next;
			}
		};
		
		find = mxUtils.bind(this, function(callback)
		{
			if (input.value != '' || (!modified && input.value == searchResource))
			{
				if (button.getAttribute('disabled') != 'true')
				{
					if (center.parentNode != null)
					{
						if (searchTerm != input.value)
						{
							clearDiv();
							searchTerm = input.value;
							complete = false;
							page = 0;
						}
						
						if (!active)
						{
							button.innerHTML = mxResources.get('loading') + '...';
							active = true;
							mxUtils.get(ICONFINDER_PATH + '?q=' + encodeURIComponent(searchTerm) + '&c=' + count +
									'&p=' + page, mxUtils.bind(this, function(req)
							{
								active = false;
								page++;
								center.parentNode.removeChild(center);
								var icons = req.getXml().getElementsByTagName('icon');
								
								for (var i = 0; i < icons.length; i++)
								{
									var size = null;
									var url = null;
									var child = icons[i].firstChild;
									
									while (child != null && (size == null || url == null))
									{
										if (child.nodeName == 'size')
										{
											size = parseInt(mxUtils.getTextContent(child));
										}
										else if (child.nodeName == 'image')
										{
											url = mxUtils.getTextContent(child);
										}
		
										child = child.nextSibling;
									}
									
									if (size != null && url != null)
									{
										div.appendChild(this.createVertexTemplate('shape=image;image=' + url, size, size, ''));
									}
								}
								
								if (icons.length < count)
								{
									button.setAttribute('disabled', 'true');
									button.innerHTML = mxResources.get('noMoreResults');
									complete = true;
								}
								else
								{
									button.innerHTML = mxResources.get('moreResults');
								}
								
								if (icons.length == 0 && page == 1)
								{
									var err = document.createElement('div');
									err.className = 'geTitle';
									err.style.backgroundColor = 'transparent';
									err.style.borderColor = 'transparent';
									err.style.padding = '4px';
									err.style.textAlign = 'center';
									err.style.cursor = 'default';
									
									mxUtils.write(err, mxResources.get('noResultsFor', [searchTerm]));
									div.appendChild(err);
								}
								
								div.appendChild(center);
							}));
						}
					}
				}
			}
			else
			{
				clearDiv();
				searchTerm = '';
				button.innerHTML = searchResource;
				button.setAttribute('disabled', 'true');
			}
		});
		
		mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(evt)
		{
			if (evt.keyCode == 13 /* Enter */)
			{
				find();
			}
		}));
		
		mxEvent.addListener(input, 'keyup', mxUtils.bind(this, function(evt)
		{
			modified = true;
			
			if (input.value == '' || (!modified && input.value == searchResource))
			{
				button.setAttribute('disabled', 'true');
			}
			else if (input.value != searchTerm)
			{
				button.removeAttribute('disabled');
				button.innerHTML = searchResource;
			}
			else if (!active)
			{
				if (complete)
				{
					button.setAttribute('disabled', 'true');
					button.innerHTML = mxResources.get('noMoreResults');
				}
				else
				{
					button.removeAttribute('disabled');
					button.innerHTML = mxResources.get('moreResults');
				}
			}
		}));
		
		mxEvent.addListener(input, 'focus', mxUtils.bind(this, function(evt)
		{
			if (input.value == searchResource && !modified)
			{
				input.value = '';
			}
		}));
		
		mxEvent.addListener(input, 'blur', mxUtils.bind(this, function(evt)
		{
			if (input.value == '')
			{
				input.value = searchResource;
				modified = false;
			}
		}));
	    
	    // Workaround for blocked text selection in Editor
	    mxEvent.addListener(input, 'mousedown', function(evt)
	    {
	    	if (evt.stopPropagation)
	    	{
	    		evt.stopPropagation();
	    	}
	    	
	    	evt.cancelBubble = true;
	    });
	    
	    // Workaround for blocked text selection in Editor
	    mxEvent.addListener(input, 'selectstart', function(evt)
	    {
	    	if (evt.stopPropagation)
	    	{
	    		evt.stopPropagation();
	    	}
	    	
	    	evt.cancelBubble = true;
	    });
	    
		this.addFoldingHandler(elt, div, function()
		{
			// not lazy
		}, false);
	    
		var outer = document.createElement('div');
	    outer.appendChild(div);
	    this.container.appendChild(outer);
		
	    // Keeps references to the DOM nodes
    	this.palettes['images'] = [elt, outer];
 	};

	// Adds or overrides menus
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);
		var graph = this.editorUi.editor.graph;
		var editorUi = this.editorUi;

		// Adds shapes submenu
		// LATER: Lazy creation of DOM for initially hidden palettes
		this.put('moreShapes', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			var addItem = mxUtils.bind(this, function(names, label, prefix)
			{
				prefix = (prefix != null) ? prefix : '';
				
				var item = menu.addItem(label || names[0], null, mxUtils.bind(this, function()
				{
					this.editorUi.sidebar.togglePalettes(prefix, names);
				}), parent);
				
				if (this.editorUi.sidebar.palettes[prefix + names[0]][0].style.display != 'none')
				{
					this.addCheckmark(item);
				}
			});
			
			addItem(['general'], mxResources.get('general'));
			addItem(['images'], 'Images');
			addItem(['uml'], 'UML');
			addItem(['bpmn'], 'BPMN');
			addItem(['flowchart'], 'Flowchart');
			addItem(['basic'], mxResources.get('basic'));
			addItem(['arrows'], mxResources.get('arrows'));
			addItem(['computer', 'finance', 'clipart', 'networking', 'people', 'telco'], 'Clipart');
			addItem(signs, 'Signs', 'signs');
			addItem(mockups, 'Mockup', 'ui');
			addItem(ee, 'Electrical', 'electrical');
			addItem(['Compute', 'ContentDelivery', 'Database', 'DeploymentManagement',
                     'Groups', 'Messaging', 'Misc', 'Networking', 'NonServiceSpecific',
                     'OnDemandWorkforce', 'Storage'], 'AWS', 'aws');
			addItem(pids, 'P&ID', 'pid');
			addItem(['leanMapping'], 'Lean Mapping');
		})));
		
		this.editorUi.actions.put('new', new Action(mxResources.get('blankDrawing'), mxUtils.bind(this, function()
		{
			window.open(this.editorUi.getUrl());
		})));
		
		this.editorUi.actions.put('newCopy', new Action(mxResources.get('copyOfDrawing'), mxUtils.bind(this, function()
		{
			window.openFile = new OpenFile(mxUtils.bind(this, function()
			{
				this.editorUi.hideDialog();
				window.openFile = null;
			}));
			
			window.openFile.setData(mxUtils.getXml(this.editorUi.editor.getGraphXml()), null);
			window.open(this.editorUi.getUrl());
		})));
		
		this.editorUi.actions.put('newGoogleDrive', new Action('Google Drive ' + mxResources.get('drawing', ['']), mxUtils.bind(this, function()
		{
			window.open(this.editorUi.getUrl('http://drive.diagram.ly'));
		})));
		
		this.editorUi.actions.addAction('fromTemplate', mxUtils.bind(this, function()
		{
			this.editorUi.showDialog(new NewDialog(this.editorUi).container, 680, 540, true, true);
			this.editorUi.dialog.container.style.overflow = 'auto';
		}));
		
		this.editorUi.actions.addAction('fromText', mxUtils.bind(this, function()
		{
			this.editorUi.showDialog(new ParseDialog(this.editorUi).container, 620, 420, true, true);
			this.editorUi.dialog.container.style.overflow = 'auto';
		}));

		// Redirect formatting actions to tinyMce
		var redirectFormatAction = mxUtils.bind(this, function(actionName, cmdName)
		{
			var oldAction = this.editorUi.actions.get(actionName);
			
			this.editorUi.actions.addAction(actionName, mxUtils.bind(this, function()
			{
				var graph = this.editorUi.editor.graph;
				
				if (tinyMCE != null && graph.isEditing() && graph.isHtmlLabel(graph.cellEditor.getEditingCell()))
				{
					tinyMCE.execCommand(cmdName);
				}
				else
				{
					oldAction.funct.apply(this, arguments);
				}
			}));
		});
		
		redirectFormatAction('bold', 'bold');
		redirectFormatAction('italic', 'italic');
		redirectFormatAction('underline', 'underline');
		redirectFormatAction('cut', 'cut');
		redirectFormatAction('copy', 'copy');
		redirectFormatAction('paste', 'paste');
		redirectFormatAction('undo', 'undo');
		redirectFormatAction('redo', 'redo');
		redirectFormatAction('selectAll', 'selectall');

		if (driveDomain)
		{
			this.editorUi.actions.addAction('open', mxUtils.bind(this, function()
			{
				if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined')
				{
					var view = new google.picker.View(google.picker.ViewId.DOCS);
		            view.setMimeTypes('application/mxe');

					new google.picker.PickerBuilder().
						addView(view).
			            setAppId(420247213240).
			            setAuthUser(editorUi.userInfo.id).
			            enableFeature(google.picker.Feature.NAV_HIDDEN).
			            enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
			            setCallback(function(data)
	    				{
	    			        if (data.action == google.picker.Action.PICKED)
	    			        {
	    			        	for (var i = 0; i < data.docs.length; i++)
	    			        	{
	    			        		window.open('http://drive.diagram.ly?fileId=' + data.docs[i].id);
	    			        	}
	    			        }
	    			    }).
			            build().
			            setVisible(true);
				}
				else
				{
					window.open('http://drive.google.com');
				}
			}));
		}
		else if (typeof(urlParams['fp']) != 'undefined')
		{
			// Replaces I/O actions to use filepicker.io
			this.editorUi.actions.addAction('open', mxUtils.bind(this, function()
			{
				var ui = this.editorUi;
				
				if (typeof(filepicker) != 'undefined')
				{
				    // Seting up Filepicker.io with your api key
				    filepicker.setKey(urlParams['fp']);

				    // Asks for a file
				    filepicker.getFile(filepicker.MIMETYPES.ALL, {'modal': true, services:
				    	[filepicker.SERVICES.COMPUTER, filepicker.SERVICES.BOX, filepicker.SERVICES.DROPBOX,
				    	 filepicker.SERVICES.GITHUB, filepicker.SERVICES.GMAIL, filepicker.SERVICES.URL]},
				        function(url, metadata){
					    	filepicker.getContents(url, function(data)
					    	{
								window.openFile = new OpenFile(function()
								{
									ui.hideDialog();
									window.openFile = null;
								});
								
								window.openFile.setData(data, url);
								window.open(ui.getUrl());
					    	});
				        }
				    );
				}
				else
				{
					window.openNew = true;
					window.openKey = 'open';
					
					ui.openFile();
				}
			}));
			
			this.editorUi.actions.addAction('saveAs', mxUtils.bind(this, function()
			{
				var ui = this.editorUi;
				
				if (typeof(filepicker) != 'undefined')
				{
				    filepicker.setKey(urlParams['fp']);
					var fileContents = mxUtils.getXml(ui.editor.getGraphXml());
					
					filepicker.getUrlFromData(fileContents, function(url, metadata)
					{
						// TODO: Include save to email option
						filepicker.saveAs(url, 'application/mxe', {services:
					    	[filepicker.SERVICES.BOX, filepicker.SERVICES.DROPBOX, filepicker.SERVICES.SEND_EMAIL, filepicker.SERVICES.COMPUTER]},
						function(savedUrl)
						{
							ui.editor.filename = savedUrl;
							ui.editor.setStatus(mxResources.get('saved') + ': ' + savedUrl);
						});
					})
				}
				else
				{
					ui.saveFile(true);
				}
			}));
			
			this.editorUi.actions.addAction('save', mxUtils.bind(this, function()
			{
				var ui = this.editorUi;
				
				if (typeof(filepicker) != 'undefined' && ui.editor.filename != null)
				{
				    var req = new mxXmlRequest(ui.editor.filename, mxUtils.getXml(ui.editor.getGraphXml()));
				    req.setRequestHeaders = function(request, params)
				    {
				    	request.setRequestHeader('Content-Type', 'text/plain');
				    };
				    
				    ui.editor.setStatus(mxResources.get('saving') + ': ' + ui.editor.filename);
				    req.send(function(req)
				    {
				    	console.log(req.getStatus());
				    	
				    	if (req.getStatus() == 200)
				    	{
					    	var tmp = JSON.parse(req.getText());
					    	
					    	if (tmp.error != null)
					    	{
					    		ui.editor.setStatus(tmp.error);
								mxUtils.alert(tmp.error);
					    	}
					    	else
					    	{
								ui.editor.setStatus(mxResources.get('saved') + ': ' + ui.editor.filename);
					    	}
				    	}
				    	else
				    	{
				    		ui.editor.setStatus(mxResources.get('errorSavingFile'));
							mxUtils.alert(mxResources.get('errorSavingFile'));
				    	}
					},
					function(req)
				    {
						ui.editor.setStatus(mxResources.get('errorSavingFile'));
						mxUtils.alert(mxResources.get('errorSavingFile'));
					});
				}
				else
				{
					this.editorUi.actions.get('saveAs').funct();
				}
			}));
		}
		
		this.editorUi.actions.addAction('export', mxUtils.bind(this, function()
		{
			this.editorUi.showDialog(new ExportDialog(this.editorUi).container, 300, 220, true, true);
		}), null, null, 'Ctrl+E');
		this.editorUi.actions.addAction('share', mxUtils.bind(this, function()
		{
			this.editorUi.showDialog(new ShareDialog(this.editorUi).container, 340, 100, true, true);
		}));
		this.editorUi.actions.put('about', new Action(mxResources.get('aboutDrawio'), mxUtils.bind(this, function()
		{
			this.editorUi.showDialog(new AboutDialog(this.editorUi).container, 300, 330, true, true);
		}), null, null, 'F1'));
		this.editorUi.actions.put('didYouKnow', new Action(mxResources.get('didYouKnow'), mxUtils.bind(this, function()
		{
			window.open('http://forum.jgraph.com/questions/4162');
		})));
		this.editorUi.actions.put('help', new Action(mxResources.get('forum'), mxUtils.bind(this, function()
		{
			window.open('http://forum.jgraph.com/');
		})));
		this.editorUi.actions.put('github', new Action('Fork me on GitHub', mxUtils.bind(this, function()
		{
			window.open('https://github.com/jgraph/draw.io');
		})));
		this.editorUi.actions.addAction('image', function()
		{
			function updateImage(value, w, h)
			{
				var select = null;
				var cells = graph.getSelectionCells();
				
				graph.getModel().beginUpdate();
	        	try
	        	{
	        		// Inserts new cell if no cell is selected
	    			if (cells.length == 0)
	    			{
	    				var gs = graph.getGridSize();
	    				cells = [graph.insertVertex(graph.getDefaultParent(), null, '', gs, gs, w, h)];
	    				select = cells;
	    			}
	    			
	        		graph.setCellStyles(mxConstants.STYLE_IMAGE, value, cells);
		        	graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
		        	
		        	if (graph.getSelectionCount() == 1)
		        	{
			        	if (w != null && h != null)
			        	{
			        		var cell = cells[0];
			        		var geo = graph.getModel().getGeometry(cell);
			        		
			        		if (geo != null)
			        		{
			        			geo = geo.clone();
				        		geo.width = w;
				        		geo.height = h;
				        		graph.getModel().setGeometry(cell, geo);
			        		}
			        	}
		        	}
	        	}
	        	finally
	        	{
	        		graph.getModel().endUpdate();
	        	}
	        	
	        	if (select != null)
	        	{
	        		graph.setSelectionCells(select);
	        		graph.scrollCellToVisible(select[0]);
	        	}
			};
			
			if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined')
			{
				// Note: Photos and Upload requires login
				var picker = new google.picker.PickerBuilder().
		            addView(google.picker.ViewId.IMAGE_SEARCH);
				
				// Extended picker adds image upload
				if (driveDomain || urlParams['picker'] == '2')
				{
					var view = new google.picker.View(google.picker.ViewId.DOCS);
				    view.setMimeTypes("image/png,image/jpeg,image/jpg");
				    picker.addView(view);
				    picker.addView(google.picker.ViewId.PHOTO_UPLOAD);
					picker.addView(google.picker.ViewId.PHOTOS);
				}
				else
				{
					picker.enableFeature(google.picker.Feature.NAV_HIDDEN);
				}
				
				var wnd = picker.setCallback(function(data)
				{
			        if (data.action == google.picker.Action.PICKED)
			        {
			        	// Larger images are at this index: data.docs[0].thumbnails.length - 1
			        	var thumb = data.docs[0].thumbnails[0];
			        	var i = 0;
			        	
			        	while (thumb.width < 100 && thumb.height < 100 &&
			        			data.docs[0].thumbnails.length > i + 1)
			        	{
			        		thumb = data.docs[0].thumbnails[++i];	
			        	}

			        	if (thumb != null)
			        	{
			        		updateImage(thumb.url, Number(thumb.width), Number(thumb.height));
			        	}
			        }
			    }).build();
		        wnd.setVisible(true);
			}
			else
			{
		    	var value = '';
		    	var state = graph.getView().getState(graph.getSelectionCell());
		    	
		    	if (state != null)
		    	{
		    		value = state.style[mxConstants.STYLE_IMAGE] || value;
		    	}
		
		    	value = mxUtils.prompt(mxResources.get('enterValue') + ' (' + mxResources.get('url') + ')', value);
		
		    	if (value != null)
		    	{
		    		if (value.length > 0)
		    		{
			    		var img = new Image();
			    		
			    		img.onload = function()
			    		{
			    			updateImage(value, img.width, img.height);
			    		};
			    		img.onerror = function()
			    		{
			    			mxUtils.alert(mxResources.get('fileNotFound'));
			    		};
			    		
			    		img.src = value;
		    		}
		        }
			}
		});
		
		this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['didYouKnow', 'help', '-', 'github', '-', 'about']);
			
			if (urlParams['test'] == '1')
			{
				// For testing local PNG export
				if (typeof(jsCanvas) != 'undefined')
				{
					mxResources.parse('pngExport=PNG Export (Local)');
					
					this.editorUi.actions.addAction('pngExport', mxUtils.bind(this, function()
					{
						var scale = 1;
						var bounds = this.editorUi.editor.graph.getGraphBounds();
						var canvas = document.createElement('canvas');
						canvas.setAttribute('width', Math.ceil(bounds.width * scale));
						canvas.setAttribute('height', Math.ceil(bounds.height * scale));

						var htmlCanvas = new jsCanvas(canvas);
						htmlCanvas.scale(scale);
						htmlCanvas.translate(-bounds.x, -bounds.y);
						
						var imgExport = new mxImageExport();
						imgExport.drawState(this.editorUi.editor.graph.getView().getState(this.editorUi.editor.graph.model.root), htmlCanvas);

						htmlCanvas.finish(mxUtils.bind(this, function()
						{
							// see above
							document.body.appendChild(canvas);
							canvas.style.border = '1px solid gray';
							this.editorUi.showDialog(canvas, 640, 480, true, true);
							this.editorUi.dialog.container.style.overflow = 'auto';
						}));
					}));
					
					this.addMenuItems(menu, ['-', 'pngExport'], parent);
				}
				
				// For testing local PDF export
				if (typeof(jsPDF) != 'undefined')
				{
					mxResources.parse('pdfExport=PDF Export (Local)');
					
					this.editorUi.actions.addAction('pdfExport', mxUtils.bind(this, function()
					{
						var pdfCanvas = new jsPDF();
						pdfCanvas.scale(1 / this.editorUi.editor.graph.pageScale);
						var imgExport = new mxImageExport();
						imgExport.drawState(this.editorUi.editor.graph.getView().getState(this.editorUi.editor.graph.model.root), pdfCanvas);
			
						// Optional - set properties on the document
						pdfCanvas.setProperties(
						{
							title: this.editorUi.editor.getFilename(),
							creator: 'draw.io'
						});
			
						// Asynchronous handling of output (required for images) requires
						// the window to be opened in the event handling code so that it
						// is not getting blocked and displayed as a tab (not a window).
						var wnd = window.open('about:blank');
			
						pdfCanvas.finish(function()
						{
							var pdf = pdfCanvas.output();
							wnd.location.href = 'data:application/pdf;base64,' + Base64.encode(pdf, true);
						});
					}));
					
					this.addMenuItems(menu, ['pdfExport'], parent);
				}

				mxResources.parse('snapshot=Snapshot');
				mxResources.parse('debug=Debug');
				
				this.editorUi.actions.addAction('snapshot', mxUtils.bind(this, function()
				{
					if (this.editorUi.sharing != null)
					{
						console.log(this.editorUi.sharing.doc);
					}
				}));
				
				this.editorUi.actions.addAction('debug', mxUtils.bind(this, function()
				{
					if (this.editorUi.sharing != null)
					{
						this.editorUi.sharing.logging = !this.editorUi.sharing.logging;
						
						if (this.editorUi.sharing.logging)
						{
							mxLog.show();
						}
						
						mxLog.debug('Debugging ' + ((this.editorUi.sharing.logging) ? 'enabled' : 'disabled'));
					}
					else
					{
						mxLog.debug('Document not shared');
					}
				}));
				
				this.addMenuItems(menu, ['-', 'snapshot', 'debug'], parent);
				
				mxResources.parse('showConsole=Show Console');
				this.editorUi.actions.addAction('showConsole', function() { mxLog.show(); });
				this.addMenuItems(menu, ['-', 'showConsole']);
			}
		})));
		this.put('new', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addMenuItems(menu, ['new', 'newCopy', '-', 'fromTemplate', 'fromText'], parent);

			if (!driveDomain)
			{
				this.addMenuItems(menu, ['-', 'newGoogleDrive'], parent);				
			}
			
		})));
		// Adds shapes submenu in file menu
		this.editorUi.actions.addAction('embed', mxUtils.bind(this, function()
		{
			this.editorUi.showDialog(new EmbedDialog(this.editorUi).container, 620, 420, true, true);
		}));
		
		this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.addSubmenu('new', menu, parent);
			this.addMenuItems(menu, ['open', '-', 'save', 'saveAs', '-', 'export', 'share', 'embed', '-', 'import', 'editFile', '-', 'pageSetup', 'print'], parent);
		})));
	};

	// Replaces save button if alternative I/O is available (Chrome Dev-Channel or Flash)
	EditorUi.prototype.replaceSaveButton = function(elt, dataCallback, filenameCallback, onComplete)
	{
		var result = null;
		var wnd = window;
		wnd.URL = wnd.webkitURL || wnd.URL;
		wnd.BlobBuilder = wnd.BlobBuilder || wnd.WebKitBlobBuilder || wnd.MozBlobBuilder;

		// Prefers BLOB Builder API in Chrome
		/*
		 * if (mxClient.IS_GC && (wnd.URL != null && wnd.BlobBuilder != null)) { // Experimental Chrome feature result = mxUtils.button(mxResources.get('save'),
		 * mxUtils.bind(this, function() { var bb = new wnd.BlobBuilder(); bb.append(dataCallback());
		 * 
		 * var a = wnd.document.createElement('a'); a.download = filenameCallback(); a.href = wnd.URL.createObjectURL(bb.getBlob('text/plain'));
		 * a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
		 * 
		 * var evt = document.createEvent("MouseEvents"); evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		 * var allowDefault = a.dispatchEvent(evt); onComplete(); }));
		 * 
		 * elt.parentNode.replaceChild(result, elt); } else
		 */
		// FIXME:
		// - Possible to hover over button in IE (near right border)
		// - Removes focus from input element while entering filename
		// - No full hover simulation possible, only focus on button
		if (typeof(swfobject) != 'undefined' && swfobject.hasFlashPlayerVersion("10") && typeof(Downloadify) != 'undefined')
		{
			result = document.createElement('span');
			elt.parentNode.insertBefore(result, elt);
			
			// Adds a Flash object as a button
			Downloadify.create(result,
			{
				data: dataCallback,
				filename: filenameCallback,
				onComplete: onComplete,
				onCancel: function() { },
				onError: function() { },
				swf: 'js/downloadify/downloadify.swf',
				downloadImage: 'js/downloadify/transparent.png',
				width: elt.offsetWidth + 2,
				height: elt.offsetHeight + 2,
				transparent: true,
				append: true
			});
			
			// Fixes vertical shift of OBJECT node
			var dx = '-6px';
			
			if (mxClient.IS_IE && document.documentMode == 9)
			{
				dx = '-7px';
			}
			else if (mxClient.IS_IE)
			{
				dx = '-3px';
			}
			
			result.style.display = 'inline';
			result.style.position = 'absolute';
			result.style.left = (elt.offsetLeft + 20) + 'px';
			result.style.height = (elt.offsetHeight + 2) + 'px';
			result.style.width = (elt.offsetWidth + 2) + 'px';
			result.firstChild.style.marginBottom = dx;
			
			mxEvent.addListener(result, 'mouseover', function(evt)
			{
				elt.focus();
			});

			mxEvent.addListener(result, 'mouseout', function(evt)
			{
				elt.blur();
			});
		}
		
		return result;
	};
	
	// Extends Save Dialog to replace Save button
	if (!useLocalStorage)
	{
		EditorUi.prototype.saveFile = function(forceDialog)
		{
			// Required to use new SaveDialog below
			if (!forceDialog && this.editor.filename != null)
			{
				this.save(this.editor.getOrCreateFilename());
			}
			else
			{
				this.showDialog(new SaveDialog(this).container, 300, (driveDomain) ? 150 : 80, true, true);
			}
			
			// Extends code for using flash in save button
			if (this.dialog != null)
			{
				// Finds elements inside the current dialog
				var findElt = mxUtils.bind(this, function(tagName)
				{
					var elts = document.getElementsByTagName(tagName);

					for (var i = 0; i < elts.length; i++)
					{
						var parent = elts[i].parentNode;
						
						while (parent != null)
						{
							if (parent == this.dialog.container)
							{
								return elts[i];
							}
							
							parent = parent.parentNode;
						}
					}
					
					return null;
				});
				
				// Replaces the Save button
				var input = findElt('input');
				var saveBtn = findElt('button');
				
				if (input != null && saveBtn != null)
				{
					this.replaceSaveButton(saveBtn,
						mxUtils.bind(this, function() { return mxUtils.getXml(this.editor.getGraphXml()); }),
						mxUtils.bind(this, function() { return input.value; }),
						mxUtils.bind(this, function()
						{
							this.editor.filename = input.value;
							this.editor.modified = false;
							this.hideDialog();
						}
					));
				}
			}
		};
	}

	// Sets default style (used in editor.get/setGraphXml below)
	var graphLoadStylesheet = Graph.prototype.loadStylesheet;
	Graph.prototype.loadStylesheet = function()
	{
		graphLoadStylesheet.apply(this, arguments);
		this.currentStyle = 'default-style2';
	};

	// Adds support for old stylesheets
	var editorSetGraphXml = Editor.prototype.setGraphXml;
	Editor.prototype.setGraphXml = function(node)
	{
		if (node.nodeName == 'mxGraphModel')
		{
			var style = node.getAttribute('style');

			// Decodes the style if required
			if (style == null || style == '')
			{
				var node2 = mxUtils.load(STYLE_PATH + '/default-old.xml').getDocumentElement();
				var dec2 = new mxCodec(node2.ownerDocument);
				dec2.decode(node2, this.graph.getStylesheet());
			}
			else if (style != this.graph.currentStyle)
			{
			    var node2 = mxUtils.load(STYLE_PATH + '/' + style + '.xml').getDocumentElement();
				var dec2 = new mxCodec(node2.ownerDocument);
				dec2.decode(node2, this.graph.getStylesheet());
				this.graph.currentStyle = style;
			}

			this.graph.currentStyle = style;
		}
		
		// Will call updateGraphComponents
		editorSetGraphXml.apply(this, arguments);
	};

	// Adds persistent state to file
	var editorGetGraphXml = Editor.prototype.getGraphXml;	
	Editor.prototype.getGraphXml = function()
	{
		var node = editorGetGraphXml.apply(this, arguments);
		
		// Encodes the current style
		if (this.graph.currentStyle != null)
		{
			node.setAttribute('style', this.graph.currentStyle);
		}

		return node;
	};
	
	if(driveDomain) 
	{
		EditorUi.prototype.setUserInfo = function(email, userId) 
		{
			var editorUi = this;
			editorUi.userInfo = editorUi.userInfo || {};
			editorUi.userInfo.id = userId;
			editorUi.userInfo.email = email;
			editorUi.userInfo.loggedOut = false;
			
			editorUi.userInfo.emailEl.style.display = 'inline';
			editorUi.userInfo.logoutEl.style.display = 'inline';
			editorUi.userInfo.emailEl.innerHTML = email;
			
			//mxEvent.removeListener(editorUi.userInfo.logoutEl, 'mouseup');
			
			
			window.onunload = function() 
			{
				if(editorUi.userInfo.isLogout)// attempt to clear cookies only if user clicked the 'Sign Out' link
				{
					var cookies = document.cookie.split(";");
					// only clear the cookie if it belongs to the current user
					if(editorUi.getUserIdFromCookie() == editorUi.userInfo.id) 
					{
						editorUi.clearCookies();
					}
				}
			}
		};
		
		EditorUi.prototype.getUserIdFromCookie = function()
		{
			var cookies = document.cookie.split(";");
			var id = null;
			for (var i = 0; i < cookies.length; i++) 
		    {
				var cookie = cookies[i];
				var isDriveCookie = cookie.indexOf('drive') != -1;
				if(!isDriveCookie) 
				{
					continue;
				}
				else {
					var parts = cookie.split('=');
					id = parts[1];
				}
		    }
			
			return id;
		};
	
		EditorUi.prototype.checkSession = function() 
		{
			var cookieId = this.getUserIdFromCookie();
			// do nothing if it's a newly opened page
			if(typeof this.userInfo.id === 'undefined' || this.userInfo.loggedOut === 'undefined') 
			{
				return;
			}
			
			// if the cookies value has changed, notify the user about the end of the session
			if((this.userInfo.id != null && this.userInfo.id != cookieId && !this.userInfo.loggedOut) || (cookieId == null && !this.userInfo.loggedOut)) 
			{
				this.userInfo.loggedOut = true;// this is to avoid spamming about the end of session
				this.userInfo.emailEl.style.display = 'none';
				this.userInfo.logoutEl.style.display = 'none';
				this.showDialog(new LogoutPopup(this).container, 320, 80, true, true);
			}
		};
		
		EditorUi.prototype.clearCookies = function()
		{
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) 
			{
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		};
		
		LogoutPopup = function(ui) 
		{
			var div = document.createElement('div');
			div.setAttribute('align', 'center');
			
			mxUtils.write(div, mxResources.get('userLoggedOut') + ' ' + ui.userInfo.email);
			mxUtils.br(div);
			mxUtils.br(div);
			
			div.appendChild(mxUtils.button(mxResources.get('close'), function()
			{
				ui.hideDialog();
			}));
			
			this.container = div;
		}
	}
	
})();
