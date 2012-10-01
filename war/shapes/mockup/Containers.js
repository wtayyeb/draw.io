//**********************************************************************************************************************************************************
//Webcam
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupWebcam.prototype = new mxShapeMockup();
mxShapeMockupWebcam.prototype.constructor = mxShapeMockupWebcam;

mxShapeMockupWebcam.prototype.origWidth = 200;
mxShapeMockupWebcam.prototype.origHeight = 200;
mxShapeMockupWebcam.prototype.origAspect = mxShapeMockupWebcam.prototype.origWidth / mxShapeMockupWebcam.prototype.origHeight;


function mxShapeMockupWebcam(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupWebcam.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.head = document.createElement('v:shape');
	this.configureVmlShape(this.head);
	node.appendChild(this.head);

	this.eyes = document.createElement('v:shape');
	this.configureVmlShape(this.eyes);
	node.appendChild(this.eyes);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;

	return node;
};

mxShapeMockupWebcam.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.head = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.head);
	this.eyes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.eyes);
	return this.g;
};

mxShapeMockupWebcam.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.head);
	this.updateVmlShape(this.eyes);

	this.background.path = this.createPath(arg, 'background');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.head.path = this.createPath(arg, 'head');
	this.eyes.path = this.createPath(arg, 'eyes');

//	this.head.filled = fillColor === 'none' ? 'false' : 'true';
	this.head.strokecolor = strokeColor;
	this.head.fillcolor = fillColor;
	this.head.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.eyes.filled='true';
	this.eyes.strokecolor = strokeColor;
	this.eyes.fillcolor = strokeColor;
	this.eyes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupWebcam.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.head.setAttribute('d', this.createPath(arg, 'head'));
	this.head.setAttribute('fill', fillColor);
	this.head.setAttribute('stroke', strokeColor);
	this.head.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.eyes.setAttribute('d', this.createPath(arg, 'eyes'));
	this.eyes.setAttribute('fill', strokeColor);
	this.eyes.setAttribute('stroke', strokeColor);
	this.eyes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupWebcam.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + w, dy);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx, dy + h);
		path.close();
		path.moveTo(dx + w * 0.1, dy + h);
		path.arcTo(dx + w * 0.1, dy + h, w * 0.41, h * 0.55, 0, 0, 1, dx + w * 0.9, dy + h);
		path.end();
	}
	else if (shape === 'head')
	{
		path.ellipse(w * 0.22, h * 0.14, w * 0.56, h * 0.56);
		path.close();
		path.moveTo(dx + w * 0.4, dy + h * 0.55);
		path.arcTo(dx + w * 0.4, dy + h * 0.55, w * 0.25, h * 0.55, 0, 0, 0, dx + w * 0.6, dy + h * 0.55);
		path.end();
	}
	else if (shape === 'eyes')
	{
		path.ellipse(w * 0.38, h * 0.34, w * 0.02, h * 0.02);
		path.close();
		path.ellipse(w * 0.6, h * 0.34, w * 0.02, h * 0.02);
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Horizontal Tab Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorTabBar.prototype = new mxShapeMockup();
mxShapeMockupHorTabBar.prototype.constructor = mxShapeMockupHorTabBar;

mxShapeMockupHorTabBar.prototype.origWidth = 400;
mxShapeMockupHorTabBar.prototype.origHeight = 200;
mxShapeMockupHorTabBar.prototype.origAspect = mxShapeMockupHorTabBar.prototype.origWidth / mxShapeMockupHorTabBar.prototype.origHeight;

mxShapeMockupHorTabBar.prototype.cst = {
		BLOCK : 'block',
		CONE : 'cone',
		HALF_CONE : 'halfCone',
		ROUND : 'round'
};

function mxShapeMockupHorTabBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupHorTabBar.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var tab = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB, 'Tab').toString().split(',');
	this.tabNum = tab.length;
	this.tab = new Array();
	this.tabText = new Array();
	this.tabTextRect = new Array();
	this.currentPath = new Array();
	this.fillElem = new Array();
	this.strokeElem = new Array();
	this.pathElem = new Array();
	this.tpElem = new Array();
	this.oldTabNames = new Array();
	this.tabWidths = new Array();

	for (var i = 0; i < tab.length; i++)
	{
		this.tab.push(document.createElement('v:shape'));
		this.configureVmlShape(this.tab[i]);
		node.appendChild(this.tab[i]);

		this.currentPath.push(document.createElement('v:line'));
		this.currentPath[i].style.position = 'absolute';
		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';
		this.currentPath[i].to = '1 0';
		this.currentPath[i].from = '0 0';

		this.fillElem.push(document.createElement('v:fill'));
		this.fillElem[i].on = 'true';
		this.currentPath[i].appendChild(this.fillElem[i]);

		this.strokeElem.push(document.createElement('v:stroke'));
		this.strokeElem[i].on = 'false';
		this.currentPath[i].appendChild(this.strokeElem[i]);

		this.pathElem.push(document.createElement('v:path'));
		this.pathElem[i].textpathok = 'true';
		this.currentPath[i].appendChild(this.pathElem[i]);

		this.tpElem.push(document.createElement('v:textpath'));
		this.tpElem[i].style.cssText = 'v-text-align: left';
		this.tpElem[i].on = 'true';
		this.currentPath[i].appendChild(this.tpElem[i]);

		node.appendChild(this.currentPath[i]);
	}

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupHorTabBar.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	var tab = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB, 'Tab').toString().split(',');
	this.tabNum = tab.length;
	this.tab = new Array();
	this.tabText = new Array();
	this.tabTextRect = new Array();
	this.currentPath = new Array();
	this.fillElem = new Array();
	this.strokeElem = new Array();
	this.pathElem = new Array();
	this.tpElem = new Array();
	this.oldTabNames = new Array();
	this.tabWidths = new Array();
	this.tabTextNode = new Array();

	for (var i = 0; i < tab.length; i++)
	{
		this.tab.push(document.createElementNS(mxConstants.NS_SVG, 'path'));
		this.g.appendChild(this.tab[i]);

		this.tabText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.tabText[i]);
	}

	return this.g;
};

mxShapeMockupHorTabBar.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
//	this.updateVmlShape(this.background);

	var tab = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB, 'Tab').toString().split(',');
	var newTabNum = tab.length;

	if ((this.tab === null || typeof this.tab === 'undefined') && newTabNum > 0)
	{
		this.tab = new Array();
	}

	if (newTabNum > this.tabNum)
	{ // we have to add some elements
		for (var i = this.tabNum; i < newTabNum; i++)
		{
			this.tab.push(document.createElement('v:shape'));
			this.configureVmlShape(this.tab[i]);
			this.node.appendChild(this.tab[i]);

			this.currentPath.push(document.createElement('v:line'));
			this.currentPath[i].style.position = 'absolute';
			this.currentPath[i].style.width = '1px';
			this.currentPath[i].style.height = '1px';
			this.currentPath[i].to = '1 0';
			this.currentPath[i].from = '0 0';

			this.fillElem.push(document.createElement('v:fill'));
			this.fillElem[i].on = 'true';
			this.currentPath[i].appendChild(this.fillElem[i]);

			this.strokeElem.push(document.createElement('v:stroke'));
			this.strokeElem[i].on = 'false';
			this.currentPath[i].appendChild(this.strokeElem[i]);

			this.pathElem.push(document.createElement('v:path'));
			this.pathElem[i].textpathok = 'true';
			this.currentPath[i].appendChild(this.pathElem[i]);

			this.tpElem.push(document.createElement('v:textpath'));
			this.tpElem[i].style.cssText = 'v-text-align: left';
			this.tpElem[i].on = 'true';
			this.currentPath[i].appendChild(this.tpElem[i]);

			node.appendChild(this.currentPath[i]);
		}
	}
	else if (newTabNum < this.tabNum)
	{ // we have to remove some elements
		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.g.removeChild(this.tab[i]);
			this.g.removeChild(this.currentPath[i]);
		}

		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.tab.pop();
			this.currentPath.pop();
			this.fillElem.pop();
			this.strokeElem.pop();
			this.pathElem.pop();
			this.tpElem.pop();
		}
	}

	this.shadowNode = null;
//	this.background.path = this.createPath(arg, 'background');

	this.tabNum = newTabNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var tabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_COLOR, 'none');
	var selTabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_TAB_COLOR, 'none');
	var tabStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_STYLE, mxShapeMockupHorTabBar.prototype.cst.ROUND);
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');

	var selectedTab = -1;
	var tabTotalWidth = 0;

	for (var i = 0; i < this.tabNum; i++)
	{
		if (this.oldTabNames[i] !== tab[i] || this.oldScale !== this.scale)
		{
			var tabText = tab[i];

			if(tabText.charAt(0) === '+')
			{
				tabText = tabText.substring(1);
			}
			this.tabWidths[i] = Math.round(this.getSizeForString(tabText, Math.round(this.fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale);
		}

		tabTotalWidth += this.tabWidths[i];

		if(tab[i].charAt(0) === '+')
		{
			selectedTab = i;
		}
	}

	var startingOffset = 10 * this.scale;
	var labelOffset = 15 * this.scale;
	var midOffset = 5 * this.scale;
	var currOffset = startingOffset;
	var tabHeight = 30 * this.scale;
	var selStart = -1;
	arg.tabHeight = tabHeight;
	arg.labelOffset = labelOffset;
	arg.midOffset = midOffset;
	arg.tabStyle = tabStyle;

	for (var i = 0; i < this.tabNum; i++)
	{
		arg.tabWidth = this.tabWidths[i];

		if (i !== selectedTab)
		{
			// we draw the selected tab last
			arg.startingOffset = currOffset;
			this.updateVmlShape(this.tab[i]);
			this.tab[i].path = this.createPath(arg, 'tab');

			if (tabColor !== 'none')
			{
				this.tab[i].filled = 'true';
			}

			this.tab[i].fillcolor = tabColor;
		}
		else
		{
			// mark the beginning location of the selected tab
			selStart = currOffset;
			this.updateVmlShape(this.tab[i]);
			this.tab[i].fillcolor = selTabColor;
		}

		this.tab[i].strokecolor = strokeColor;
		this.tab[i].strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

		currOffset += this.tabWidths[i] + midOffset + 2 * labelOffset;
	}
	this.minWidth = startingOffset + (midOffset + 2 * arg.labelOffset) * this.tabNum + tabTotalWidth;

	if (selectedTab !== -1)
	{
		arg.tabWidth = this.tabWidths[selectedTab];
		arg.startingOffset = selStart;
		this.updateVmlShape(this.tab[selectedTab]);
		this.tab[selectedTab].path = this.createPath(arg, 'selTab');
		this.tab[selectedTab].fillcolor = selTabColor;

		if(this.noTabWindow !== null && typeof this.noTabWindow !== 'undefined')
		{
			this.g.removeChild(this.noTabWindow);
			this.noTabWindow = null;
		}
	}
	else
	{ 
		if(this.noTabWindow === null || typeof this.noTabWindow === 'undefined')
		{
			//no tab is selected so we create a new shape if needed
			this.noTabWindow = document.createElement('v:shape');
			this.configureVmlShape(this.noTabWindow);
			this.node.appendChild(this.noTabWindow);
		}

		this.updateVmlShape(this.noTabWindow);
		this.noTabWindow.path = this.createPath(arg, 'noTabWindow');
		this.noTabWindow.strokecolor = strokeColor;
		this.noTabWindow.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

		if (tabColor !== 'none')
		{
			this.noTabWindow.filled = 'true';
		}

		this.noTabWindow.fillcolor = tabColor;

		if (strokeColor !== 'none')
		{
			this.noTabWindow.stroked = 'true';
		}
	}

	currOffset = startingOffset;

	for (var i = 0; i < this.tabNum; i++)
	{
		currOffset += labelOffset;
		this.fillElem[i].color = textColor;
		this.tpElem[i].style.fontSize = Math.round(20 * this.scale) + 'px';

		this.currentPath[i].to = (currOffset + 1) + ' ' + Math.round(15 * this.scale);
		this.currentPath[i].from = currOffset + ' ' + Math.round(15 * this.scale);

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';
		this.updateVmlShape(this.currentPath[i]);
		var tabText = tab[i];

		if(tabText.charAt(0) === '+')
		{
			tabText = tabText.substring(1);
		}

		this.tpElem[i].string = tabText;
		currOffset += this.tabWidths[i] + midOffset + labelOffset;
	}

	this.updateRotation();

	this.oldTabNames = tab;
	this.oldScale = this.scale;
};

mxShapeMockupHorTabBar.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

//	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
//	this.innerNode.setAttribute('stroke', 'none');

	var tab = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB, 'Tab').toString().split(',');
	var newTabNum = tab.length;

	if ((this.part === null || typeof this.part === 'undefined') && newTabNum > 0)
	{
		this.part = new Array();
	}

	if (newTabNum > this.tabNum)
	{
		// we have to add some elements
		for (var i = this.tabNum; i < newTabNum; i++)
		{
			this.tab.push(document.createElementNS(mxConstants.NS_SVG, 'path'));
			this.g.appendChild(this.tab[i]);

			this.tabText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
			this.g.appendChild(this.tabText[i]);
		}
	}
	else if (newTabNum < this.tabNum)
	{ 
		// we have to remove some elements
		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.g.removeChild(this.tab[i]);
			this.g.removeChild(this.tabText[i]);
		}

		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.tab.pop();
			this.tabText.pop();
		}
	}

	this.shadowNode = null;
	this.tabNum = newTabNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var tabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_COLOR, 'none');
	var selTabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_TAB_COLOR, 'none');
	var tabStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_STYLE, mxShapeMockupHorTabBar.prototype.cst.ROUND);
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');

	var selectedTab = -1;
	var tabTotalWidth = 0;

	for (var i = 0; i < this.tabNum; i++)
	{
		if(tab[i].charAt(0) === '+')
		{
			selectedTab = i;
		}

		var tabString = tab[i];

		if(tabString.charAt(0) === '+')
		{
			tabString = tabString.substring(1);
		}

		if (this.oldTabNames[i] !== tab[i] || this.scale !== this.oldScale)
		{

			this.tabWidths[i] = this.getSizeForString(tabString, this.fontSize * this.scale, mxConstants.DEFAULT_FONTFAMILY).width  * this.scale * 1.5;
		}

		tabTotalWidth += this.tabWidths[i];
	}

	var startingOffset = 10 * this.scale;
	var labelOffset = 15 * this.scale;
	var midOffset = 5 * this.scale;
	var currOffset = startingOffset;
	var tabHeight = 30 * this.scale;
	var selStart = -1;
	arg.tabHeight = tabHeight;
	arg.labelOffset = labelOffset;
	arg.midOffset = midOffset;
	arg.tabStyle = tabStyle;

	for (var i = 0; i < this.tabNum; i++)
	{
		arg.tabWidth = this.tabWidths[i];

		if (i !== selectedTab)
		{ 
			// we draw the selected tab last
			arg.startingOffset = currOffset;
			this.tab[i].setAttribute('d', this.createPath(arg, 'tab'));
			this.tab[i].setAttribute('fill', tabColor);
		}
		else
		{
			// mark the beginning location of the selected tab
			selStart = currOffset;
		}

		this.tab[i].setAttribute('stroke', strokeColor);
		this.tab[i].setAttribute('stroke-width', this.strokewidth * this.scale);

		currOffset += this.tabWidths[i] + midOffset + 2 * labelOffset;
	}

	this.minWidth = startingOffset + (midOffset + 2 * arg.labelOffset) * this.tabNum + tabTotalWidth;

	if (selectedTab !== -1)
	{
		arg.tabWidth = this.tabWidths[selectedTab];
		arg.startingOffset = selStart;
		this.tab[selectedTab].setAttribute('d', this.createPath(arg, 'selTab'));
		this.tab[selectedTab].setAttribute('fill', selTabColor);

		if(this.noTabWindow !== null && typeof this.noTabWindow !== 'undefined')
		{
			this.g.removeChild(this.noTabWindow);
			this.noTabWindow = null;
		}
	}
	else
	{
		//no tab is selected so we create a new shape if needed
		if(this.noTabWindow === null || typeof this.noTabWindow === 'undefined')
		{
			this.noTabWindow = document.createElementNS(mxConstants.NS_SVG, 'path');
			this.g.appendChild(this.noTabWindow);
		}
		this.noTabWindow.setAttribute('d', this.createPath(arg, 'noTabWindow'));
		this.noTabWindow.setAttribute('stroke', strokeColor);
		this.noTabWindow.setAttribute('stroke-weight', this.strokewidth * this.scale);
		this.noTabWindow.setAttribute('fill', tabColor);
	}

	currOffset = startingOffset;

	for (var i = 0; i < this.tabNum; i++)
	{
		currOffset += labelOffset;
		this.tabText[i].setAttribute('fill', textColor);
		this.tabText[i].setAttribute('font-size', 20 * this.scale);
		this.tabText[i].setAttribute('x', this.bounds.x + currOffset);
		this.tabText[i].setAttribute('y', this.bounds.y + 20 * this.scale);

		var tabString = tab[i];

		if(tabString.charAt(0) === '+')
		{
			tabString = tabString.substring(1);
		}

		if (this.tabTextNode.length > i)
		{
			this.tabText[i].removeChild(this.tabTextNode[i]);
		}

		this.tabTextNode[i] = document.createTextNode(tabString);
		this.tabText[i].appendChild(this.tabTextNode[i]);

		currOffset += this.tabWidths[i] + midOffset + labelOffset;
	}
	this.updateRotation();

	this.oldTabNames = tab;
	this.oldScale = this.scale;
};

mxShapeMockupHorTabBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'tab')
	{
		if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.BLOCK)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
		}
		else if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.ROUND)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset, dy + 5 * this.scale);
			path.arcTo(dx + arg.startingOffset, dy + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + arg.startingOffset + 5 * this.scale, dy  );
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 3 * this.scale, dy);
			path.arcTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 3 * this.scale, dy, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + 5 * this.scale);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
		}
		else if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.CONE)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset+10 * this.scale, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 10 * this.scale, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
		}
		else if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.HALF_CONE)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 10 * this.scale, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
		}
	}
	else if (shape === 'selTab')
	{
		if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.BLOCK)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + arg.tabHeight);
			path.close();
		}
		else if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.ROUND)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset, dy + 5 * this.scale);
			path.arcTo(dx + arg.startingOffset, dy + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + arg.startingOffset + 5 * this.scale, dy  );
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 3 * this.scale, dy);
			path.arcTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 3 * this.scale, dy, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + 5 * this.scale);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + arg.tabHeight);
			path.close();
		}
		else if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.CONE)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset+10 * this.scale, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 10 * this.scale, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + arg.tabHeight);
			path.close();
		}
		else if (arg.tabStyle === mxShapeMockupHorTabBar.prototype.cst.HALF_CONE)
		{
			path.moveTo(dx + arg.startingOffset, dy + arg.tabHeight);
			path.lineTo(dx + arg.startingOffset, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset - 10 * this.scale, dy);
			path.lineTo(dx + arg.startingOffset + arg.tabWidth + 2 * arg.labelOffset, dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + Math.max(h, arg.tabHeight));
			path.lineTo(dx, dy + arg.tabHeight);
			path.close();
		}
	}
	else if (shape === 'noTabWindow')
	{
		path.moveTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
		path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, arg.tabHeight));
		path.lineTo(dx, dy + Math.max(h, arg.tabHeight));
		path.lineTo(dx, dy + arg.tabHeight);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Vertical Tab Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupVerTabBar.prototype = new mxShapeMockupHorTabBar();
mxShapeMockupVerTabBar.prototype.constructor = mxShapeMockupVerTabBar;

mxShapeMockupVerTabBar.prototype.origWidth = 300;
mxShapeMockupVerTabBar.prototype.origHeight = 300;
mxShapeMockupVerTabBar.prototype.origAspect = mxShapeMockupVerTabBar.prototype.origWidth / mxShapeMockupVerTabBar.prototype.origHeight;

mxShapeMockupVerTabBar.prototype.cst = {
		BLOCK : 'block',
		ROUND : 'round'
};

function mxShapeMockupVerTabBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerTabBar.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);

	var tab = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB, 'Tab').toString().split(',');
	var newTabNum = tab.length;

	if ((this.tab === null || typeof this.tab === 'undefined') && newTabNum > 0)
	{
		this.tab = new Array();
	}

	if (newTabNum > this.tabNum)
	{ // we have to add some elements
		for (var i = this.tabNum; i < newTabNum; i++)
		{
			this.tab.push(document.createElement('v:shape'));
			this.configureVmlShape(this.tab[i]);
			this.node.appendChild(this.tab[i]);

			this.currentPath.push(document.createElement('v:line'));
			this.currentPath[i].style.position = 'absolute';
			this.currentPath[i].style.width = '1px';
			this.currentPath[i].style.height = '1px';
			this.currentPath[i].to = '1 0';
			this.currentPath[i].from = '0 0';

			this.fillElem.push(document.createElement('v:fill'));
			this.fillElem[i].on = 'true';
			this.currentPath[i].appendChild(this.fillElem[i]);

			this.strokeElem.push(document.createElement('v:stroke'));
			this.strokeElem[i].on = 'false';
			this.currentPath[i].appendChild(this.strokeElem[i]);

			this.pathElem.push(document.createElement('v:path'));
			this.pathElem[i].textpathok = 'true';
			this.currentPath[i].appendChild(this.pathElem[i]);

			this.tpElem.push(document.createElement('v:textpath'));
			this.tpElem[i].style.cssText = 'v-text-align: left';
			this.tpElem[i].on = 'true';
			this.currentPath[i].appendChild(this.tpElem[i]);

			node.appendChild(this.currentPath[i]);
		}
	}
	else if (newTabNum < this.tabNum)
	{ // we have to remove some elements
		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.g.removeChild(this.tab[i]);
			this.g.removeChild(this.currentPath[i]);
		}

		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.tab.pop();
			this.currentPath.pop();
			this.fillElem.pop();
			this.strokeElem.pop();
			this.pathElem.pop();
			this.tpElem.pop();
		}
	}

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');

	this.tabNum = newTabNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var tabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_COLOR, 'none');
	var selTabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_TAB_COLOR, 'none');
	var tabStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_STYLE, mxShapeMockupVerTabBar.prototype.cst.ROUND);
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');

	var selectedTab = -1;
	var tabTotalWidth = 0;
	var tabGreatestWidth = 0;

	for (var i = 0; i < this.tabNum; i++)
	{
		var tabText = tab[i];

		if (this.oldTabNames[i] !== tab[i] || this.oldScale !== this.scale)
		{
			this.tabWidths[i] = Math.round(this.getSizeForString(tabText, Math.round(this.fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale);
		}

		tabTotalWidth += this.tabWidths[i];

		if(tab[i].charAt(0) === '+')
		{
			selectedTab = i;
		}

		if(tabText.charAt(0) === '+')
		{
			tabText = tabText.substring(1);
		}

		if (this.tabWidths[i] > tabGreatestWidth)
		{
			tabGreatestWidth = this.tabWidths[i];
		}
	}

	var startingOffset = 10 * this.scale;
	var labelOffset = 15 * this.scale;
	var midOffset = 5 * this.scale;
	var currOffset = startingOffset;
	var tabHeight = 30 * this.scale;
	var selStart = -1;
	arg.tabHeight = tabHeight;
	arg.labelOffset = labelOffset;
	arg.midOffset = midOffset;
	arg.tabStyle = tabStyle;
	arg.tabGreatestWidth = tabGreatestWidth;

	for (var i = 0; i < this.tabNum; i++)
	{
		arg.tabWidth = this.tabWidths[i];

		if (i !== selectedTab)
		{
			// we draw the selected tab last
			arg.startingOffset = currOffset;
			this.updateVmlShape(this.tab[i]);
			this.tab[i].path = this.createPath(arg, 'tab');

			if (tabColor !== 'none')
			{
				this.tab[i].filled = 'true';
			}

			this.tab[i].fillcolor = tabColor;
		}
		else
		{
			// mark the beginning location of the selected tab
			selStart = currOffset;
			this.updateVmlShape(this.tab[i]);
			this.tab[i].fillcolor = selTabColor;
		}

		this.tab[i].strokecolor = strokeColor;
		this.tab[i].strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

		currOffset += tabHeight + midOffset;
	}
	this.minWidth = startingOffset + (midOffset + 2 * arg.labelOffset) * this.tabNum + tabTotalWidth;

	if (selectedTab !== -1)
	{
		arg.tabWidth = this.tabWidths[selectedTab];
		arg.startingOffset = selStart;
		this.updateVmlShape(this.tab[selectedTab]);
		this.tab[selectedTab].path = this.createPath(arg, 'selTab');
		this.tab[selectedTab].fillcolor = selTabColor;

		if(this.noTabWindow !== null && typeof this.noTabWindow !== 'undefined')
		{
			this.g.removeChild(this.noTabWindow);
			this.noTabWindow = null;
		}
	}
	else
	{ 
		if(this.noTabWindow === null || typeof this.noTabWindow === 'undefined')
		{
			//no tab is selected so we create a new shape if needed
			this.noTabWindow = document.createElement('v:shape');
			this.configureVmlShape(this.noTabWindow);
			this.node.appendChild(this.noTabWindow);
		}
		this.updateVmlShape(this.noTabWindow);
		this.noTabWindow.path = this.createPath(arg, 'noTabWindow');
		this.noTabWindow.strokecolor = strokeColor;
		this.noTabWindow.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

		if (tabColor !== 'none')
		{
			this.noTabWindow.filled = 'true';
		}

		this.noTabWindow.fillcolor = tabColor;

		if (strokeColor !== 'none')
		{
			this.noTabWindow.stroked = 'true';
		}
	}

	currOffset = startingOffset;

	for (var i = 0; i < this.tabNum; i++)
	{
		this.fillElem[i].color = textColor;
		this.tpElem[i].style.fontSize = Math.round(20 * this.scale) + 'px';

		this.currentPath[i].to = (labelOffset + 1) + ' ' + Math.round(currOffset + 15 * this.scale);
		this.currentPath[i].from = labelOffset + ' ' + Math.round(currOffset + 15 * this.scale);

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';
		this.updateVmlShape(this.currentPath[i]);
		var tabText = tab[i];

		if(tabText.charAt(0) === '+')
		{
			tabText = tabText.substring(1);
		}

		this.tpElem[i].string = tabText;
		currOffset += tabHeight + midOffset;
	}

	this.updateRotation();

	this.oldTabNames = tab;
	this.oldScale = this.scale;
};

mxShapeMockupVerTabBar.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

//	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
//	this.innerNode.setAttribute('stroke', 'none');

	var tab = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB, 'Tab').toString().split(',');
	var newTabNum = tab.length;

	if ((this.part === null || typeof this.part === 'undefined') && newTabNum > 0)
	{
		this.part = new Array();
	}

	if (newTabNum > this.tabNum)
	{
		// we have to add some elements
		for (var i = this.tabNum; i < newTabNum; i++)
		{
			this.tab.push(document.createElementNS(mxConstants.NS_SVG, 'path'));
			this.g.appendChild(this.tab[i]);

			this.tabText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
			this.g.appendChild(this.tabText[i]);
		}
	}
	else if (newTabNum < this.tabNum)
	{ 
		// we have to remove some elements
		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.g.removeChild(this.tab[i]);
			this.g.removeChild(this.tabText[i]);
		}
		for (var i = newTabNum; i < this.tabNum; i++)
		{
			this.tab.pop();
			this.tabText.pop();
		}
	}

	this.shadowNode = null;
	this.tabNum = newTabNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var tabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_COLOR, 'none');
	var selTabColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_TAB_COLOR, 'none');
	var tabStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAB_STYLE, mxShapeMockupVerTabBar.prototype.cst.ROUND);
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');

	var selectedTab = -1;
	var tabTotalWidth = 0;
	var tabGreatestWidth = 0;

	for (var i = 0; i < this.tabNum; i++)
	{
		if(tab[i].charAt(0) === '+')
		{
			selectedTab = i;
		}
		var tabString = tab[i];
		if(tabString.charAt(0) === '+')
		{
			tabString = tabString.substring(1);
		}
		if (this.oldTabNames[i] !== tab[i] || this.scale !== this.oldScale)
		{

			this.tabWidths[i] = this.getSizeForString(tabString, this.fontSize * this.scale, mxConstants.DEFAULT_FONTFAMILY).width  * this.scale * 1.5;
		}

		tabTotalWidth += this.tabWidths[i];

		if (this.tabWidths[i] > tabGreatestWidth)
		{
			tabGreatestWidth = this.tabWidths[i];
		}
	}

	var startingOffset = 10 * this.scale;
	var labelOffset = 15 * this.scale;
	var midOffset = 5 * this.scale;
	var currOffset = startingOffset;
	var tabHeight = 30 * this.scale;
	var selStart = -1;
	arg.tabHeight = tabHeight;
	arg.labelOffset = labelOffset;
	arg.midOffset = midOffset;
	arg.tabStyle = tabStyle;
	arg.tabGreatestWidth = tabGreatestWidth;

	for (var i = 0; i < this.tabNum; i++)
	{
		arg.tabWidth = this.tabWidths[i];

		if (i !== selectedTab)
		{ 
			// we draw the selected tab last
			arg.startingOffset = currOffset;
			this.tab[i].setAttribute('d', this.createPath(arg, 'tab'));
			this.tab[i].setAttribute('fill', tabColor);
		}
		else
		{
			// mark the beginning location of the selected tab
			selStart = currOffset;
		}

		this.tab[i].setAttribute('stroke', strokeColor);
		this.tab[i].setAttribute('stroke-width', this.strokewidth * this.scale);

		currOffset += tabHeight + midOffset;
	}

	this.minWidth = startingOffset + (midOffset + 2 * arg.labelOffset) * this.tabNum + tabTotalWidth;

	if (selectedTab !== -1)
	{
		arg.tabWidth = this.tabWidths[selectedTab];
		arg.startingOffset = selStart;
		this.tab[selectedTab].setAttribute('d', this.createPath(arg, 'selTab'));
		this.tab[selectedTab].setAttribute('fill', selTabColor);

		if(this.noTabWindow !== null && typeof this.noTabWindow !== 'undefined')
		{
			this.g.removeChild(this.noTabWindow);
			this.noTabWindow = null;
		}
	}
	else
	{
		//no tab is selected so we create a new shape if needed
		if(this.noTabWindow === null || typeof this.noTabWindow === 'undefined')
		{
			this.noTabWindow = document.createElementNS(mxConstants.NS_SVG, 'path');
			this.g.appendChild(this.noTabWindow);
		}
		this.noTabWindow.setAttribute('d', this.createPath(arg, 'noTabWindow'));
		this.noTabWindow.setAttribute('stroke', strokeColor);
		this.noTabWindow.setAttribute('stroke-weight', this.strokewidth * this.scale);
		this.noTabWindow.setAttribute('fill', tabColor);
	}

	currOffset = startingOffset;

	for (var i = 0; i < this.tabNum; i++)
	{
		this.tabText[i].setAttribute('fill', textColor);
		this.tabText[i].setAttribute('font-size', 20 * this.scale);
		this.tabText[i].setAttribute('x', this.bounds.x + labelOffset);
		this.tabText[i].setAttribute('y', this.bounds.y + currOffset + 20 * this.scale);

		var tabString = tab[i];

		if(tabString.charAt(0) === '+')
		{
			tabString = tabString.substring(1);
		}

		if (this.tabTextNode.length > i)
		{
			this.tabText[i].removeChild(this.tabTextNode[i]);
		}

		this.tabTextNode[i] = document.createTextNode(tabString);
		this.tabText[i].appendChild(this.tabTextNode[i]);

		currOffset += tabHeight + midOffset;
	}
	this.updateRotation();

	this.oldTabNames = tab;
	this.oldScale = this.scale;
};

mxShapeMockupVerTabBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'tab')
	{
		if (arg.tabStyle === mxShapeMockupVerTabBar.prototype.cst.BLOCK)
		{
			path.moveTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset + arg.tabHeight);
			path.lineTo(dx, dy + arg.startingOffset + arg.tabHeight);
			path.lineTo(dx , dy + arg.startingOffset);
			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset);
		}
		else if (arg.tabStyle === mxShapeMockupVerTabBar.prototype.cst.ROUND)
		{
			path.moveTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset + arg.tabHeight);
			path.lineTo(dx + 5 * this.scale, dy + arg.startingOffset + arg.tabHeight);
			path.arcTo(dx + 5 * this.scale, dy + arg.startingOffset + arg.tabHeight, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx, dy + arg.startingOffset + arg.tabHeight - 5 * this.scale);
			path.lineTo(dx , dy + arg.startingOffset + 5 * this.scale);
			path.arcTo(dx, dy + arg.startingOffset + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + 5 * this.scale, dy + arg.startingOffset);
			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset);
		}
	}
	else if (shape === 'selTab')
	{
		if (arg.tabStyle === mxShapeMockupVerTabBar.prototype.cst.BLOCK)
		{
			this.minWidth = arg.tabGreatestWidth + 2 * arg.labelOffset;
			var minHeight = this.tabNum * arg.tabHeight + (this.tabNum + 1) * arg.midOffset;
			path.moveTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset + arg.tabHeight);
			path.lineTo(dx, dy + arg.startingOffset + arg.tabHeight);
			path.lineTo(dx , dy + arg.startingOffset);
			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset);

			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy);
			path.lineTo(dx + Math.max(w, this.minWidth), dy);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, minHeight));
			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + Math.max(h, minHeight));
			path.close();
		}
		else if (arg.tabStyle === mxShapeMockupVerTabBar.prototype.cst.ROUND)
		{
			this.minWidth = arg.tabGreatestWidth + 2 * arg.labelOffset;
			var minHeight = this.tabNum * arg.tabHeight + (this.tabNum + 1) * arg.midOffset;
			path.moveTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset + arg.tabHeight);
			path.lineTo(dx + 5 * this.scale, dy + arg.startingOffset + arg.tabHeight);
			path.arcTo(dx + 5 * this.scale, dy + arg.startingOffset + arg.tabHeight, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx, dy + arg.startingOffset + arg.tabHeight - 5 * this.scale);
			path.lineTo(dx , dy + arg.startingOffset + 5 * this.scale);
			path.arcTo(dx, dy + arg.startingOffset + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + 5 * this.scale, dy + arg.startingOffset);
			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + arg.startingOffset);

			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy);
			path.lineTo(dx + Math.max(w, this.minWidth), dy);
			path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, minHeight));
			path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + Math.max(h, minHeight));
			path.close();
		}
	}
	else if (shape === 'noTabWindow')
	{
		this.minWidth = arg.tabGreatestWidth + 2 * arg.labelOffset;
		var minHeight = this.tabNum * arg.tabHeight + (this.tabNum + 1) * arg.midOffset;

		path.moveTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy);
		path.lineTo(dx + Math.max(w, this.minWidth), dy);
		path.lineTo(dx + Math.max(w, this.minWidth), dy + Math.max(h, minHeight));
		path.lineTo(dx + arg.tabGreatestWidth + 2 * arg.labelOffset, dy + Math.max(h, minHeight));
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Video player
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupVideoPlayer.prototype = new mxShapeMockup();
mxShapeMockupVideoPlayer.prototype.constructor = mxShapeMockupVideoPlayer;

mxShapeMockupVideoPlayer.prototype.origWidth = 200;
mxShapeMockupVideoPlayer.prototype.origHeight = 200;
mxShapeMockupVideoPlayer.prototype.origAspect = mxShapeMockupVideoPlayer.prototype.origWidth / mxShapeMockupVideoPlayer.prototype.origHeight;

function mxShapeMockupVideoPlayer(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupVideoPlayer.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.playAndSpeaker = document.createElement('v:shape');
	this.configureVmlShape(this.playAndSpeaker);
	node.appendChild(this.playAndSpeaker);

	this.progressBar = document.createElement('v:shape');
	this.configureVmlShape(this.progressBar);
	node.appendChild(this.progressBar);

	this.controlBarPlay = document.createElement('v:shape');
	this.configureVmlShape(this.controlBarPlay);
	node.appendChild(this.controlBarPlay);

	this.controlBarLines = document.createElement('v:shape');
	this.configureVmlShape(this.controlBarLines);
	node.appendChild(this.controlBarLines);

	this.videoButton = document.createElement('v:shape');
	this.configureVmlShape(this.videoButton);
	node.appendChild(this.videoButton);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;

	return node;
};

mxShapeMockupVideoPlayer.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.playAndSpeaker = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.playAndSpeaker);
	this.progressBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.progressBar);
	this.controlBarPlay = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.controlBarPlay);
	this.controlBarLines = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.controlBarLines);
	this.videoButton = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.videoButton);
	return this.g;
};

mxShapeMockupVideoPlayer.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.playAndSpeaker);
	this.updateVmlShape(this.progressBar);
	this.updateVmlShape(this.controlBarPlay);
	this.updateVmlShape(this.controlBarLines);
	this.updateVmlShape(this.videoButton);
	var barPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_POS, '20');
	barPos = Math.max(0, barPos);
	barPos = Math.min(100, barPos);
	arg.barPos = barPos;

	this.background.path = this.createPath(arg, 'background');
	this.background.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.playAndSpeaker.path = this.createPath(arg, 'playAndSpeaker');
	this.playAndSpeaker.fillcolor = strokeColor;
	this.playAndSpeaker.strokecolor = 'none';

	this.progressBar.path = this.createPath(arg, 'progressBar');
	this.progressBar.fillcolor = strokeColor;
	this.progressBar.strokecolor = 'none';

	this.controlBarPlay.path = this.createPath(arg, 'controlBarPlay');
	this.controlBarPlay.filled = 'true';
	this.controlBarPlay.fillcolor = fillColor;
	this.controlBarPlay.strokecolor = 'none';

	this.controlBarLines.path = this.createPath(arg, 'controlBarLines');
	this.controlBarLines.filled = 'false';
	this.controlBarLines.fillcolor = 'none';
	this.controlBarLines.strokecolor = strokeColor;

	this.videoButton.path = this.createPath(arg, 'videoButton');
	this.videoButton.filled = 'true';
	this.videoButton.fillcolor = fillColor;
	this.videoButton.strokecolor = strokeColor;

	this.updateRotation();
};

mxShapeMockupVideoPlayer.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var barPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_POS, '20');
	barPos = Math.max(0, barPos);
	barPos = Math.min(100, barPos);
	arg.barPos = barPos;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.playAndSpeaker.setAttribute('d', this.createPath(arg, 'playAndSpeaker'));
	this.playAndSpeaker.setAttribute('fill', strokeColor);
	this.playAndSpeaker.setAttribute('stroke', 'none');

	this.progressBar.setAttribute('d', this.createPath(arg, 'progressBar'));
	this.progressBar.setAttribute('fill', strokeColor);
	this.progressBar.setAttribute('stroke', 'none');

	this.controlBarPlay.setAttribute('d', this.createPath(arg, 'controlBarPlay'));
	this.controlBarPlay.setAttribute('fill', fillColor);
	this.controlBarPlay.setAttribute('stroke', 'none');

	this.controlBarLines.setAttribute('d', this.createPath(arg, 'controlBarLines'));
	this.controlBarLines.setAttribute('fill', 'none');
	this.controlBarLines.setAttribute('stroke', strokeColor);

	this.videoButton.setAttribute('d', this.createPath(arg, 'videoButton'));
	this.videoButton.setAttribute('fill', fillColor);
	this.videoButton.setAttribute('stroke', strokeColor);

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', fillColor);

	this.updateRotation();
};

mxShapeMockupVideoPlayer.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	//only the progress bar handle needs to be drawn
	var controlBarHeight = 25 * this.scale;
	var h = Math.max(arg.h, controlBarHeight);
	var w = Math.max(arg.w, 3.5 * controlBarHeight);
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w, dy);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx, dy + h);
		path.lineTo(dx, dy);
		path.close();
		path.moveTo(dx, dy + h - controlBarHeight);
		path.lineTo(dx + w, dy + h - controlBarHeight);
	}
	else if (shape === 'playAndSpeaker')
	{
		path.ellipse(dx + controlBarHeight * 0.1, dy + h - controlBarHeight * 0.9, controlBarHeight * 0.8, controlBarHeight * 0.8);
		path.close();
		var speakerStartX = dx + w - controlBarHeight * 2;
		var speakerStartY = dy + h - controlBarHeight;
		path.moveTo(speakerStartX + controlBarHeight * 0.05, speakerStartY + controlBarHeight * 0.35);
		path.lineTo(speakerStartX + controlBarHeight * 0.15, speakerStartY + controlBarHeight * 0.35);
		path.lineTo(speakerStartX + controlBarHeight * 0.3, speakerStartY + controlBarHeight * 0.2);
		path.lineTo(speakerStartX + controlBarHeight * 0.3, speakerStartY + controlBarHeight * 0.8);
		path.lineTo(speakerStartX + controlBarHeight * 0.15, speakerStartY + controlBarHeight * 0.65);
		path.lineTo(speakerStartX + controlBarHeight * 0.05, speakerStartY + controlBarHeight * 0.65);
		path.close();
	}
	else if (shape === 'progressBar')
	{
		//draw the handle based on arg.barPos
		var barMin = dx + controlBarHeight * 1.3;
		var barMax = dx + w - controlBarHeight * 2.3;
		var videoBarStartY = dy + h - controlBarHeight;
		var barRange = barMax - barMin;
		var barPos = barRange * arg.barPos / 100;
		var barEnd = barMin + barPos;

		path.moveTo(barMin, videoBarStartY + controlBarHeight * 0.35);
		path.lineTo(barEnd, videoBarStartY + controlBarHeight * 0.35);
		path.lineTo(barEnd, videoBarStartY + controlBarHeight * 0.65);
		path.lineTo(barMin, videoBarStartY + controlBarHeight * 0.65);
		path.close();
	}
	else if (shape === 'controlBarPlay')
	{
		var playStartX = dx;
		var playStartY = dy + h - controlBarHeight;
		path.moveTo(playStartX + controlBarHeight * 0.4, playStartY + controlBarHeight * 0.3);
		path.lineTo(playStartX + controlBarHeight * 0.7, playStartY + controlBarHeight * 0.5);
		path.lineTo(playStartX + controlBarHeight * 0.4, playStartY + controlBarHeight * 0.7);
		path.close();
	}
	else if (shape === 'controlBarLines')
	{
		var soundStartX = dx + w - 2 * controlBarHeight;
		var soundStartY = dy + h - controlBarHeight;
		path.moveTo(soundStartX + controlBarHeight * 0.4, soundStartY + controlBarHeight * 0.35);
		path.arcTo(soundStartX + controlBarHeight * 0.4, soundStartY + controlBarHeight * 0.35, controlBarHeight * 0.2, controlBarHeight * 0.3, 0, 0, 1, soundStartX + controlBarHeight * 0.4, soundStartY + controlBarHeight * 0.65);
		path.moveTo(soundStartX + controlBarHeight * 0.425, soundStartY + controlBarHeight * 0.25);
		path.arcTo(soundStartX + controlBarHeight * 0.425, soundStartY + controlBarHeight * 0.25, controlBarHeight * 0.225, controlBarHeight * 0.35, 0, 0, 1, soundStartX + controlBarHeight * 0.425, soundStartY + controlBarHeight * 0.75);
		path.moveTo(soundStartX + controlBarHeight * 0.5, soundStartY + controlBarHeight * 0.2);
		path.arcTo(soundStartX + controlBarHeight * 0.5, soundStartY + controlBarHeight * 0.2, controlBarHeight * 0.25, controlBarHeight * 0.4, 0, 0, 1, soundStartX + controlBarHeight * 0.5, soundStartY + controlBarHeight * 0.8);
		var screenStartX = dx + w - controlBarHeight;
		path.moveTo(screenStartX + controlBarHeight * 0.1, soundStartY + controlBarHeight * 0.4);
		path.lineTo(screenStartX + controlBarHeight * 0.1, soundStartY + controlBarHeight * 0.3);
		path.lineTo(screenStartX + controlBarHeight * 0.25, soundStartY + controlBarHeight * 0.3);

		path.moveTo(screenStartX + controlBarHeight * 0.1, soundStartY + controlBarHeight * 0.6);
		path.lineTo(screenStartX + controlBarHeight * 0.1, soundStartY + controlBarHeight * 0.7);
		path.lineTo(screenStartX + controlBarHeight * 0.25, soundStartY + controlBarHeight * 0.7);

		path.moveTo(screenStartX + controlBarHeight * 0.9, soundStartY + controlBarHeight * 0.4);
		path.lineTo(screenStartX + controlBarHeight * 0.9, soundStartY + controlBarHeight * 0.3);
		path.lineTo(screenStartX + controlBarHeight * 0.75, soundStartY + controlBarHeight * 0.3);

		path.moveTo(screenStartX + controlBarHeight * 0.9, soundStartY + controlBarHeight * 0.6);
		path.lineTo(screenStartX + controlBarHeight * 0.9, soundStartY + controlBarHeight * 0.7);
		path.lineTo(screenStartX + controlBarHeight * 0.75, soundStartY + controlBarHeight * 0.7);

		//now we draw the video progress bar
		var videoBarStartX = dx + controlBarHeight * 1.3;
		var videoBarStartY = dy + h - controlBarHeight;
		var videoBarEndX = dx + w - controlBarHeight * 2.3;
		path.moveTo(videoBarStartX, videoBarStartY + controlBarHeight * 0.35 );
		path.lineTo(videoBarEndX, videoBarStartY + controlBarHeight * 0.35 );
		path.lineTo(videoBarEndX, videoBarStartY + controlBarHeight * 0.65 );
		path.lineTo(videoBarStartX, videoBarStartY + controlBarHeight * 0.65 );
		path.close();
	}
	else if (shape === 'videoButton')
	{
		var barMin = dx + controlBarHeight * 1.3;
		var barMax = dx + w - controlBarHeight * 2.3;
		var barRange = barMax - barMin;
		var barPos = barRange * arg.barPos / 100;
		var barEnd = barMin + barPos;
		var videoBarStartY = dy + h - controlBarHeight;
		path.ellipse(barEnd - controlBarHeight * 0.25, videoBarStartY + controlBarHeight * 0.25, controlBarHeight * 0.5, controlBarHeight * 0.5);
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Accordion
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupAccordion.prototype = new mxShapeMockup();
mxShapeMockupAccordion.prototype.constructor = mxShapeMockupAccordion;

mxShapeMockupAccordion.prototype.origWidth = 250;
mxShapeMockupAccordion.prototype.origHeight = 50;
mxShapeMockupAccordion.prototype.origAspect = mxShapeMockupAccordion.prototype.origWidth / mxShapeMockupAccordion.prototype.origHeight;

function mxShapeMockupAccordion(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupAccordion.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON, 'Button').toString().split(',');
	this.buttonNum = button.length;
	this.currentPath = new Array();
	this.fillElem = new Array();
	this.strokeElem = new Array();
	this.pathElem = new Array();
	this.tpElem = new Array();
	this.oldButtonNames = new Array();
	this.buttonWidths = new Array();

	this.button = document.createElement('v:shape');
	this.configureVmlShape(this.button);
	node.appendChild(this.button);

	for (var i = 0; i < button.length; i++)
	{
		this.currentPath.push(document.createElement('v:line'));
		this.currentPath[i].style.position = 'absolute';
		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';
		this.currentPath[i].to = '1 0';
		this.currentPath[i].from = '0 0';

		this.fillElem.push(document.createElement('v:fill'));
		this.fillElem[i].on = 'true';
		this.currentPath[i].appendChild(this.fillElem[i]);

		this.strokeElem.push(document.createElement('v:stroke'));
		this.strokeElem[i].on = 'false';
		this.currentPath[i].appendChild(this.strokeElem[i]);

		this.pathElem.push(document.createElement('v:path'));
		this.pathElem[i].textpathok = 'true';
		this.currentPath[i].appendChild(this.pathElem[i]);

		this.tpElem.push(document.createElement('v:textpath'));
		this.tpElem[i].style.cssText = 'v-text-align: center';
		this.tpElem[i].on = 'true';
		this.currentPath[i].appendChild(this.tpElem[i]);

		node.appendChild(this.currentPath[i]);
	}

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupAccordion.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON, 'Button').toString().split(',');
	this.buttonNum = button.length;
	this.buttonText = new Array();
	this.oldButtonNames = new Array();
	this.buttonWidths = new Array();
	this.buttonTextNode = new Array();

	this.button = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.button);

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.buttonText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.buttonText[i]);
	}

	return this.g;
};

mxShapeMockupAccordion.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.button);

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON, 'Button').toString().split(',');
	var newButtonNum = button.length;

	if (newButtonNum > this.buttonNum)
	{ 
		// we have to add some elements
		for (var i = this.buttonNum; i < newButtonNum; i++)
		{
			this.currentPath.push(document.createElement('v:line'));
			this.currentPath[i].style.position = 'absolute';
			this.currentPath[i].style.width = '1px';
			this.currentPath[i].style.height = '1px';
			this.currentPath[i].to = '1 0';
			this.currentPath[i].from = '0 0';

			this.fillElem.push(document.createElement('v:fill'));
			this.fillElem[i].on = 'true';
			this.currentPath[i].appendChild(this.fillElem[i]);

			this.strokeElem.push(document.createElement('v:stroke'));
			this.strokeElem[i].on = 'false';
			this.currentPath[i].appendChild(this.strokeElem[i]);

			this.pathElem.push(document.createElement('v:path'));
			this.pathElem[i].textpathok = 'true';
			this.currentPath[i].appendChild(this.pathElem[i]);

			this.tpElem.push(document.createElement('v:textpath'));
			this.tpElem[i].style.cssText = 'v-text-align: center';
			this.tpElem[i].on = 'true';
			this.currentPath[i].appendChild(this.tpElem[i]);

			this.node.appendChild(this.currentPath[i]);
		}
	}
	else if (newButtonNum < this.buttonNum)
	{ 
		// we have to remove some elements
		for (var i = newButtonNum; i < this.buttonNum; i++)
		{
			this.node.removeChild(this.currentPath[i]);
		}

		for (var i = newButtonNum; i < this.buttonNum; i++)
		{
			this.currentPath.pop();
			this.fillElem.pop();
			this.strokeElem.pop();
			this.pathElem.pop();
			this.tpElem.pop();
		}
	}

	this.shadowNode = null;

	this.buttonNum = newButtonNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var selButtonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_BUTTON_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	var selectedButton = -1;
	this.greatestWidth = 0;

	for (var i = 0; i < this.buttonNum; i++)
	{
		if (this.oldButtonNames[i] !== button[i] || this.oldScale !== this.scale)
		{
			var buttonText = button[i];

			if(buttonText.charAt(0) === '+')
			{
				buttonText = buttonText.substring(1);
			}

			this.buttonWidths[i] = this.getSizeForString(buttonText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.buttonWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.buttonWidths[i];
		}

		if(button[i].charAt(0) === '+')
		{
			selectedButton = i;
		}
	}

	var labelOffset = 15 * this.scale;
	arg.labelOffset = labelOffset;
	arg.buttonHeight = fontSize * 1.5 * this.scale;

	this.background.path = this.createPath(arg, 'background');
	this.button.filled = 'false';
	this.button.fillcolor = 'none';
	this.button.strokecolor = strokeColor;
	this.button.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.minWidth = 2 * labelOffset + this.greatestWidth;

	if (selectedButton !== -1)
	{
		if (typeof this.selectedButton === 'undefined' || this.selectedButton === null)
		{
			this.selectedButton = document.createElement('v:shape');
			this.node.insertBefore(this.selectedButton,this.currentPath[0]);
		}

		this.updateVmlShape(this.selectedButton);
		arg.selectedButton = selectedButton;
		this.selectedButton.path = this.createPath(arg, 'selectedButton');
		this.selectedButton.filled = 'true';
		this.selectedButton.fillcolor = selButtonColor;
		this.selectedButton.strokecolor = strokeColor;
		this.selectedButton.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	}
	else
	{
		//either delete the shape, or make it null
		if (typeof this.selectedButton !== 'undefined' && this.selectedButton !== null)
		{
			this.node.removeChild(this.selectedButton);
			this.selectedButton = null;
		}
	}

	this.button.path = this.createPath(arg, 'buttonSeparator');
	var totalWidth = Math.max(this.minWidth , arg.w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, arg.h);
	var minHeight = this.buttonNum * arg.buttonHeight;

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);
		this.fillElem[i].color = textColor;
		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		var currHeight = arg.buttonHeight * (i+1);
		var windowHeight = totalHeight - minHeight;

		if (arg.selectedButton !== -1 && arg.selectedButton < i)
		{
			currHeight = currHeight + windowHeight;
		}

		var currX = Math.round((this.greatestWidth / 2  + labelOffset) * totalWidth / this.minWidth);
		var currY = Math.round(currHeight - arg.buttonHeight * 0.5);
		this.currentPath[i].to = (currX + 1) + ' ' + currY;
		this.currentPath[i].from = (currX - 1) + ' ' + currY;

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';
		var buttonText = button[i];

		if(buttonText.charAt(0) === '+')
		{
			buttonText = buttonText.substring(1);
		}

		this.tpElem[i].string = buttonText;
	}

	this.updateRotation();

	this.oldButtonNames = button;
	this.oldScale = this.scale;
};

mxShapeMockupAccordion.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.greatestWidth = 0;
	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON, 'Button').toString().split(',');
	var newButtonNum = button.length;

	if (newButtonNum > this.buttonNum)
	{
		// we have to add some elements
		for (var i = this.buttonNum; i < newButtonNum; i++)
		{
			this.buttonText = document.createElementNS(mxConstants.NS_SVG, 'text');
			this.g.appendChild(this.buttonText);
		}
	}
	else if (newButtonNum < this.buttonNum)
	{ 
		// we have to remove some elements
		for (var i = newButtonNum; i < this.buttonNum; i++)
		{
			this.g.removeChild(this.buttonText[i]);
		}

		for (var i = newButtonNum; i < this.buttonNum; i++)
		{
			this.buttonText.pop();
		}
	}

	this.shadowNode = null;
	this.buttonNum = newButtonNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var selButtonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_BUTTON_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	var selectedButton = -1;

	for (var i = 0; i < this.buttonNum; i++)
	{
		if(button[i].charAt(0) === '+')
		{
			selectedButton = i;
		}

		var buttonString = button[i];

		if(buttonString.charAt(0) === '+')
		{
			buttonString = buttonString.substring(1);
		}

		if (this.oldButtonNames[i] !== button[i] || this.scale !== this.oldScale || fontSize !== this.oldFontSize)
		{
			this.buttonWidths[i] = this.getSizeForString(buttonString, fontSize * this.scale, mxConstants.DEFAULT_FONTFAMILY).width  * this.scale * 1.6;
		}

		if (this.buttonWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.buttonWidths[i];
		}
	}

	var labelOffset = 15 * this.scale;
	arg.labelOffset = labelOffset;
	arg.buttonHeight = fontSize * 1.5 * this.scale;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.button.setAttribute('fill', fillColor);
	this.button.setAttribute('stroke', strokeColor);
	this.button.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.minWidth = 2 * labelOffset + this.greatestWidth;
	arg.selectedButton = selectedButton;

	if (selectedButton !== -1)
	{
		if (typeof this.selectedButton === 'undefined' || this.selectedButton === null)
		{
			this.selectedButton = document.createElementNS(mxConstants.NS_SVG, 'path');
			this.g.insertBefore(this.selectedButton,this.buttonText[0]);
			arg.selectedButton = selectedButton;
		}

		this.selectedButton.setAttribute('d', this.createPath(arg, 'selectedButton'));
		this.selectedButton.setAttribute('fill', selButtonColor);
		this.selectedButton.setAttribute('stroke', strokeColor);
		this.selectedButton.setAttribute('stroke-width', this.strokewidth * this.scale);
	}
	else
	{
		//either delete the shape, or make it null
		if (typeof this.selectedButton !== 'undefined' && this.selectedButton !== null)
		{
			this.g.removeChild(this.selectedButton);
			this.selectedButton = null;
		}
	}

	this.button.setAttribute('d', this.createPath(arg, 'buttonSeparator'));
	var totalWidth = Math.max(this.minWidth , arg.w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, arg.h);
	var minHeight = this.buttonNum * arg.buttonHeight;

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.buttonText[i].setAttribute('fill', textColor);
		this.buttonText[i].setAttribute('font-size', fontSize * this.scale);
		this.buttonText[i].setAttribute('text-anchor', 'middle');

		var windowHeight = totalHeight - minHeight;
		var currHeight = arg.buttonHeight * (i+1) + fontSize * 0.25 * this.scale;

		if (arg.selectedButton !== -1 && arg.selectedButton < i)
		{
			currHeight = currHeight + windowHeight;
		}

		var currY = Math.round(currHeight - arg.buttonHeight * 0.5);

		this.buttonText[i].setAttribute('x', this.bounds.x + (this.greatestWidth / 2  + labelOffset) * totalWidth / this.minWidth);
		this.buttonText[i].setAttribute('y', this.bounds.y + currY);

		var buttonString = button[i];

		if(buttonString.charAt(0) === '+')
		{
			buttonString = buttonString.substring(1);
		}

		if (this.buttonTextNode.length > i)
		{
			this.buttonText[i].removeChild(this.buttonTextNode[i]);
		}

		this.buttonTextNode[i] = document.createTextNode(buttonString);
		this.buttonText[i].appendChild(this.buttonTextNode[i]);
	}
	this.updateRotation();

	this.oldTabNames = button;
	this.oldFontSize = fontSize;
	this.oldScale = this.scale;
};

mxShapeMockupAccordion.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var minWidth = this.greatestWidth + 2 * arg.labelOffset;
	var totalWidth = Math.max(minWidth, w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, h);
	var minHeight = this.buttonNum * arg.buttonHeight;
	var windowHeight = totalHeight - minHeight;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + totalWidth, dy);
		path.lineTo(dx + totalWidth, dy + totalHeight);
		path.lineTo(dx, dy + totalHeight);
		path.close();
	}
	else if (shape === 'buttonSeparator')
	{
		for (var i = 0; i < this.buttonNum ; i++)
		{
			var currHeight = arg.buttonHeight * (i+1);

			if (arg.selectedButton !== -1 && arg.selectedButton < i)
			{
				currHeight = currHeight + windowHeight - arg.buttonHeight;
			}

			path.moveTo(dx, dy + currHeight);
			path.lineTo(dx + totalWidth, dy + currHeight);
		}
	}
	else if (shape === 'selectedButton')
	{
		var buttonTop = arg.buttonHeight * arg.selectedButton;
		var buttonBottom = arg.buttonHeight * (arg.selectedButton + 1);
		path.moveTo(dx, dy + buttonTop);
		path.lineTo(dx + totalWidth, dy + buttonTop);
		path.lineTo(dx + totalWidth, dy + buttonBottom);
		path.lineTo(dx, dy + buttonBottom);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Browser Window
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupBrowserWindow.prototype = new mxShapeMockup();
mxShapeMockupBrowserWindow.prototype.constructor = mxShapeMockupBrowserWindow;

mxShapeMockupBrowserWindow.prototype.origWidth = 550;
mxShapeMockupBrowserWindow.prototype.origHeight = 380;
mxShapeMockupBrowserWindow.prototype.origAspect = mxShapeMockupBrowserWindow.prototype.origWidth / mxShapeMockupBrowserWindow.prototype.origHeight;

function mxShapeMockupBrowserWindow(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupBrowserWindow.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.topBar1 = document.createElement('v:shape');
	this.configureVmlShape(this.topBar1);
	node.appendChild(this.topBar1);

	this.topBar2 = document.createElement('v:shape');
	this.configureVmlShape(this.topBar2);
	node.appendChild(this.topBar2);

	this.buttons1 = document.createElement('v:shape');
	this.configureVmlShape(this.buttons1);
	node.appendChild(this.buttons1);

	this.buttons2 = document.createElement('v:shape');
	this.configureVmlShape(this.buttons2);
	node.appendChild(this.buttons2);

	this.statusBar = document.createElement('v:shape');
	this.configureVmlShape(this.statusBar);
	node.appendChild(this.statusBar);

	this.lineShapes = document.createElement('v:shape');
	this.configureVmlShape(this.lineShapes);
	node.appendChild(this.lineShapes);

	this.titleTextPath = document.createElement('v:line');
	this.titleTextPath.style.position = 'absolute';
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextPath.to = '1 0';
	this.titleTextPath.from = '0 0';

	this.titleTextFillElem = document.createElement('v:fill');
	this.titleTextFillElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextFillElem);

	this.titleTextStrokeElem = document.createElement('v:stroke');
	this.titleTextStrokeElem.on = 'false';
	this.titleTextPath.appendChild(this.titleTextStrokeElem);

	this.titleTextPathElem = document.createElement('v:path');
	this.titleTextPathElem.textpathok = 'true';
	this.titleTextPath.appendChild(this.titleTextPathElem);

	this.titleTextTpElem = document.createElement('v:textpath');
	this.titleTextTpElem.style.cssText = 'v-text-align: left';
	this.titleTextTpElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextTpElem);

	node.appendChild(this.titleTextPath);

	this.urlTextShape = document.createElement('v:shape');
	this.configureVmlShape(this.urlTextShape);
	node.appendChild(this.urlTextShape);

	this.urlTextPath = document.createElement('v:line');
	this.urlTextPath.style.position = 'absolute';
	this.urlTextPath.style.width = '1px';
	this.urlTextPath.style.height = '1px';
	this.urlTextPath.to = '1 0';
	this.urlTextPath.from = '0 0';

	this.urlTextFillElem = document.createElement('v:fill');
	this.urlTextFillElem.on = 'true';
	this.urlTextPath.appendChild(this.urlTextFillElem);

	this.urlTextStrokeElem = document.createElement('v:stroke');
	this.urlTextStrokeElem.on = 'false';
	this.urlTextPath.appendChild(this.urlTextStrokeElem);

	this.urlTextPathElem = document.createElement('v:path');
	this.urlTextPathElem.textpathok = 'true';
	this.urlTextPath.appendChild(this.urlTextPathElem);

	this.urlTextTpElem = document.createElement('v:textpath');
	this.urlTextTpElem.style.cssText = 'v-text-align: left';
	this.urlTextTpElem.on = 'true';
	this.urlTextPath.appendChild(this.urlTextTpElem);

	node.appendChild(this.urlTextPath);

	this.statusTextShape = document.createElement('v:shape');
	this.configureVmlShape(this.statusTextShape);
	node.appendChild(this.statusTextShape);

	this.statusTextPath = document.createElement('v:line');
	this.statusTextPath.style.position = 'absolute';
	this.statusTextPath.style.width = '1px';
	this.statusTextPath.style.height = '1px';
	this.statusTextPath.to = '1 0';
	this.statusTextPath.from = '0 0';

	this.statusTextFillElem = document.createElement('v:fill');
	this.statusTextFillElem.on = 'true';
	this.statusTextPath.appendChild(this.statusTextFillElem);

	this.statusTextStrokeElem = document.createElement('v:stroke');
	this.statusTextStrokeElem.on = 'false';
	this.statusTextPath.appendChild(this.statusTextStrokeElem);

	this.statusTextPathElem = document.createElement('v:path');
	this.statusTextPathElem.textpathok = 'true';
	this.statusTextPath.appendChild(this.statusTextPathElem);

	this.statusTextTpElem = document.createElement('v:textpath');
	this.statusTextTpElem.style.cssText = 'v-text-align: left';
	this.statusTextTpElem.on = 'true';
	this.statusTextPath.appendChild(this.statusTextTpElem);

	node.appendChild(this.statusTextPath);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupBrowserWindow.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.topBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.topBar);

	this.buttons = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttons);

	this.statusBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.statusBar);

	this.lineShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.lineShapes);

	this.titleText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.titleText);
	this.titleTextNode = document.createTextNode(' ');
	this.titleText.appendChild(this.titleTextNode);

	this.urlText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.urlText);
	this.urlTextNode = document.createTextNode(' ');
	this.urlText.appendChild(this.urlTextNode);

	this.statusText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.statusText);
	this.statusTextNode = document.createTextNode(' ');
	this.statusText.appendChild(this.statusTextNode);

	return this.g;
};

mxShapeMockupBrowserWindow.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.topBar1);
	this.updateVmlShape(this.topBar2);
	this.updateVmlShape(this.buttons1);
	this.updateVmlShape(this.buttons2);
	this.updateVmlShape(this.statusBar);
	this.updateVmlShape(this.lineShapes);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Browser Window Title').toString();
	var urlText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.URL_TEXT, 'http://www.draw.io').toString();
	var statusText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.STATUS_TEXT, 'Online').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();

	this.background.path = this.createPath(arg, 'background');
	this.topBar1.path = this.createPath(arg, 'topBarVml1');
	this.topBar2.path = this.createPath(arg, 'topBarVml2');
	this.buttons1.path = this.createPath(arg, 'buttonsVml1');
	this.buttons2.path = this.createPath(arg, 'buttonsVml2');
	this.statusBar.path = this.createPath(arg, 'statusBar');
	this.lineShapes.path = this.createPath(arg, 'lineShapes');

	this.topBar1.fillcolor = frameColor;
	this.topBar1.strokecolor = strokeColor;
	this.topBar1.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.topBar2.fillcolor = fillColor;
	this.topBar2.strokecolor = strokeColor;
	this.topBar2.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.buttons1.fillcolor = strokeColor;
	this.buttons1.strokecolor = strokeColor;
	this.buttons1.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.buttons2.fillcolor = frameColor;
	this.buttons2.strokecolor = 'none';
	this.buttons2.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.statusBar.fillcolor = frameColor;
	this.statusBar.strokecolor = strokeColor;
	this.statusBar.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.lineShapes.filled = 'false';
	this.lineShapes.fillcolor = 'none';
	this.lineShapes.strokecolor = strokeColor;
	this.lineShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	var height = Math.max(arg.h, 120 * this.scale);

	this.updateVmlShape(this.titleTextPath);
	this.titleTextFillElem.color = fontColor;
	this.titleTextTpElem.style.fontSize = Math.round(18 * this.scale) + 'px';
	this.titleTextPath.to = Math.round(arg.dx + 5 * this.scale + 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.from = Math.round(arg.dx + 5 * this.scale * 0.5 - 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextTpElem.string = titleText;

	this.updateVmlShape(this.urlTextPath);
	this.urlTextFillElem.color = fontColor;
	this.urlTextTpElem.style.fontSize = Math.round(18 * this.scale) + 'px';
	this.urlTextPath.to = Math.round(arg.dx + 150 * this.scale + 1) + ' ' + Math.round(arg.dy + 58 * this.scale);
	this.urlTextPath.from = Math.round(arg.dx + 150 * this.scale - 1) + ' ' + Math.round(arg.dy + 58 * this.scale);
	this.urlTextPath.style.width = '1px';
	this.urlTextPath.style.height = '1px';
	this.urlTextTpElem.string = urlText;

	this.updateVmlShape(this.statusTextPath);
	this.statusTextFillElem.color = fontColor;
	this.statusTextTpElem.style.fontSize = Math.round(15 * this.scale) + 'px';
	this.statusTextPath.to = Math.round(arg.dx + 5 * this.scale + 1) + ' ' + Math.round(arg.dy + height - 8 * this.scale);
	this.statusTextPath.from = Math.round(arg.dx + 5 * this.scale - 1) + ' ' + Math.round(arg.dy + height - 8 * this.scale);
	this.statusTextPath.style.width = '1px';
	this.statusTextPath.style.height = '1px';
	this.statusTextTpElem.string = statusText;

	this.updateRotation();
};

mxShapeMockupBrowserWindow.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Browser Window Title').toString();
	var urlText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.URL_TEXT, 'http://www.draw.io').toString();
	var statusText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.STATUS_TEXT, 'Online').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();

	this.innerNode.setAttribute('fill', fillColor);

	this.topBar.setAttribute('d', this.createPath(arg, 'topBarSvg'));
	this.buttons.setAttribute('d', this.createPath(arg, 'buttonsSvg'));
	this.statusBar.setAttribute('d', this.createPath(arg, 'statusBar'));
	this.lineShapes.setAttribute('d', this.createPath(arg, 'lineShapes'));

	this.topBar.setAttribute('fill', frameColor);
	this.topBar.setAttribute('stroke', strokeColor);
	this.topBar.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.buttons.setAttribute('fill', strokeColor);
	this.buttons.setAttribute('stroke', 'none');
//	this.buttons.setAttribute('stroke', strokeColor);
	this.buttons.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.statusBar.setAttribute('fill', frameColor);
	this.statusBar.setAttribute('stroke', strokeColor);
	this.statusBar.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.lineShapes.setAttribute('fill', 'none');
	this.lineShapes.setAttribute('stroke', strokeColor);
	this.lineShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var height = Math.max(arg.h, 120 * this.scale);

	this.titleText.setAttribute('fill', fontColor);
	this.titleText.setAttribute('font-size', 18 * this.scale);
	this.titleText.setAttribute('text-anchor', 'start');
	this.titleText.setAttribute('x', this.bounds.x + 5 * this.scale);
	this.titleText.setAttribute('y', this.bounds.y + 16 * this.scale);

	if (this.titleTextNode !== null || typeof this.titleTextNode !== 'undefined')
	{
		this.titleText.removeChild(this.titleTextNode);
	}

	this.titleTextNode = document.createTextNode(titleText);
	this.titleText.appendChild(this.titleTextNode);

	this.urlText.setAttribute('fill', fontColor);
	this.urlText.setAttribute('font-size', 18 * this.scale);
	this.urlText.setAttribute('text-anchor', 'start');
	this.urlText.setAttribute('x', this.bounds.x + 150 * this.scale);
	this.urlText.setAttribute('y', this.bounds.y + 60 * this.scale);

	if (this.urlTextNode !== null || typeof this.urlTextNode !== 'undefined')
	{
		this.urlText.removeChild(this.urlTextNode);
	}

	this.urlTextNode = document.createTextNode(urlText);
	this.urlText.appendChild(this.urlTextNode);

	this.statusText.setAttribute('fill', fontColor);
	this.statusText.setAttribute('font-size', 15 * this.scale);
	this.statusText.setAttribute('text-anchor', 'start');
	this.statusText.setAttribute('x', this.bounds.x + 5 * this.scale);
	this.statusText.setAttribute('y', this.bounds.y + height - 5 * this.scale);

	if (this.statusTextNode !== null || typeof this.statusTextNode !== 'undefined')
	{
		this.statusText.removeChild(this.statusTextNode);
	}

	this.statusTextNode = document.createTextNode(statusText);
	this.statusText.appendChild(this.statusTextNode);

	this.updateRotation();
};

mxShapeMockupBrowserWindow.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 250 * this.scale);
	var height = Math.max(h, 120 * this.scale);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
	else if (shape === 'topBarSvg')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + 80 * this.scale);
		path.lineTo(dx, dy + 80 * this.scale);
		path.close();

		path.moveTo(dx + 145 * this.scale, dy + 40 * this.scale);
		path.lineTo(dx + 145 * this.scale, dy + 70 * this.scale);
		path.lineTo(dx + width - 65 * this.scale, dy + 70 * this.scale);
		path.lineTo(dx + width - 65 * this.scale, dy + 40 * this.scale);
		path.close();
	}
	else if (shape === 'buttonsSvg')
	{
		path.moveTo(dx + 35 * this.scale, dy + 40 * this.scale);
		path.arcTo(dx + 35 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 50 * this.scale, dy + 55 * this.scale);
		path.arcTo(dx + 50 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 35 * this.scale, dy + 70 * this.scale);
		path.arcTo(dx + 35 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 20 * this.scale, dy + 55 * this.scale);
		path.arcTo(dx + 20 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 35 * this.scale, dy + 40 * this.scale);
		path.close();
		path.moveTo(dx + 45 * this.scale, dy + 50 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 50 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 45 * this.scale);
		path.lineTo(dx + 24 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 65 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 60 * this.scale);
		path.lineTo(dx + 45 * this.scale, dy + 60 * this.scale);
		path.close();

		path.moveTo(dx + 75 * this.scale, dy + 40 * this.scale);
		path.arcTo(dx + 75 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 90 * this.scale, dy + 55 * this.scale);
		path.arcTo(dx + 90 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 75 * this.scale, dy + 70 * this.scale);
		path.arcTo(dx + 75 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 60 * this.scale, dy + 55 * this.scale);
		path.arcTo(dx + 60 * this.scale, dy + 40 * this.scale, 15 * this.scale, 15 * this.scale, 0, 0, 1, dx + 75 * this.scale, dy + 40 * this.scale);
		path.close();

		path.moveTo(dx + 65 * this.scale, dy + 50 * this.scale);
		path.lineTo(dx + 65 * this.scale, dy + 60 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 60 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 65 * this.scale);
		path.lineTo(dx + 86 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 45 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 50 * this.scale);
		path.close();

		path.moveTo(dx + 110 * this.scale, dy + 70 * this.scale);
		path.lineTo(dx + 110 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 105 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 120 * this.scale, dy + 40 * this.scale);
		path.lineTo(dx + 135 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 130 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 130 * this.scale, dy + 70 * this.scale);
		path.close();

		path.moveTo(dx + width - 43 * this.scale, dy + 48 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 42 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 45 * this.scale);
		path.arcTo(dx + width - 35 * this.scale, dy + 45 * this.scale, 12 * this.scale, 12 * this.scale, 0, 0, 1, dx + width - 25 * this.scale, dy + 58 * this.scale);
		path.arcTo(dx + width - 25 * this.scale, dy + 58 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 0, dx + width - 35 * this.scale, dy + 51 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 54 * this.scale);
		path.close();

		path.moveTo(dx + width - 27 * this.scale, dy + 62 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 56 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 59 * this.scale);
		path.arcTo(dx + width - 35 * this.scale, dy + 59 * this.scale, 12 * this.scale, 12 * this.scale, 0, 0, 1, dx + width - 45 * this.scale, dy + 52 * this.scale);
		path.arcTo(dx + width - 45 * this.scale, dy + 52 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 0, dx + width - 35 * this.scale, dy + 65 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 68 * this.scale);
		path.close();
	}
	else if (shape === 'statusBar')
	{
		path.moveTo(dx, dy + height - 20 * this.scale);
		path.lineTo(dx + width, dy + height - 20 * this.scale);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
	else if (shape === 'lineShapes')
	{
		path.moveTo(dx + width - 58 * this.scale, dy + 16 * this.scale);
		path.lineTo(dx + width - 44 * this.scale, dy + 16 * this.scale);

		path.moveTo(dx + width - 39 * this.scale, dy + 6 * this.scale);
		path.lineTo(dx + width - 25 * this.scale, dy + 6 * this.scale);
		path.lineTo(dx + width - 25 * this.scale, dy + 16 * this.scale);
		path.lineTo(dx + width - 39 * this.scale, dy + 16 * this.scale);
		path.close();

		path.moveTo(dx + width - 6 * this.scale, dy + 4 * this.scale);
		path.lineTo(dx + width - 20 * this.scale, dy + 16 * this.scale);
		path.moveTo(dx + width - 20 * this.scale, dy + 4 * this.scale);
		path.lineTo(dx + width - 6 * this.scale, dy + 16 * this.scale);
		path.close();

		path.ellipse(dx + width - 18 * this.scale, dy + height - 18 * this.scale, 16 * this.scale, 16 * this.scale);
		path.close();
		path.moveTo(dx + width - 14 * this.scale, dy + height - 17 * this.scale);
		path.lineTo(dx + width - 14 * this.scale, dy + height - 3 * this.scale);
		path.moveTo(dx + width - 10 * this.scale, dy + height - 18 * this.scale);
		path.lineTo(dx + width - 10 * this.scale, dy + height - 2 * this.scale);
		path.moveTo(dx + width - 6 * this.scale, dy + height - 17 * this.scale);
		path.lineTo(dx + width - 6 * this.scale, dy + height - 3 * this.scale);

		path.moveTo(dx + width - 15 * this.scale, dy + height - 16 * this.scale);
		path.lineTo(dx + width - 5 * this.scale, dy + height - 16 * this.scale);
		path.moveTo(dx + width - 17.5 * this.scale, dy + height - 13 * this.scale);
		path.lineTo(dx + width - 2.5 * this.scale, dy + height - 13 * this.scale);
		path.moveTo(dx + width - 18 * this.scale, dy + height - 10 * this.scale);
		path.lineTo(dx + width - 2 * this.scale, dy + height - 10 * this.scale);
		path.moveTo(dx + width - 17.5 * this.scale, dy + height - 7 * this.scale);
		path.lineTo(dx + width - 2.5 * this.scale, dy + height - 7 * this.scale);
		path.moveTo(dx + width - 15 * this.scale, dy + height - 4 * this.scale);
		path.lineTo(dx + width - 5 * this.scale, dy + height - 4 * this.scale);
	}
	else if (shape === 'buttonsVml1')
	{
		path.ellipse(dx + 20 * this.scale, dy + 40 * this.scale, 30 * this.scale, 30 * this.scale);
		path.close();
		path.ellipse(dx + 60 * this.scale, dy + 40 * this.scale, 30 * this.scale, 30 * this.scale);
		path.close();

		path.moveTo(dx + 110 * this.scale, dy + 70 * this.scale);
		path.lineTo(dx + 110 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 105 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 120 * this.scale, dy + 40 * this.scale);
		path.lineTo(dx + 135 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 130 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 130 * this.scale, dy + 70 * this.scale);
		path.close();

		path.moveTo(dx + width - 43 * this.scale, dy + 48 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 42 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 45 * this.scale);
		path.arcTo(dx + width - 35 * this.scale, dy + 45 * this.scale, 12 * this.scale, 12 * this.scale, 0, 0, 1, dx + width - 25 * this.scale, dy + 58 * this.scale);
		path.arcTo(dx + width - 25 * this.scale, dy + 58 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 0, dx + width - 35 * this.scale, dy + 51 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 54 * this.scale);
		path.close();

		path.moveTo(dx + width - 27 * this.scale, dy + 62 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 56 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 59 * this.scale);
		path.arcTo(dx + width - 35 * this.scale, dy + 59 * this.scale, 12 * this.scale, 12 * this.scale, 0, 0, 1, dx + width - 45 * this.scale, dy + 52 * this.scale);
		path.arcTo(dx + width - 45 * this.scale, dy + 52 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 0, dx + width - 35 * this.scale, dy + 65 * this.scale);
		path.lineTo(dx + width - 35 * this.scale, dy + 68 * this.scale);
		path.close();
	}
	else if (shape === 'buttonsVml2')
	{
		path.moveTo(dx + 45 * this.scale, dy + 50 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 50 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 45 * this.scale);
		path.lineTo(dx + 24 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 65 * this.scale);
		path.lineTo(dx + 31 * this.scale, dy + 60 * this.scale);
		path.lineTo(dx + 45 * this.scale, dy + 60 * this.scale);
		path.close();

		path.moveTo(dx + 65 * this.scale, dy + 50 * this.scale);
		path.lineTo(dx + 65 * this.scale, dy + 60 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 60 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 65 * this.scale);
		path.lineTo(dx + 86 * this.scale, dy + 55 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 45 * this.scale);
		path.lineTo(dx + 79 * this.scale, dy + 50 * this.scale);
		path.close();
	}
	else if (shape === 'topBarVml1')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + 80 * this.scale);
		path.lineTo(dx, dy + 80 * this.scale);
		path.close();
	}
	else if (shape === 'topBarVml2')
	{
		path.moveTo(dx + 145 * this.scale, dy + 40 * this.scale);
		path.lineTo(dx + 145 * this.scale, dy + 70 * this.scale);
		path.lineTo(dx + width - 65 * this.scale, dy + 70 * this.scale);
		path.lineTo(dx + width - 65 * this.scale, dy + 40 * this.scale);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Window
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupWindow.prototype = new mxShapeMockup();
mxShapeMockupWindow.prototype.constructor = mxShapeMockupWindow;

mxShapeMockupWindow.prototype.origWidth = 550;
mxShapeMockupWindow.prototype.origHeight = 380;
mxShapeMockupWindow.prototype.origAspect = mxShapeMockupWindow.prototype.origWidth / mxShapeMockupWindow.prototype.origHeight;

function mxShapeMockupWindow(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupWindow.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.topBar = document.createElement('v:shape');
	this.configureVmlShape(this.topBar);
	node.appendChild(this.topBar);

	this.lineShapes = document.createElement('v:shape');
	this.configureVmlShape(this.lineShapes);
	node.appendChild(this.lineShapes);

	this.titleTextPath = document.createElement('v:line');
	this.titleTextPath.style.position = 'absolute';
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextPath.to = '1 0';
	this.titleTextPath.from = '0 0';

	this.titleTextFillElem = document.createElement('v:fill');
	this.titleTextFillElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextFillElem);

	this.titleTextStrokeElem = document.createElement('v:stroke');
	this.titleTextStrokeElem.on = 'false';
	this.titleTextPath.appendChild(this.titleTextStrokeElem);

	this.titleTextPathElem = document.createElement('v:path');
	this.titleTextPathElem.textpathok = 'true';
	this.titleTextPath.appendChild(this.titleTextPathElem);

	this.titleTextTpElem = document.createElement('v:textpath');
	this.titleTextTpElem.style.cssText = 'v-text-align: left';
	this.titleTextTpElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextTpElem);

	node.appendChild(this.titleTextPath);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupWindow.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.topBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.topBar);

	this.lineShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.lineShapes);

	this.titleText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.titleText);
	this.titleTextNode = document.createTextNode(' ');
	this.titleText.appendChild(this.titleTextNode);

	return this.g;
};

mxShapeMockupWindow.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.topBar);
	this.updateVmlShape(this.lineShapes);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Window Title').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();

	this.background.path = this.createPath(arg, 'background');
	this.topBar.path = this.createPath(arg, 'topBar');
	this.lineShapes.path = this.createPath(arg, 'lineShapes');

	this.topBar.fillcolor = frameColor;
	this.topBar.strokecolor = strokeColor;
	this.topBar.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.lineShapes.filled = 'false';
	this.lineShapes.fillcolor = 'none';
	this.lineShapes.strokecolor = strokeColor;
	this.lineShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateVmlShape(this.titleTextPath);
	this.titleTextFillElem.color = fontColor;
	this.titleTextTpElem.style.fontSize = Math.round(18 * this.scale) + 'px';
	this.titleTextPath.to = Math.round(arg.dx + 5 * this.scale + 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.from = Math.round(arg.dx + 5 * this.scale * 0.5 - 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextTpElem.string = titleText;

	this.updateRotation();
};

mxShapeMockupWindow.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Window Title').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();

	this.innerNode.setAttribute('fill', fillColor);

	this.topBar.setAttribute('d', this.createPath(arg, 'topBar'));
	this.lineShapes.setAttribute('d', this.createPath(arg, 'lineShapes'));

	this.topBar.setAttribute('fill', frameColor);
	this.topBar.setAttribute('stroke', strokeColor);
	this.topBar.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.lineShapes.setAttribute('fill', 'none');
	this.lineShapes.setAttribute('stroke', strokeColor);
	this.lineShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.titleText.setAttribute('fill', fontColor);
	this.titleText.setAttribute('font-size', 18 * this.scale);
	this.titleText.setAttribute('text-anchor', 'start');
	this.titleText.setAttribute('x', this.bounds.x + 5 * this.scale);
	this.titleText.setAttribute('y', this.bounds.y + 16 * this.scale);

	if (this.titleTextNode !== null || typeof this.titleTextNode !== 'undefined')
	{
		this.titleText.removeChild(this.titleTextNode);
	}

	this.titleTextNode = document.createTextNode(titleText);
	this.titleText.appendChild(this.titleTextNode);

	this.updateRotation();
};

mxShapeMockupWindow.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 150 * this.scale);
	var height = Math.max(h, 30 * this.scale);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
	else if (shape === 'topBar')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + 25 * this.scale);
		path.lineTo(dx, dy + 25 * this.scale);
		path.close();
	}
	else if (shape === 'lineShapes')
	{
		path.moveTo(dx + width - 58 * this.scale, dy + 16 * this.scale);
		path.lineTo(dx + width - 44 * this.scale, dy + 16 * this.scale);

		path.moveTo(dx + width - 39 * this.scale, dy + 6 * this.scale);
		path.lineTo(dx + width - 25 * this.scale, dy + 6 * this.scale);
		path.lineTo(dx + width - 25 * this.scale, dy + 16 * this.scale);
		path.lineTo(dx + width - 39 * this.scale, dy + 16 * this.scale);
		path.close();

		path.moveTo(dx + width - 6 * this.scale, dy + 4 * this.scale);
		path.lineTo(dx + width - 20 * this.scale, dy + 16 * this.scale);
		path.moveTo(dx + width - 20 * this.scale, dy + 4 * this.scale);
		path.lineTo(dx + width - 6 * this.scale, dy + 16 * this.scale);
	}
};

//**********************************************************************************************************************************************************
//Group
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupGroup.prototype = new mxShapeMockup();
mxShapeMockupGroup.prototype.constructor = mxShapeMockupGroup;

mxShapeMockupGroup.prototype.origWidth = 150;
mxShapeMockupGroup.prototype.origHeight = 200;
mxShapeMockupGroup.prototype.origAspect = mxShapeMockupGroup.prototype.origWidth / mxShapeMockupGroup.prototype.origHeight;

function mxShapeMockupGroup(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupGroup.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.textBg = document.createElement('v:shape');
	this.configureVmlShape(this.textBg);
	node.appendChild(this.textBg);

	this.titleTextPath = document.createElement('v:line');
	this.titleTextPath.style.position = 'absolute';
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextPath.to = '1 0';
	this.titleTextPath.from = '0 0';

	this.titleTextFillElem = document.createElement('v:fill');
	this.titleTextFillElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextFillElem);

	this.titleTextStrokeElem = document.createElement('v:stroke');
	this.titleTextStrokeElem.on = 'false';
	this.titleTextPath.appendChild(this.titleTextStrokeElem);

	this.titleTextPathElem = document.createElement('v:path');
	this.titleTextPathElem.textpathok = 'true';
	this.titleTextPath.appendChild(this.titleTextPathElem);

	this.titleTextTpElem = document.createElement('v:textpath');
	this.titleTextTpElem.style.cssText = 'v-text-align: left';
	this.titleTextTpElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextTpElem);

	node.appendChild(this.titleTextPath);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupGroup.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.textBg = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.textBg);
	this.titleText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.titleText);
	this.titleTextNode = document.createTextNode(' ');
	this.titleText.appendChild(this.titleTextNode);

	return this.g;
};

mxShapeMockupGroup.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.textBg);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Window Title').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none').toString();
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	arg.titleTextWidth = this.getSizeForString(titleText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width * this.scale * 1.45;

	this.background.path = this.createPath(arg, 'background');
	this.textBg.path = this.createPath(arg, 'textBg');

//	this.textBg.filled = fillColor === 'none' ? 'false' : 'true';
	this.textBg.strokecolor = 'none';
	this.textBg.fillcolor = fillColor;

	this.updateVmlShape(this.titleTextPath);
	this.titleTextFillElem.color = fontColor;
	this.titleTextTpElem.style.fontSize = Math.round(18 * this.scale) + 'px';
	this.titleTextPath.to = Math.round(arg.dx + 5 * this.scale + 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.from = Math.round(arg.dx + 5 * this.scale * 0.5) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextTpElem.string = titleText;

	this.updateRotation();
};

mxShapeMockupGroup.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Window Title').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none').toString();
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	arg.titleTextWidth = this.getSizeForString(titleText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width * this.scale * 1.6;
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.textBg.setAttribute('d', this.createPath(arg, 'textBg'));
	this.innerNode.setAttribute('fill', fillColor);

	this.textBg.setAttribute('fill', fillColor);
	this.textBg.setAttribute('stroke', 'none');

	this.titleText.setAttribute('fill', fontColor);
	this.titleText.setAttribute('font-size', 18 * this.scale);
	this.titleText.setAttribute('text-anchor', 'start');
	this.titleText.setAttribute('x', this.bounds.x + 5 * this.scale);
	this.titleText.setAttribute('y', this.bounds.y + 16 * this.scale);

	if (this.titleTextNode !== null || typeof this.titleTextNode !== 'undefined')
	{
		this.titleText.removeChild(this.titleTextNode);
	}

	this.titleTextNode = document.createTextNode(titleText);
	this.titleText.appendChild(this.titleTextNode);

	this.updateRotation();
};

mxShapeMockupGroup.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, (9 + arg.titleTextWidth) * this.scale);
	var height = Math.max(h, 30 * this.scale);

	if (shape === 'background')
	{
		path.moveTo(dx + (6 + arg.titleTextWidth) * this.scale, dy + 10 * this.scale);
		path.lineTo(dx + width, dy + 10 * this.scale);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.lineTo(dx, dy + 10 * this.scale);
		path.lineTo(dx + 3 * this.scale, dy + 10 * this.scale);
	}
	else if (shape === 'textBg')
	{
		path.moveTo(dx + 3 * this.scale, dy);
		path.lineTo(dx + (6 + arg.titleTextWidth) * this.scale, dy);
		path.lineTo(dx + (6 + arg.titleTextWidth) * this.scale, dy + 20 * this.scale);
		path.lineTo(dx + 3 * this.scale, dy + 20 * this.scale);
	}
};

//**********************************************************************************************************************************************************
//Alert Box
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupAlertBox.prototype = new mxShapeMockup();
mxShapeMockupAlertBox.prototype.constructor = mxShapeMockupAlertBox;

mxShapeMockupAlertBox.prototype.origWidth = 250;
mxShapeMockupAlertBox.prototype.origHeight = 120;
mxShapeMockupAlertBox.prototype.origAspect = mxShapeMockupAlertBox.prototype.origWidth / mxShapeMockupAlertBox.prototype.origHeight;

function mxShapeMockupAlertBox(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupAlertBox.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.topBar = document.createElement('v:shape');
	this.configureVmlShape(this.topBar);
	node.appendChild(this.topBar);

	this.buttons = document.createElement('v:shape');
	this.configureVmlShape(this.buttons);
	node.appendChild(this.buttons);

	this.titleTextPath = document.createElement('v:line');
	this.titleTextPath.style.position = 'absolute';
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextPath.to = '1 0';
	this.titleTextPath.from = '0 0';

	this.titleTextFillElem = document.createElement('v:fill');
	this.titleTextFillElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextFillElem);

	this.titleTextStrokeElem = document.createElement('v:stroke');
	this.titleTextStrokeElem.on = 'false';
	this.titleTextPath.appendChild(this.titleTextStrokeElem);

	this.titleTextPathElem = document.createElement('v:path');
	this.titleTextPathElem.textpathok = 'true';
	this.titleTextPath.appendChild(this.titleTextPathElem);

	this.titleTextTpElem = document.createElement('v:textpath');
	this.titleTextTpElem.style.cssText = 'v-text-align: left';
	this.titleTextTpElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextTpElem);

	node.appendChild(this.titleTextPath);

	this.subTextShape = document.createElement('v:shape');
	this.configureVmlShape(this.subTextShape);
	node.appendChild(this.subTextShape);

	this.subTextPath = document.createElement('v:line');
	this.subTextPath.style.position = 'absolute';
	this.subTextPath.style.width = '1px';
	this.subTextPath.style.height = '1px';
	this.subTextPath.to = '1 0';
	this.subTextPath.from = '0 0';

	this.subTextFillElem = document.createElement('v:fill');
	this.subTextFillElem.on = 'true';
	this.subTextPath.appendChild(this.subTextFillElem);

	this.subTextStrokeElem = document.createElement('v:stroke');
	this.subTextStrokeElem.on = 'false';
	this.subTextPath.appendChild(this.subTextStrokeElem);

	this.subTextPathElem = document.createElement('v:path');
	this.subTextPathElem.textpathok = 'true';
	this.subTextPath.appendChild(this.subTextPathElem);

	this.subTextTpElem = document.createElement('v:textpath');
	this.subTextTpElem.style.cssText = 'v-text-align: center';
	this.subTextTpElem.on = 'true';
	this.subTextPath.appendChild(this.subTextTpElem);

	node.appendChild(this.subTextPath);

	this.button1TextShape = document.createElement('v:shape');
	this.configureVmlShape(this.button1TextShape);
	node.appendChild(this.button1TextShape);

	this.button1TextPath = document.createElement('v:line');
	this.button1TextPath.style.position = 'absolute';
	this.button1TextPath.style.width = '1px';
	this.button1TextPath.style.height = '1px';
	this.button1TextPath.to = '1 0';
	this.button1TextPath.from = '0 0';

	this.button1TextFillElem = document.createElement('v:fill');
	this.button1TextFillElem.on = 'true';
	this.button1TextPath.appendChild(this.button1TextFillElem);

	this.button1TextStrokeElem = document.createElement('v:stroke');
	this.button1TextStrokeElem.on = 'false';
	this.button1TextPath.appendChild(this.button1TextStrokeElem);

	this.button1TextPathElem = document.createElement('v:path');
	this.button1TextPathElem.textpathok = 'true';
	this.button1TextPath.appendChild(this.button1TextPathElem);

	this.button1TextTpElem = document.createElement('v:textpath');
	this.button1TextTpElem.style.cssText = 'v-text-align: center';
	this.button1TextTpElem.on = 'true';
	this.button1TextPath.appendChild(this.button1TextTpElem);

	node.appendChild(this.button1TextPath);

	this.button2TextPath = document.createElement('v:line');
	this.button2TextPath.style.position = 'absolute';
	this.button2TextPath.style.width = '1px';
	this.button2TextPath.style.height = '1px';
	this.button2TextPath.to = '1 0';
	this.button2TextPath.from = '0 0';

	this.button2TextFillElem = document.createElement('v:fill');
	this.button2TextFillElem.on = 'true';
	this.button2TextPath.appendChild(this.button2TextFillElem);

	this.button2TextStrokeElem = document.createElement('v:stroke');
	this.button2TextStrokeElem.on = 'false';
	this.button2TextPath.appendChild(this.button2TextStrokeElem);

	this.button2TextPathElem = document.createElement('v:path');
	this.button2TextPathElem.textpathok = 'true';
	this.button2TextPath.appendChild(this.button2TextPathElem);

	this.button2TextTpElem = document.createElement('v:textpath');
	this.button2TextTpElem.style.cssText = 'v-text-align: center';
	this.button2TextTpElem.on = 'true';
	this.button2TextPath.appendChild(this.button2TextTpElem);

	node.appendChild(this.button2TextPath);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupAlertBox.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.topBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.topBar);

	this.buttons = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttons);

	this.titleText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.titleText);
	this.titleTextNode = document.createTextNode(' ');
	this.titleText.appendChild(this.titleTextNode);

	this.subText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.subText);
	this.subTextNode = document.createTextNode(' ');
	this.subText.appendChild(this.subTextNode);

	this.button1Text = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.button1Text);
	this.button1TextNode = document.createTextNode(' ');
	this.button1Text.appendChild(this.button1TextNode);

	this.button2Text = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.button2Text);
	this.button2TextNode = document.createTextNode(' ');
	this.button2Text.appendChild(this.button2TextNode);

	return this.g;
};

mxShapeMockupAlertBox.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var width = Math.max(arg.w, 230 * this.scale);
	var height = Math.max(arg.h, 120 * this.scale);

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.topBar);
	this.updateVmlShape(this.buttons);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Alert Box Title').toString();
	var subText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SUB_TEXT, 'Description text').toString();
	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Yes,No').toString().split(',');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();

	this.background.path = this.createPath(arg, 'background');
	this.topBar.path = this.createPath(arg, 'topBar');
	this.buttons.path = this.createPath(arg, 'buttons');

	this.topBar.fillcolor = frameColor;
	this.topBar.strokecolor = strokeColor;
	this.topBar.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.buttons.fillcolor = fillColor;
	this.buttons.strokecolor = strokeColor;
	this.buttons.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateVmlShape(this.titleTextPath);
	this.titleTextFillElem.color = fontColor;
	this.titleTextTpElem.style.fontSize = Math.round(18 * this.scale) + 'px';
	this.titleTextPath.to = Math.round(arg.dx + 5 * this.scale + 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.from = Math.round(arg.dx + 5 * this.scale - 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextTpElem.string = titleText;

	this.updateVmlShape(this.subTextPath);
	this.subTextFillElem.color = fontColor;
	this.subTextTpElem.style.fontSize = Math.round(15 * this.scale) + 'px';
	this.subTextPath.to = (Math.round(arg.dx + width * 0.5) + 1) + ' ' + Math.round(arg.dy + 40 * this.scale);
	this.subTextPath.from = (Math.round(arg.dx + width * 0.5) - 1) + ' ' + Math.round(arg.dy + 40 * this.scale);
	this.subTextPath.style.width = '1px';
	this.subTextPath.style.height = '1px';
	this.subTextTpElem.string = subText;

	this.updateVmlShape(this.button1TextPath);
	this.button1TextFillElem.color = fontColor;
	this.button1TextTpElem.style.fontSize = Math.round(15 * this.scale) + 'px';
	this.button1TextPath.to = (Math.round(arg.dx + width * 0.5 - 55 * this.scale) + 1) + ' ' + Math.round(arg.dy + height - 25 * this.scale);
	this.button1TextPath.from = (Math.round(arg.dx + width * 0.5 - 55 * this.scale) - 1) + ' ' + Math.round(arg.dy + height - 25 * this.scale);
	this.button1TextPath.style.width = '1px';
	this.button1TextPath.style.height = '1px';
	this.button1TextTpElem.string = buttonText[0];

	this.updateVmlShape(this.button2TextPath);
	this.button2TextFillElem.color = fontColor;
	this.button2TextTpElem.style.fontSize = Math.round(15 * this.scale) + 'px';
	this.button2TextPath.to = (Math.round(arg.dx + width * 0.5 + 55 * this.scale) + 1) + ' ' + Math.round(arg.dy + height - 25 * this.scale);
	this.button2TextPath.from = (Math.round(arg.dx + width * 0.5 + 55 * this.scale) - 1) + ' ' + Math.round(arg.dy + height - 25 * this.scale);
	this.button2TextPath.style.width = '1px';
	this.button2TextPath.style.height = '1px';
	this.button2TextTpElem.string = buttonText[1];

	this.updateRotation();
};

mxShapeMockupAlertBox.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var width = Math.max(arg.w, 230 * this.scale);
	var height = Math.max(arg.h, 120 * this.scale);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Alert Box Title').toString();
	var subText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SUB_TEXT, 'Description text').toString();
	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Yes,No').toString().split(',');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.topBar.setAttribute('d', this.createPath(arg, 'topBar'));
	this.buttons.setAttribute('d', this.createPath(arg, 'buttons'));

	this.innerNode.setAttribute('fill', fillColor);

	this.topBar.setAttribute('fill', frameColor);
	this.topBar.setAttribute('stroke', strokeColor);
	this.topBar.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.buttons.setAttribute('fill', fillColor);
	this.buttons.setAttribute('stroke', strokeColor);
	this.buttons.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.titleText.setAttribute('fill', fontColor);
	this.titleText.setAttribute('font-size', 18 * this.scale);
	this.titleText.setAttribute('text-anchor', 'start');
	this.titleText.setAttribute('x', this.bounds.x + 5 * this.scale);
	this.titleText.setAttribute('y', this.bounds.y + 16 * this.scale);

	if (this.titleTextNode !== null || typeof this.titleTextNode !== 'undefined')
	{
		this.titleText.removeChild(this.titleTextNode);
	}

	this.titleTextNode = document.createTextNode(titleText);
	this.titleText.appendChild(this.titleTextNode);

	this.subText.setAttribute('fill', fontColor);
	this.subText.setAttribute('font-size', 15 * this.scale);
	this.subText.setAttribute('text-anchor', 'middle');
	this.subText.setAttribute('x', this.bounds.x + width * 0.5);
	this.subText.setAttribute('y', this.bounds.y + 40 * this.scale);

	if (this.subTextNode !== null || typeof this.subTextNode !== 'undefined')
	{
		this.subText.removeChild(this.subTextNode);
	}

	this.subTextNode = document.createTextNode(subText);
	this.subText.appendChild(this.subTextNode);

	this.button1Text.setAttribute('fill', fontColor);
	this.button1Text.setAttribute('font-size', 15 * this.scale);
	this.button1Text.setAttribute('text-anchor', 'middle');
	this.button1Text.setAttribute('x', this.bounds.x + width * 0.5 - 60 * this.scale);
	this.button1Text.setAttribute('y', this.bounds.y + height - 22.5 * this.scale);

	if (this.statusTextNode !== null || typeof this.statusTextNode !== 'undefined')
	{
		this.button1Text.removeChild(this.button1TextNode);
	}

	this.button1TextNode = document.createTextNode(buttonText[0]);
	this.button1Text.appendChild(this.button1TextNode);

	this.button2Text.setAttribute('fill', fontColor);
	this.button2Text.setAttribute('font-size', 15 * this.scale);
	this.button2Text.setAttribute('text-anchor', 'middle');
	this.button2Text.setAttribute('x', this.bounds.x + width * 0.5 + 60 * this.scale);
	this.button2Text.setAttribute('y', this.bounds.y + height - 22.5 * this.scale);

	if (this.statusTextNode !== null || typeof this.statusTextNode !== 'undefined')
	{
		this.button2Text.removeChild(this.button2TextNode);
	}

	this.button2TextNode = document.createTextNode(buttonText[1]);
	this.button2Text.appendChild(this.button2TextNode);

	this.updateRotation();
};

mxShapeMockupAlertBox.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 230 * this.scale);
	var height = Math.max(h, 120 * this.scale);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
	else if (shape === 'buttons')
	{
		var middleX = width * 0.5;
		var buttonH = 35 * this.scale;
		var buttonW = 100 * this.scale;
		path.moveTo(dx + middleX - 5 * this.scale - buttonW, dy + height - 10 * this.scale - buttonH);
		path.lineTo(dx + middleX - 5 * this.scale, dy + height - 10 * this.scale - buttonH);
		path.lineTo(dx + middleX - 5 * this.scale, dy + height - 10 * this.scale);
		path.lineTo(dx + middleX - 5 * this.scale - buttonW, dy + height - 10 * this.scale);
		path.close();

		path.moveTo(dx + middleX + 5 * this.scale + buttonW, dy + height - 10 * this.scale - buttonH);
		path.lineTo(dx + middleX + 5 * this.scale, dy + height - 10 * this.scale - buttonH);
		path.lineTo(dx + middleX + 5 * this.scale, dy + height - 10 * this.scale);
		path.lineTo(dx + middleX + 5 * this.scale + buttonW, dy + height - 10 * this.scale);
		path.close();
	}
	else if (shape === 'topBar')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + 25 * this.scale);
		path.lineTo(dx, dy + 25 * this.scale);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Message Box
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupMessageBox.prototype = new mxShapeMockup();
mxShapeMockupMessageBox.prototype.constructor = mxShapeMockupMessageBox;

mxShapeMockupMessageBox.prototype.origWidth = 250;
mxShapeMockupMessageBox.prototype.origHeight = 120;
mxShapeMockupMessageBox.prototype.origAspect = mxShapeMockupMessageBox.prototype.origWidth / mxShapeMockupMessageBox.prototype.origHeight;

function mxShapeMockupMessageBox(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupMessageBox.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.topBar = document.createElement('v:shape');
	this.configureVmlShape(this.topBar);
	node.appendChild(this.topBar);

	this.buttons = document.createElement('v:shape');
	this.configureVmlShape(this.buttons);
	node.appendChild(this.buttons);

	this.titleTextPath = document.createElement('v:line');
	this.titleTextPath.style.position = 'absolute';
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextPath.to = '1 0';
	this.titleTextPath.from = '0 0';

	this.titleTextFillElem = document.createElement('v:fill');
	this.titleTextFillElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextFillElem);

	this.titleTextStrokeElem = document.createElement('v:stroke');
	this.titleTextStrokeElem.on = 'false';
	this.titleTextPath.appendChild(this.titleTextStrokeElem);

	this.titleTextPathElem = document.createElement('v:path');
	this.titleTextPathElem.textpathok = 'true';
	this.titleTextPath.appendChild(this.titleTextPathElem);

	this.titleTextTpElem = document.createElement('v:textpath');
	this.titleTextTpElem.style.cssText = 'v-text-align: left';
	this.titleTextTpElem.on = 'true';
	this.titleTextPath.appendChild(this.titleTextTpElem);

	node.appendChild(this.titleTextPath);

	this.subTextShape = document.createElement('v:shape');
	this.configureVmlShape(this.subTextShape);
	node.appendChild(this.subTextShape);

	this.subTextPath = document.createElement('v:line');
	this.subTextPath.style.position = 'absolute';
	this.subTextPath.style.width = '1px';
	this.subTextPath.style.height = '1px';
	this.subTextPath.to = '1 0';
	this.subTextPath.from = '0 0';

	this.subTextFillElem = document.createElement('v:fill');
	this.subTextFillElem.on = 'true';
	this.subTextPath.appendChild(this.subTextFillElem);

	this.subTextStrokeElem = document.createElement('v:stroke');
	this.subTextStrokeElem.on = 'false';
	this.subTextPath.appendChild(this.subTextStrokeElem);

	this.subTextPathElem = document.createElement('v:path');
	this.subTextPathElem.textpathok = 'true';
	this.subTextPath.appendChild(this.subTextPathElem);

	this.subTextTpElem = document.createElement('v:textpath');
	this.subTextTpElem.style.cssText = 'v-text-align: center';
	this.subTextTpElem.on = 'true';
	this.subTextPath.appendChild(this.subTextTpElem);

	node.appendChild(this.subTextPath);

	this.button1TextShape = document.createElement('v:shape');
	this.configureVmlShape(this.button1TextShape);
	node.appendChild(this.button1TextShape);

	this.button1TextPath = document.createElement('v:line');
	this.button1TextPath.style.position = 'absolute';
	this.button1TextPath.style.width = '1px';
	this.button1TextPath.style.height = '1px';
	this.button1TextPath.to = '1 0';
	this.button1TextPath.from = '0 0';

	this.button1TextFillElem = document.createElement('v:fill');
	this.button1TextFillElem.on = 'true';
	this.button1TextPath.appendChild(this.button1TextFillElem);

	this.button1TextStrokeElem = document.createElement('v:stroke');
	this.button1TextStrokeElem.on = 'false';
	this.button1TextPath.appendChild(this.button1TextStrokeElem);

	this.button1TextPathElem = document.createElement('v:path');
	this.button1TextPathElem.textpathok = 'true';
	this.button1TextPath.appendChild(this.button1TextPathElem);

	this.button1TextTpElem = document.createElement('v:textpath');
	this.button1TextTpElem.style.cssText = 'v-text-align: center';
	this.button1TextTpElem.on = 'true';
	this.button1TextPath.appendChild(this.button1TextTpElem);

	node.appendChild(this.button1TextPath);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;
	this.oldScale = 0;

	return node;
};

mxShapeMockupMessageBox.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.topBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.topBar);

	this.buttons = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttons);

	this.titleText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.titleText);
	this.titleTextNode = document.createTextNode(' ');
	this.titleText.appendChild(this.titleTextNode);

	this.subText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.subText);
	this.subTextNode = document.createTextNode(' ');
	this.subText.appendChild(this.subTextNode);

	this.button1Text = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.button1Text);
	this.button1TextNode = document.createTextNode(' ');
	this.button1Text.appendChild(this.button1TextNode);

	return this.g;
};

mxShapeMockupMessageBox.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var width = Math.max(arg.w, 150 * this.scale);
	var height = Math.max(arg.h, 120 * this.scale);

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.topBar);
	this.updateVmlShape(this.buttons);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Message Box Title').toString();
	var subText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SUB_TEXT, 'Description text').toString();
	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'OK').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();

	this.background.path = this.createPath(arg, 'background');
	this.topBar.path = this.createPath(arg, 'topBar');
	this.buttons.path = this.createPath(arg, 'buttons');

	this.topBar.fillcolor = frameColor;
	this.topBar.strokecolor = strokeColor;
	this.topBar.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.buttons.fillcolor = fillColor;
	this.buttons.strokecolor = strokeColor;
	this.buttons.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateVmlShape(this.titleTextPath);
	this.titleTextFillElem.color = fontColor;
	this.titleTextTpElem.style.fontSize = Math.round(18 * this.scale) + 'px';
	this.titleTextPath.to = Math.round(arg.dx + 5 * this.scale + 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.from = Math.round(arg.dx + 5 * this.scale - 1) + ' ' + Math.round(arg.dy + 13 * this.scale);
	this.titleTextPath.style.width = '1px';
	this.titleTextPath.style.height = '1px';
	this.titleTextTpElem.string = titleText;

	this.updateVmlShape(this.subTextPath);
	this.subTextFillElem.color = fontColor;
	this.subTextTpElem.style.fontSize = Math.round(15 * this.scale) + 'px';
	this.subTextPath.to = (Math.round(arg.dx + width * 0.5) + 1) + ' ' + Math.round(arg.dy + 40 * this.scale);
	this.subTextPath.from = (Math.round(arg.dx + width * 0.5) - 1) + ' ' + Math.round(arg.dy + 40 * this.scale);
	this.subTextPath.style.width = '1px';
	this.subTextPath.style.height = '1px';
	this.subTextTpElem.string = subText;

	this.updateVmlShape(this.button1TextPath);
	this.button1TextFillElem.color = fontColor;
	this.button1TextTpElem.style.fontSize = Math.round(15 * this.scale) + 'px';
	this.button1TextPath.to = (Math.round(arg.dx + width * 0.5) + 1) + ' ' + Math.round(arg.dy + height - 25 * this.scale);
	this.button1TextPath.from = (Math.round(arg.dx + width * 0.5) - 1) + ' ' + Math.round(arg.dy + height - 25 * this.scale);
	this.button1TextPath.style.width = '1px';
	this.button1TextPath.style.height = '1px';
	this.button1TextTpElem.string = buttonText;

	this.updateRotation();
};

mxShapeMockupMessageBox.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var width = Math.max(arg.w, 150 * this.scale);
	var height = Math.max(arg.h, 120 * this.scale);

	var titleText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TITLE_TEXT, 'Alert Box Title').toString();
	var subText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SUB_TEXT, 'Description text').toString();
	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Yes,No').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000').toString();
	var frameColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_COLOR, '#aaaaaa').toString();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000').toString();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.topBar.setAttribute('d', this.createPath(arg, 'topBar'));
	this.buttons.setAttribute('d', this.createPath(arg, 'buttons'));

	this.innerNode.setAttribute('fill', fillColor);

	this.topBar.setAttribute('fill', frameColor);
	this.topBar.setAttribute('stroke', strokeColor);
	this.topBar.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.buttons.setAttribute('fill', fillColor);
	this.buttons.setAttribute('stroke', strokeColor);
	this.buttons.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.titleText.setAttribute('fill', fontColor);
	this.titleText.setAttribute('font-size', 18 * this.scale);
	this.titleText.setAttribute('text-anchor', 'start');
	this.titleText.setAttribute('x', this.bounds.x + 5 * this.scale);
	this.titleText.setAttribute('y', this.bounds.y + 16 * this.scale);

	if (this.titleTextNode !== null || typeof this.titleTextNode !== 'undefined')
	{
		this.titleText.removeChild(this.titleTextNode);
	}

	this.titleTextNode = document.createTextNode(titleText);
	this.titleText.appendChild(this.titleTextNode);

	this.subText.setAttribute('fill', fontColor);
	this.subText.setAttribute('font-size', 15 * this.scale);
	this.subText.setAttribute('text-anchor', 'middle');
	this.subText.setAttribute('x', this.bounds.x + width * 0.5);
	this.subText.setAttribute('y', this.bounds.y + 40 * this.scale);

	if (this.subTextNode !== null || typeof this.subTextNode !== 'undefined')
	{
		this.subText.removeChild(this.subTextNode);
	}

	this.subTextNode = document.createTextNode(subText);
	this.subText.appendChild(this.subTextNode);

	this.button1Text.setAttribute('fill', fontColor);
	this.button1Text.setAttribute('font-size', 15 * this.scale);
	this.button1Text.setAttribute('text-anchor', 'middle');
	this.button1Text.setAttribute('x', this.bounds.x + width * 0.5);
	this.button1Text.setAttribute('y', this.bounds.y + height - 22.5 * this.scale);

	if (this.statusTextNode !== null || typeof this.statusTextNode !== 'undefined')
	{
		this.button1Text.removeChild(this.button1TextNode);
	}

	this.button1TextNode = document.createTextNode(buttonText);
	this.button1Text.appendChild(this.button1TextNode);

	this.updateRotation();
};

mxShapeMockupMessageBox.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 150 * this.scale);
	var height = Math.max(h, 120 * this.scale);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
	else if (shape === 'buttons')
	{
		var middleX = width * 0.5;
		var buttonH = 35 * this.scale;
		var buttonW = 100 * this.scale;
		path.moveTo(dx + middleX - buttonW * 0.5, dy + height - 10 * this.scale - buttonH);
		path.lineTo(dx + middleX + buttonW * 0.5, dy + height - 10 * this.scale - buttonH);
		path.lineTo(dx + middleX + buttonW * 0.5, dy + height - 10 * this.scale);
		path.lineTo(dx + middleX - buttonW * 0.5, dy + height - 10 * this.scale);
		path.close();

		//add a closing X here to spare one element
		path.moveTo(dx + width - 6 * this.scale, dy + 4 * this.scale);
		path.lineTo(dx + width - 20 * this.scale, dy + 16 * this.scale);
		path.moveTo(dx + width - 20 * this.scale, dy + 4 * this.scale);
		path.lineTo(dx + width - 6 * this.scale, dy + 16 * this.scale);
		path.close();

	}
	else if (shape === 'topBar')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + 25 * this.scale);
		path.lineTo(dx, dy + 25 * this.scale);
		path.close();
	}
};
