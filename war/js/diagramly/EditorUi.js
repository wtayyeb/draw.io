(function() 
{
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
		var signs = this.sidebar.signs;
		var mockups = this.sidebar.mockups;
		var ee = this.sidebar.ee;
		var pids = this.sidebar.pids;
		
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
			stc = 'general;images;uml;bpmn;flowchart;basic;arrows;clipart';
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
								this.editor.googleFile.parents = [{'kind': 'drive#fileLink', 'id': tmp.parentId}];
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
						
						if (this.editor.googleFile.parents != null)
						{
							jsonObj.parents = this.editor.googleFile.parents;
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
			/*
			if(window.location.href.indexOf('code') != -1) 
			{
				window.location.replace(editorUi.removeVariableFromURL(window.location.href, 'code'));
			}*/
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
		
		/*EditorUi.prototype.removeVariableFromURL = function(url_string, variable_name) 
		{
		    var url = String(url_string);
		    var regex = new RegExp( "\\?" + variable_name + "=[^&]*&?", "gi");
		    url = url.replace(regex,'?');
		    regex = new RegExp( "\\&" + variable_name + "=[^&]*&?", "gi");
		    url = url.replace(regex,'&');
		    url = url.replace(/(\?|&)$/,'');
		    regex = null;
		    return url;
		};*/
		
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