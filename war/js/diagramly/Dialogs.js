/*
 * $Id: Dialogs.js,v 1.18 2012-08-31 08:56:49 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
/**
 * Constructs a new save dialog.
 */
function SaveDialog(editorUi)
{
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, mxResources.get('filename') + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	var desc = null;

	if (driveDomain && editorUi.editor.googleFile != null)
	{
		row = document.createElement('tr');
		
		td = document.createElement('td');
		td.style.fontSize = '10pt';
		td.style.width = '100px';
		mxUtils.write(td, 'Description:');
		
		row.appendChild(td);
		
		desc = document.createElement('textarea');
		desc.value = editorUi.editor.googleFile.description || '';
		desc.style.width = '180px';
		desc.style.height = '60px';

		td = document.createElement('td');
		td.appendChild(desc);
		row.appendChild(td);
		
		tbody.appendChild(row);
	}

	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');

	var saveBtn = mxUtils.button(mxResources.get('save'), function()
	{
		if (desc != null)
		{
			// Resets the file entry to avoid replacing the old file
			editorUi.editor.googleFile =
			{
				'title': nameInput.value,
				'content': '',
				'mimeType': 'application/mxe',
				'description': ''
			};
			
			editorUi.editor.googleFile.description = desc.value;
		}
		
    	editorUi.save(nameInput.value);
    	editorUi.hideDialog();
	});
	
	td.appendChild(saveBtn);
	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new embed dialog.
 * TODO: Add links, highlight (color) options.
 */
function EmbedDialog(editorUi)
{
	var div = document.createElement('div');

	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
	var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);

	var textarea = document.createElement('textarea');
	textarea.style.width = '610px';
	textarea.style.height = '270px';
	textarea.style.resize = 'none';

	div.appendChild(textarea);

	mxUtils.write(div, mxResources.get('options') + ': ');
	
	var panCheckBox = document.createElement('input');
	panCheckBox.setAttribute('type', 'checkbox');
	panCheckBox.setAttribute('checked', 'checked');
	div.appendChild(panCheckBox);
	mxUtils.write(div, mxResources.get('pan') + ' ');

	var zoomCheckBox = document.createElement('input');
	zoomCheckBox.setAttribute('type', 'checkbox');
	zoomCheckBox.setAttribute('checked', 'checked');
	div.appendChild(zoomCheckBox);
	mxUtils.write(div, mxResources.get('zoom') + ' ');
	
	var resizeCheckBox = document.createElement('input');
	resizeCheckBox.setAttribute('type', 'checkbox');
	resizeCheckBox.setAttribute('checked', 'checked');
	div.appendChild(resizeCheckBox);
	mxUtils.write(div, mxResources.get('resize') + ' ');
	
	var fitCheckBox = document.createElement('input');
	fitCheckBox.setAttribute('type', 'checkbox');
	div.appendChild(fitCheckBox);
	mxUtils.write(div, mxResources.get('fit') + ' ');
	
	var scrollbarsCheckBox = document.createElement('input');
	scrollbarsCheckBox.setAttribute('type', 'checkbox');
	div.appendChild(scrollbarsCheckBox);
	mxUtils.write(div, mxResources.get('scrollbars') + ' ');
	
	var inlineCheckBox = document.createElement('input');
	inlineCheckBox.setAttribute('type', 'checkbox');
	div.appendChild(inlineCheckBox);
	mxUtils.write(div, mxResources.get('inline') + ' ');
	
	mxUtils.br(div);
	
	mxUtils.write(div, mxResources.get('width') + ': ');
	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'text');
	widthInput.setAttribute('size', '4');
	widthInput.value = Math.ceil(bounds.width / scale);
	div.appendChild(widthInput);
	
	mxUtils.write(div, ' ' + mxResources.get('height') + ': ');
	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'text');
	heightInput.setAttribute('size', '4');
	heightInput.value = Math.ceil(bounds.height / scale);
	div.appendChild(heightInput);
	
	mxUtils.write(div, ' ' + mxResources.get('borderWidth') + ': ');
	var borderInput = document.createElement('input');
	borderInput.setAttribute('type', 'text');
	borderInput.setAttribute('size', '4');
	borderInput.value = '0';
	div.appendChild(borderInput);
	
	mxUtils.write(div, ' ' + mxResources.get('backgroundColor') + ': ');
	var backgroundInput = document.createElement('input');
	backgroundInput.setAttribute('type', 'text');
	backgroundInput.setAttribute('size', '7');
	backgroundInput.value = graph.background;
	div.appendChild(backgroundInput);

	var textarea2 = document.createElement('textarea');
	textarea2.style.width = '610px';
	textarea2.style.height = '34px';
	textarea2.style.resize = 'none';

	mxUtils.br(div);
	
	mxUtils.write(div, mxResources.get('embedNotice') + ': ');
	
	div.appendChild(textarea2);
	
	var node = editorUi.editor.getGraphXml();
	var s = '';
	
	// Scans shapes for stencils
	var stencilNames = new Object();
	var states = graph.view.states.getValues();
	
	for (var i = 0; i < states.length; i++)
	{
		var state = states[i];
		var shape = state.style[mxConstants.STYLE_SHAPE];
		var basename = mxStencilRegistry.getBasenameForStencil(shape);
		
		if (basename != null)
		{
			if (stencilNames[basename] == null)
			{
				stencilNames[basename] = true;
				s += basename + ';';
			}
		}
	}
	
	if (s.length > 0)
	{
		s = '?s=' + s.substring(0, s.length - 1);
	}

	textarea2.value = '<script type="text/javascript" src="//diagramly.appspot.com/embed.js' + s + '"></script>';

	function update()
	{
		// Adds embed attributes
		node.setAttribute('x0', x0);
		node.setAttribute('y0', y0);
		node.setAttribute('pan', (panCheckBox.checked) ? '1': '0');
		node.setAttribute('zoom', (zoomCheckBox.checked) ? '1': '0');
		node.setAttribute('resize', (resizeCheckBox.checked) ? '1': '0');
		node.setAttribute('fit', (fitCheckBox.checked) ? '1': '0');
		node.setAttribute('border', borderInput.value);
		
		// Hidden attributes
		node.setAttribute('links', '1');
		// Highlight can contain a color code for links
		//node.setAttribute('highlight', '1');
		
		var xml = Base64.encode(RawDeflate.deflate(encodeURIComponent(mxUtils.getXml(node))), true);
		var style = 'position:relative;overflow:' + ((scrollbarsCheckBox.checked) ? 'auto' : 'hidden') + ';';
		
		if (widthInput.value != '')
		{
			style += 'width:' + widthInput.value + 'px;';
		}
		
		if (heightInput.value != '')
		{
			style += 'height:' + heightInput.value + 'px;';
		}
		
		if (backgroundInput.value != '')
		{
			style += 'background-color:' + backgroundInput.value + ';';
		}
		
		if (inlineCheckBox.checked)
		{
			style += 'display:inline-block;_display:inline;';
		}
		
		// Appspot URL allows https and avoids cookies
		textarea.value = '<div class="mxgraph" style="' + style + '">' +
			'<div style="width:1px;height:1px;overflow:hidden;">' + xml + '</div></div>\n';
	};
	
	update();
	
	mxEvent.addListener(panCheckBox, 'change', update);
	mxEvent.addListener(zoomCheckBox, 'change', update);
	mxEvent.addListener(resizeCheckBox, 'change', update);
	mxEvent.addListener(fitCheckBox, 'change', update);
	mxEvent.addListener(scrollbarsCheckBox, 'change', update);
	mxEvent.addListener(inlineCheckBox, 'change', update);
	mxEvent.addListener(widthInput, 'change', update);
	mxEvent.addListener(heightInput, 'change', update);
	mxEvent.addListener(borderInput, 'change', update);
	mxEvent.addListener(backgroundInput, 'change', update);
	
	var buttons = document.createElement('div');
	buttons.style.paddingTop = '6px';
	buttons.style.textAlign = 'right';

	buttons.appendChild(mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	}));
	
	div.appendChild(buttons);
	
	this.container = div;
};

/**
 * Constructs a new parse dialog.
 */
function ParseDialog(editorUi)
{
	function parse(text)
	{
		var lines = text.split('\n');
		var vertices = new Object();
		var cells = [];
		
		function getOrCreateVertex(id)
		{
			var vertex = vertices[id];

			if (vertex == null)
			{
				vertex = new mxCell(id, new mxGeometry(0, 0, 80, 30));
				vertex.vertex = true;
				vertices[id] = vertex;
				cells.push(vertex);
			}
			
			return vertex;
		};
		
		for (var i = 0; i < lines.length; i++)
		{
			if (lines[i].charAt(0) != ';')
			{
				var values = lines[i].split('->');
				
				if (values.length == 2)
				{
					var source = getOrCreateVertex(values[0]);
					var target = getOrCreateVertex(values[1]);
					
					var edge = new mxCell('', new mxGeometry());
					edge.edge = true;
					source.insertEdge(edge, true);
					target.insertEdge(edge, false);
					cells.push(edge);
				}
			}
		}
		
		if (cells.length > 0)
		{
			var graph = editorUi.editor.graph;
			
			graph.getModel().beginUpdate();
			try
			{
				cells = graph.importCells(cells);
				
				for (var i = 0; i < cells.length; i++)
				{
					if (graph.getModel().isVertex(cells[i]))
					{
						var size = graph.getPreferredSizeForCell(cells[i]);
						cells[i].geometry.width = Math.max(cells[i].geometry.width, size.width);
						cells[i].geometry.height = Math.max(cells[i].geometry.height, size.height);
					}
				}

				var layout = new mxFastOrganicLayout(graph);
				layout.disableEdgeStyle = false;
				layout.forceConstant = 120;
				layout.execute(graph.getDefaultParent());
				
				graph.moveCells(cells, 20, 20);
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	};
	
	var div = document.createElement('div');
	div.style.textAlign = 'right';
	
	var textarea = document.createElement('textarea');
	textarea.style.width = '600px';
	textarea.style.height = '374px';
	
	textarea.value = ';example\na->b\nb->c\nc->a\n';
	div.appendChild(textarea);
	
	// Enables dropping files
	if (fileSupport)
	{
		function handleDrop(evt)
		{
		    evt.stopPropagation();
		    evt.preventDefault();
		    
		    if (evt.dataTransfer.files.length > 0)
		    {
		    	var file = evt.dataTransfer.files[0];
    			
				var reader = new FileReader();
				reader.onload = function(e) { textarea.value = e.target.result; };
				reader.readAsText(file);
    		}
		};
		
		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}

	div.appendChild(mxUtils.button(mxResources.get('open'), function()
	{
		parse(textarea.value);
		editorUi.hideDialog();
	}));
	
	div.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	this.container = div;
};

// Constructs a dialog for creating new files from templates.
function NewDialog(editorUi)
{
	var div = document.createElement('div');
	
	// Defines the templates for NewDialog (see below)
	var templates = ['aws1&libs=general', 'bpmn1&libs=general;bpmn', 'compare1', 'flowchart1&libs=general;flowchart', 'flowchart2&libs=general;flowchart', 'gantt1', 'lean1', 'mindmap1&libs=general', 'orgchart1&libs=general;flowchart', 'orgchart2&libs=general;flowchart', 'package1', 'pid1', 'plcladder1&libs=general;plc_ladder',
	                 'seqdiag1&libs=general', 'sitemap1&libs=general', 'socnet1', 'stardelta', 'statemachine1&libs=general', 'uml1&libs=uml', 'usecase1&libs=general', 'venn1&libs=general', 'wf1&libs=general;flowchart'];
	
	for (var i = 0; i < templates.length; i++)
	{
		var img = document.createElement('img');
		img.style.margin = '10px';
		img.setAttribute('border', '0');
		var base = templates[i];
		var index = base.indexOf('&');
		
		if (index > 0)
		{
			base = base.substring(0, index);
		}
		
		img.setAttribute('src', '/templates/images/' + base + '.png');
		
		var href = editorUi.getUrl(window.location.pathname + '?tmp=' + templates[i]);
		var link = document.createElement('a');
		link.setAttribute('href', 'javascript:void(0);');
		link.setAttribute('target', '_blank');
		link.appendChild(img);
		
		(function(url)
		{
			mxEvent.addListener(link, 'click', function(evt)
			{
				window.open(url);
				editorUi.hideDialog();
				mxEvent.consume(evt);
			});
		})(href);
		
		div.appendChild(link);
	}
	
	mxUtils.br(div);
	mxUtils.br(div);
	div.appendChild(mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	}));
	
	this.container = div;
};

// Constructs a new about dialog.
function AboutDialog(editorUi)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('aboutDiagramly'));
	h3.style.marginTop = '10px';
	div.appendChild(h3);
	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.style.width = '176px';
	img.style.height = '151px';
	img.setAttribute('src', IMAGE_PATH + '/logo.png');
	img.setAttribute('title', 'mxGraph v ' + mxClient.VERSION);
	div.appendChild(img);
	mxUtils.br(div);
	mxUtils.write(div, 'Diagramly is an example application built using the ');
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.jgraph.com/mxgraph.html');
	link.setAttribute('target', '_blank');
	mxUtils.write(link, 'mxGraph JavaScript Diagramming library');
	div.appendChild(link);
	mxUtils.br(div);
	div.innerHTML += '&copy; 2012 JGraph Ltd.';
	mxUtils.br(div);
	mxUtils.br(div);
	div.appendChild(mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	}));
	
	this.container = div;
};

/**
 * Constructs a new export dialog.
 */
function ExportDialog(editorUi)
{
	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	
	var width = Math.ceil(bounds.width / scale);
	var height = Math.ceil(bounds.height / scale);

	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, mxResources.get('filename') + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);
		
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('format') + ':');
	
	row.appendChild(td);
	
	var imageFormatSelect = document.createElement('select');
	imageFormatSelect.style.width = '180px';

	var pngOption = document.createElement('option');
	pngOption.setAttribute('value', 'png');
	mxUtils.write(pngOption, 'PNG - Portable Network Graphics');
	imageFormatSelect.appendChild(pngOption);

	var gifOption = document.createElement('option');
	gifOption.setAttribute('value', 'gif');
	mxUtils.write(gifOption, 'GIF - Graphics Interchange Format');
	imageFormatSelect.appendChild(gifOption);
	
	var jpgOption = document.createElement('option');
	jpgOption.setAttribute('value', 'jpg');
	mxUtils.write(jpgOption, 'JPG - JPEG File Interchange Format');
	imageFormatSelect.appendChild(jpgOption);

	var pdfOption = document.createElement('option');
	pdfOption.setAttribute('value', 'pdf');
	mxUtils.write(pdfOption, 'PDF - Portable Document Format');
	imageFormatSelect.appendChild(pdfOption);
	
	var svgOption = document.createElement('option');
	svgOption.setAttribute('value', 'svg');
	mxUtils.write(svgOption, 'SVG - Scalable Vector Graphics');
	imageFormatSelect.appendChild(svgOption);
	
	var xmlOption = document.createElement('option');
	xmlOption.setAttribute('value', 'xml');
	mxUtils.write(xmlOption, 'XML - Diagramly XML Document');
	imageFormatSelect.appendChild(xmlOption);

	td = document.createElement('td');
	td.appendChild(imageFormatSelect);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('backgroundColor') + ':');
	
	row.appendChild(td);
	
	var backgroundInput = document.createElement('input');
	backgroundInput.setAttribute('value', (graph.background || '#FFFFFF'));
	backgroundInput.style.width = '80px';

	var backgroundCheckbox = document.createElement('input');
	backgroundCheckbox.setAttribute('type', 'checkbox');

	td = document.createElement('td');
	td.appendChild(backgroundInput);
	td.appendChild(backgroundCheckbox);
	mxUtils.write(td, mxResources.get('transparent'));
	
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('width') + ':');
	
	row.appendChild(td);
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('value', width);
	widthInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(widthInput);
	row.appendChild(td);

	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('height') + ':');
	
	row.appendChild(td);
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('value', height);
	heightInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(heightInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('borderWidth') + ':');
	
	row.appendChild(td);
	
	var borderInput = document.createElement('input');
	borderInput.setAttribute('value', width);
	borderInput.style.width = '180px';
	borderInput.value = '0';

	td = document.createElement('td');
	td.appendChild(borderInput);
	row.appendChild(td);

	tbody.appendChild(row);
	table.appendChild(tbody);
	
	// Handles changes in the export format
	function formatChanged()
	{
		var name = nameInput.value;
		var dot = name.lastIndexOf('.');
		
		if (dot > 0)
		{
			nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
		}
		else
		{
			nameInput.value = name + '.' + imageFormatSelect.value;
		}
		
		if (imageFormatSelect.value === 'xml')
		{
			widthInput.setAttribute('disabled', 'true');
			heightInput.setAttribute('disabled', 'true');
			borderInput.setAttribute('disabled', 'true');
		}
		else
		{
			widthInput.removeAttribute('disabled');
			heightInput.removeAttribute('disabled');
			borderInput.removeAttribute('disabled');
		}
		
		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg')
		{
			backgroundCheckbox.removeAttribute('disabled');
		}
		else
		{
			backgroundCheckbox.setAttribute('disabled', 'disabled');
		}
	};
	
	mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
	formatChanged();
	
	function checkValues()
	{
		if (widthInput.value > MAX_WIDTH || widthInput.value < 0)
		{
			widthInput.style.backgroundColor = 'red';
		}
		else
		{
			widthInput.style.backgroundColor = '';
		}
		
		if (heightInput.value > MAX_HEIGHT || heightInput.value < 0)
		{
			heightInput.style.backgroundColor = 'red';
		}
		else
		{
			heightInput.style.backgroundColor = '';
		}
	};

	mxEvent.addListener(widthInput, 'change', function()
	{
		if (width > 0)
		{
			heightInput.value = Math.ceil(parseInt(widthInput.value) * height / width);
		}
		else
		{
			heightInput.value = '0';
		}
		
		checkValues();
	});

	mxEvent.addListener(heightInput, 'change', function()
	{
		if (height > 0)
		{
			widthInput.value = Math.ceil(parseInt(heightInput.value) * width / height);
		}
		else
		{
			widthInput.value = '0';
		}
		
		checkValues();
	});

	// Resuable image export instance
	var imgExport = new mxImageExport();
	
	function getSvg()
	{
		var border = Math.max(0, parseInt(borderInput.value)) + 1;
		var scale = parseInt(widthInput.value) / width;
	    var bounds = graph.getGraphBounds();

	    // Prepares SVG document that holds the output
	    var svgDoc = mxUtils.createXmlDocument();
	    var root = (svgDoc.createElementNS != null) ?
	    	svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');
	    
		if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE && !backgroundCheckbox.checked)
		{
			if (root.style != null)
			{
				root.style.backgroundColor = backgroundInput.value;
			}
			else
			{
				root.setAttribute('style', 'background-color:' + backgroundInput.value);
			}
		}
	    
	    if (svgDoc.createElementNS == null)
	    {
	    	root.setAttribute('xmlns', mxConstants.NS_SVG);
	    }
	    
	    root.setAttribute('width', (Math.ceil(bounds.width * scale) + 2 * border) + 'px');
	    root.setAttribute('height', (Math.ceil(bounds.height * scale) + 2 * border) + 'px');
	    root.setAttribute('version', '1.1');
	    svgDoc.appendChild(root);

	    // Render graph
	    var svgCanvas = new mxSvgCanvas2D(root);
	    svgCanvas.scale(scale);
	    svgCanvas.translate(Math.floor(-bounds.x) + border, Math.floor(-bounds.y) + border);
	    imgExport.drawState(graph.getView().getState(graph.model.root), svgCanvas);

		return mxUtils.getXml(root);
	};
	
	function getXml()
	{
		return mxUtils.getXml(editorUi.editor.getGraphXml());
	};

	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '10px';
	td.setAttribute('align', 'right');
	var saveBtn = mxUtils.button(mxResources.get('save'), mxUtils.bind(this, function()
	{
		if (parseInt(widthInput.value) <= 0 && parseInt(heightInput.value) <= 0)
		{
			mxUtils.alert(mxResources.get('drawingEmpty'));
		}
		else
		{
			var format = imageFormatSelect.value;
	    	var name = nameInput.value;
	    	
	        if (format == 'xml')
	    	{
	        	var xml = encodeURIComponent(getXml());
				new mxXmlRequest(SAVE_URL, 'filename=' + name + '&xml=' + xml).simulate(document, "_blank");
	    	}
	        else if (format == 'svg')
	    	{
				var xml = getSvg();
				
				if (xml.length < MAX_REQUEST_SIZE)
				{
					xml = encodeURIComponent(xml);
					new mxXmlRequest(SAVE_URL, 'filename=' + name + '&format=' + format +
							'&xml=' + xml).simulate(document, "_blank");
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
					mxUtils.popup(xml);
				}
	    	}
	        else
	        {
				var border = Math.max(0, parseInt(borderInput.value)) + 1;
				var scale = parseInt(widthInput.value) / width;
				var bounds = graph.getGraphBounds();
				
	        	// New image export
				var xmlDoc = mxUtils.createXmlDocument();
				var root = xmlDoc.createElement('output');
				xmlDoc.appendChild(root);
				var xmlCanvas = new mxXmlCanvas2D(root);
				
				// Render graph
				xmlCanvas.scale(scale);
				xmlCanvas.translate(Math.floor(-bounds.x * scale) + border, Math.floor(-bounds.y * scale) + border);
				imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

				// Puts request data together
				var w = Math.ceil(bounds.width * scale) + 2 * border;
				var h = Math.ceil(bounds.height * scale) + 2 * border;
				var xml = mxUtils.getXml(root);
				
				// Requests image if request is valid
				if (xml.length <= MAX_REQUEST_SIZE && width < MAX_WIDTH && width > 0 &&
					height < MAX_HEIGHT && height > 0)
				{
					var bg = '';
					
					if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE &&
						(format != 'png' || !backgroundCheckbox.checked))
					{
						bg = '&bg=' + backgroundInput.value;
					}
					
					// NOTE: Overridden request parameter name for Amazon export (plain=xml)
					new mxXmlRequest(EXPORT_URL, 'filename=' + name + '&format=' + format +
	        			bg + '&w=' + w + '&h=' + h + '&plain=' + encodeURIComponent(xml)).
	        			simulate(document, '_blank');
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
				}
	    	}
	        
			editorUi.hideDialog();
		}
	}));
	td.appendChild(saveBtn);
	td.appendChild(mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	}));
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	var newSaveBtn = null;
	
	// NOTE: saveBtn must be in DOM when replaceSaveButton is called
	// LATER: Add hooks in original dialog
	mxEvent.addListener(imageFormatSelect, 'change', function()
	{
		var format = imageFormatSelect.value;
    	
        if (format == 'xml')
    	{
        	if (newSaveBtn == null)
        	{
				newSaveBtn = editorUi.replaceSaveButton(saveBtn, getXml,
					mxUtils.bind(this, function() { return nameInput.value; }),
					mxUtils.bind(this, function()
					{
						editorUi.hideDialog();
					}
				));
        	}
        	else if (newSaveBtn != null && newSaveBtn.style.display == 'none')
    		{
        		newSaveBtn.style.display = 'inline';
    		}
    	}
        else if (format == 'svg')
    	{
        	if (newSaveBtn == null)
        	{
				newSaveBtn = editorUi.replaceSaveButton(saveBtn, getSvg,
					mxUtils.bind(this, function() { return nameInput.value; }),
					mxUtils.bind(this, function()
					{
						editorUi.hideDialog();
					}
				));
        	}
        	else if (newSaveBtn != null && newSaveBtn.style.display == 'none')
    		{
        		newSaveBtn.style.display = 'inline';
    		}
    	}
        else if (newSaveBtn != null && newSaveBtn.style.display != 'none')
    	{
        	newSaveBtn.style.display = 'none';
    	}
	});
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

function ShareDialog(editorUi)
{
	var connected = editorUi.sharing != null;
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.fontSize = '10pt';
	td.style.whiteSpace = 'nowrap';
	td.style.width = '340px';

	// TODO: Generate GUID on server-side
	function randomString(count)
	{
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var result = [];
		
		for (var i = 0; i < count; i++)
		{
			result[i] = chars.charAt(Math.floor(Math.random() * chars.length));
		}
		
		return result.join('');
	};
	
	var shareButton = mxUtils.button(mxResources.get('share'), function()
	{
		editorUi.connect('#' + randomString(50), true);
		editorUi.hideDialog();
	});

	shareButton.setAttribute('disabled', 'disabled');
	
	if (connected)
	{
		var select = 'var text=document.getElementById(\'shareDialogUrl\');text.focus();text.select();if(window.event!=null){window.event.cancelBubble=true;}return false;';
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
		var url = editorUi.getSharingUrl();

		td.innerHTML = mxResources.get('shareLink') +
			':<br/><input id="shareDialogUrl" style="' + style +'" type="text" size="50" ' +
			'value="' + url + '" readonly ' + handlers + '" title="' + url + '"/>...'
	}
	else
	{
		td.innerHTML = mxResources.get('connecting') + '...<br/><br/>';
		
		// Cross browser isAlive check
		var img = new Image();
		img.onload = function()
		{
			td.innerHTML = mxResources.get('sharingServerReady') + '<br/>' +
			 	'<span style="color:gray;font-size:10px;">' + mxResources.get('sharingServerNotice')+ '</span>';
			shareButton.removeAttribute('disabled');
		};
		img.onerror = function()
		{
			td.style.color = 'red';
			td.innerHTML =  mxResources.get('sharingServerUnavailable') + '<br/><br/>';
		};
		
		img.src = SHARE_HOST + '/dummy.gif?param='+new Date().getTime();
	}
	
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');
	var td2 = document.createElement('td');
	td2.colSpan = 2;
	td2.style.paddingTop = '20px';
	td2.style.whiteSpace = 'nowrap';
	td2.setAttribute('align', 'right');

	if (!connected)
	{
		td2.appendChild(shareButton);
		td2.appendChild(mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();
		}));
	}
	else
	{
		td2.appendChild(mxUtils.button(mxResources.get('ok'), function()
		{
			editorUi.hideDialog();
		}));
	}
	
	row.appendChild(td2);
	tbody.appendChild(row);
	
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};
