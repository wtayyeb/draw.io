/*
 * $Id: Diagramly.js,v 1.40 2012-10-24 15:56:33 boris Exp $
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
	Sidebar.prototype.signs = signs;

	// Adds all mockup stencils
	var mockups = ['Calendars', 'Carousel', 'Charts and Tables', 'Controls', 'Form Elements', 'Menus and Buttons', 'Misc', 'Tabs'];
	Sidebar.prototype.mockups = mockups;

	// Adds all Electrical stencils
	var ee = ['Abstract', 'Capacitors', 'Diodes', 'Electro-mechanical', 'IEC logic gates', 'IEC417', 'Inductors',
	         'Instruments', 'Logic gates', 'Miscellaneous', 'MOSFETs1', 'MOSFETs2', 'Op amps', 'Opto-electronics',
	         'PLC ladder', 'Power semiconductors', 'Radio', 'Resistors', 'Signal sources', 'Thermionic devices',
	         'Transistors', 'Waveforms'];
	Sidebar.prototype.ee = ee;

	// Adds all PID stencils
	var pids = ['Compressors', 'Heat Exchangers', 'Instruments', 'Pumps', 'Valves', 'Vessels'];
	Sidebar.prototype.pids = pids;
	
	// Default submenu image is replaced in Diagram.ly for black menu
	// so we have to change the URL to point to our local image
	mxPopupMenu.prototype.submenuImage = IMAGE_PATH + '/submenu.gif';

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
	
})();
