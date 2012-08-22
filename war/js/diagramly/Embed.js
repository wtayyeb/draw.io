(function(stylesheet, stencils)
{
	// Parses the given stencil set
	mxStencilRegistry.parseStencilSet = function(xmlDocument, postStencilLoad, install)
	{
		install = (install != null) ? install : true;
		var root = xmlDocument.documentElement;
		var shape = root.firstChild;
		var packageName = '';
		var name = root.getAttribute('name');
		
		if (name != null)
		{
			packageName = name + '.';
		}
		
		while (shape != null)
		{
			if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				name = shape.getAttribute('name');
				
				if (name != null)
				{
					var w = shape.getAttribute('w');
					var h = shape.getAttribute('h');
					
					w = (w == null) ? 80 : parseInt(w, 10);
					h = (h == null) ? 80 : parseInt(h, 10);
					
					packageName = packageName.toLowerCase();
					var stencilName = name.replace(/ /g,"_");
						
					if (install)
					{
						mxStencilRegistry.addStencil(packageName + stencilName.toLowerCase(), new mxStencil(shape));
					}
	
					if (postStencilLoad != null)
					{
						postStencilLoad(packageName, stencilName, name, w, h);
					}
				}
			}
			
			shape = shape.nextSibling;
		}
	};
	
	// Sets shadow color
	mxConstants.SHADOWCOLOR = '#d0d0d0';
	
	// Support for HTML labels via style
	mxGraph.prototype.isHtmlLabel = function(cell)
	{
		var state = this.view.getState(cell);
		var style = (state != null) ? state.style : this.getCellStyle(cell);
		
		return style['html'] == '1';
	};

	// Returns the label for the given cell
	var mxGraphConvertValueToString = mxGraph.prototype.convertValueToString;
	mxGraph.prototype.convertValueToString = function(cell)
	{
		if (cell.value != null && typeof(cell.value) == 'object')
		{
			return cell.value.getAttribute('label');
		}
		
		return mxGraphConvertValueToString.apply(this, arguments);
	};

	// Returns the link for the given cell
	mxGraph.prototype.getLinkForCell = function(cell)
	{
		if (cell.value != null && typeof(cell.value) == 'object')
		{
			return cell.value.getAttribute('link');
		}
		
		return null;
	};
	
	// Adds domain for images without domain
	mxGraph.prototype.getImageFromBundles = function(key)
	{
		if (key != null)
		{
			if (key.charAt(0) == '/')
			{
				return '//diagramly.appspot.com' + key;
			}
		}
		
		return null;
	};
	
	if (stencils != null)
	{
		for (var i = 0; i < stencils.length; i++)
		{
			var xmlDoc = mxUtils.parseXml(stencils[i]);
			mxStencilRegistry.parseStencilSet(xmlDoc);
		}
	}
	
	(function()
	{
		if (mxClient.isBrowserSupported())
		{
			var divs = document.getElementsByTagName('*');
			
			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className.toString().indexOf('mxgraph') >= 0)
				{
					(function(container)
					{
						try
						{
							var child = container.firstChild;
							
							while (child != null && child.nodeType != mxConstants.NODETYPE_ELEMENT)
							{
								child = child.nextSibling;
							}
							
							var xml = child.innerHTML;
							
							if (xml.substring(0, 16) == '&lt;mxGraphModel')
							{
								xml = xml.replace(/&lt;/g, '<').replace(/&gt;/g, '>').
									replace(/&amp;gt;/g, '&gt;').replace(/&amp;lt;/g, '&lt;').
									replace(/&amp;quot;/g, '&quot;').replace(/&#xa;/g, '\n');
							}
							else
							{
								xml = decodeURIComponent(xml);
							}
							
							var xmlDocument = mxUtils.parseXml(xml);
							
							if (xmlDocument.documentElement != null && xmlDocument.documentElement.nodeName == 'mxGraphModel')
							{
								var decoder = new mxCodec(xmlDocument);
								var node = xmlDocument.documentElement;
	
								container.innerHTML = '';
	
								var graph = new mxGraph(container);
								graph.resetViewOnRootChange = false;
								// NOTE: Tooltips require CSS
								graph.setTooltips(false);
								graph.setEnabled(false);
							    
								// Loads the stylesheet
								if (stylesheet != null)
								{
									var xmlDoc = mxUtils.parseXml(stylesheet);
									var dec = new mxCodec(xmlDoc);
									dec.decode(xmlDoc.documentElement, graph.getStylesheet());
								}
								
								// Enables panning with left mouse button
								var pan = node.getAttribute('pan');
								
								if (pan != '0')
								{
									graph.panningHandler.useLeftButtonForPanning = true;
									graph.panningHandler.ignoreCell = true;
									container.style.cursor = 'move';
									graph.setPanning(true);
								}
								else
								{
									container.style.cursor = 'default';
								}
								
								var resize = node.getAttribute('resize');
								var border = Number(node.getAttribute('border') || 0);
								graph.border = border;

								var fit = node.getAttribute('fit');
								
								if ((fit != '1' && resize != '0') || (divs[i].style.width == '' && divs[i].style.height == ''))
								{
									graph.resizeContainer = true;
									graph.centerZoom = false;
								}
								else
								{
									graph.centerZoom = true;
								}
								
								
								// Adds handling for hyperlinks
								// FIXME: For panning links
								// TODO: Add link checkbox in embed dialog
								var hl = node.getAttribute('highlight');
								var links = node.getAttribute('links');
								
								if (links != '0')
								{
									var cursor = container.style.cursor;
							    	var tol = graph.getTolerance();
									
									graph.addMouseListener(
									{
									    currentState: null,
									    currentLink: null,
									    highlight: (hl != null) ? new mxCellHighlight(graph, hl, 2) : null,
									    startX: 0,
									    startY: 0,
									    mouseDown: function(sender, me)
									    {
									    	this.startX = me.getGraphX();
									    	this.startY = me.getGraphY();
									    },
									    mouseMove: function(sender, me)
									    {
									    	if (graph.isMouseDown)
									    	{
									    		if (this.currentLink != null)
									    		{
											    	var dx = Math.abs(this.startX - me.getGraphX());
											    	var dy = Math.abs(this.startY - me.getGraphY());
											    	
											    	if (dx > tol || dy > tol)
											    	{
											    		this.clear();
											    	}
									    		}
									    	}
									    	else
									    	{
										    	if (this.currentState != null && (me.getState() == this.currentState || me.getState() == null) &&
										    		graph.intersects(this.currentState, me.getGraphX(), me.getGraphY()))
										    	{
									    			return;
										    	}
										    	
												var tmp = graph.view.getState(me.getCell());
		
										      	if (tmp != this.currentState)
										      	{
										        	if (this.currentState != null)
										        	{
										          		this.clear();
										        	}
										        
									        		this.currentState = tmp;
										        
										        	if (this.currentState != null)
										        	{
										          		this.activate(this.currentState);
										        	}
										      	}
									    	}
									    },
									    mouseUp: function(sender, me)
									    {
									    	var tmp = this.currentLink;
									    	this.clear();
									    	
									    	if (tmp != null) 
									    	{
									    		window.open(tmp);
									    	}
									    },
									    activate: function(state)
									    {
									    	this.currentLink = graph.getLinkForCell(state.cell);
									    	
									    	if (this.currentLink != null)
									    	{
									    		container.setAttribute('title', this.currentLink);
									    		container.style.cursor = 'pointer';
									    		
									    		if (this.highlight != null)
									    		{
									    			this.highlight.highlight(state);
									    		}
									    	}
									    },
									    clear: function()
									    {
									    	container.removeAttribute('title');
									    	container.style.cursor = cursor;
									    	this.currentState = null;
									    	this.currentLink = null;
									    	
									    	if (this.highlight != null)
									    	{
									    		this.highlight.hide();
									    	}
									    }
									});
								}
								
								var x0 = Number(node.getAttribute('x0') || 0);
								var y0 = Number(node.getAttribute('y0') || 0);
								graph.view.translate.x = -x0 + border;
								graph.view.translate.y = -y0 + border;
								
								decoder.decode(node, graph.getModel());
								
								if (fit != '0')
								{
									graph.fit(border);
									
									if (resize == '1')
									{
										graph.resizeContainer = true;
										graph.centerZoom = false;
									}
								}
								
								var zoom = node.getAttribute('zoom');
								
								if (zoom != '0')
								{
									// Adds zoom buttons in top, left corner
									var buttons = document.createElement('div');
									buttons.style.position = 'absolute';
									buttons.style.overflow = 'visible';
									buttons.style.cursor = 'pointer';
		
									var bs = graph.getBorderSizes();
									
									var left = 0;
									var fontSize = 10;
									var bw = 16;
									var bh = 16;
									
									if (mxClient.IS_QUIRKS)
									{
										bw -= 1;
										bh -= 1;
									}
									else if (mxClient.IS_TOUCH)
									{
										bw = 24;
										bh = 24;
										var fontSize = 14;
										
										// Replaces overflow for touch devices
										container.style.overflow = 'scroll';
									}
									
									function addButton(label, funct)
									{
										var btn = document.createElement('div');
										btn.style.position = 'absolute';
										btn.style.border = '1px solid gray';
										btn.style.textAlign = 'center';
										btn.style.cursor = 'hand';
										btn.style.width = bw + 'px';
										btn.style.height = bh + 'px';
										btn.style.left = left + 'px';
										btn.style.top = '0px';
										btn.style.backgroundColor = 'white';
										mxUtils.setOpacity(btn, 50);
										
										var table = document.createElement('table');
										table.style.borderWidth = '0px';
										table.style.width = '100%';
										table.style.height = '100%';
										var tbody = document.createElement('tbody');
										var tr = document.createElement('tr');
										var td = document.createElement('td');
										td.style.verticalAlign = 'middle';
										td.style.textAlign = 'center';
										td.style.fontSize = fontSize + 'px';
										td.style.padding = '0px';
										mxUtils.write(td, label);
										tr.appendChild(td);
										tbody.appendChild(tr);
										table.appendChild(tbody);
										btn.appendChild(table);
										
										mxEvent.addListener(btn, 'mouseup', function(evt)
										{
											funct();
											mxEvent.consume(evt);
										});
										
										mxEvent.addListener(btn, 'mousedown', function(evt)
										{
											mxEvent.consume(evt);
										});
										
										left += bw;
										
										buttons.appendChild(btn);
									};
									
									addButton('+', function()
									{
										graph.zoomIn();
									});
									
									addButton('-', function()
									{
										graph.zoomOut();
									});
									
									if (!mxClient.IS_TOUCH)
									{
										function show()
										{
											buttons.style.top = (container.offsetTop + bs.y) + 'px';
											buttons.style.left = (container.offsetLeft + bs.x) + 'px';
											buttons.style.visibility = 'visible';
										};
										
										function hide()
										{
											buttons.style.visibility = 'hidden';
										};
										
										mxEvent.addListener(container, 'mouseover', show);
										mxEvent.addListener(buttons, 'mouseover', show);
										mxEvent.addListener(container, 'mouseout', hide);
										mxEvent.addListener(buttons, 'mouseout', hide);
										hide();
									}

									if (container.nextSibling != null)
									{
										container.parentNode.insertBefore(buttons, container.nextSibling);
									}
									else
									{
										container.appendChild(buttons);
									}
								}
							}
						}
						catch (err)
						{
							// ignore
							throw err;
						}
					})(divs[i]);
				}
			}
		}
	})();
// Last line will be replaced by servlet for passing arguments.
})();
