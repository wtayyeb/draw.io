
//**********************************************************************************************************************************************************
//Multiline button
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupMultilineButton.prototype = new mxShapeMockup();
mxShapeMockupMultilineButton.prototype.constructor = mxShapeMockupMultilineButton;

mxShapeMockupMultilineButton.prototype.origWidth = 150;
mxShapeMockupMultilineButton.prototype.origHeight = 50;
mxShapeMockupMultilineButton.prototype.origAspect = mxShapeMockupMultilineButton.prototype.origWidth / mxShapeMockupMultilineButton.prototype.origHeight;

mxShapeMockupMultilineButton.prototype.cst = {
		ROUND : 'round',
		CHEVRON : 'chevron'
};

function mxShapeMockupMultilineButton(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupMultilineButton.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.mainTextPath = document.createElement('v:line');
	this.mainTextPath.style.position = 'absolute';
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';
	this.mainTextPath.to = '1 0';
	this.mainTextPath.from = '0 0';

	this.mainTextFillElem = document.createElement('v:fill');
	this.mainTextFillElem.on = 'true';
	this.mainTextPath.appendChild(this.mainTextFillElem);

	this.mainTextStrokeElem = document.createElement('v:stroke');
	this.mainTextStrokeElem.on = 'false';
	this.mainTextPath.appendChild(this.mainTextStrokeElem);

	this.mainTextPathElem = document.createElement('v:path');
	this.mainTextPathElem.textpathok = 'true';
	this.mainTextPath.appendChild(this.mainTextPathElem);

	this.mainTextTpElem = document.createElement('v:textpath');
	this.mainTextTpElem.style.cssText = 'v-text-align: center';
	this.mainTextTpElem.on = 'true';
	this.mainTextPath.appendChild(this.mainTextTpElem);

	node.appendChild(this.mainTextPath);

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

mxShapeMockupMultilineButton.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	this.subText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.subText);
	this.subTextNode = document.createTextNode(' ');
	this.subText.appendChild(this.subTextNode);

	return this.g;
};

mxShapeMockupMultilineButton.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	arg.buttonStyle  = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_STYLE, mxShapeMockupMultilineButton.prototype.cst.ROUND);

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.mainTextPath);
	this.updateVmlShape(this.subTextPath);

	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Main text, Sub-text').toString().split(',');

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');

	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000, #0000FF').toString().split(',');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30, 20').toString().split(',');

	this.mainTextFillElem.color = fontColor[0];
	this.mainTextTpElem.style.fontSize = Math.round(fontSize[0] * this.scale) + 'px';
	this.mainTextPath.to = Math.round(arg.dx + arg.w * 0.5 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.4);
	this.mainTextPath.from = Math.round(arg.dx + arg.w * 0.5 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.4);
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';
	this.mainTextTpElem.string = buttonText[0];

	this.subTextFillElem.color = fontColor[1];
	this.subTextTpElem.style.fontSize = Math.round(fontSize[1] * this.scale) + 'px';
	this.subTextPath.to = Math.round(arg.dx + arg.w * 0.5 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.7);
	this.subTextPath.from = Math.round(arg.dx + arg.w * 0.5 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.7);
	this.subTextPath.style.width = '1px';
	this.subTextPath.style.height = '1px';
	this.subTextTpElem.string = buttonText[1];

	this.updateRotation();
};

mxShapeMockupMultilineButton.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	arg.buttonStyle  = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_STYLE, mxShapeMockupMultilineButton.prototype.cst.ROUND);

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));

	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Main text, Sub-text').toString().split(',');

	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000, #0000FF').toString().split(',');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30, 20').toString().split(',');

	this.mainText.setAttribute('fill', fontColor[0]);
	this.mainText.setAttribute('font-size', fontSize[0] * this.scale);
	this.mainText.setAttribute('text-anchor', 'middle');
	this.mainText.setAttribute('x', this.bounds.x + arg.w * 0.5);
	this.mainText.setAttribute('y', this.bounds.y + arg.h * 0.4);

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(buttonText[0]);
	this.mainText.appendChild(this.mainTextNode);

	this.subText.setAttribute('fill', fontColor[1]);
	this.subText.setAttribute('font-size', fontSize[1] * this.scale);
	this.subText.setAttribute('text-anchor', 'middle');
	this.subText.setAttribute('x', this.bounds.x + arg.w * 0.5);
	this.subText.setAttribute('y', this.bounds.y + arg.h * 0.7);


	if (this.subTextNode !== null || typeof this.subTextNode !== 'undefined')
	{
		this.subText.removeChild(this.subTextNode);
	}

	this.subTextNode = document.createTextNode(buttonText[1]);
	this.subText.appendChild(this.subTextNode);

	this.updateRotation();
};

mxShapeMockupMultilineButton.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 20 * this.scale);
	var height = Math.max(h, 20 * this.scale);

	if (shape === 'background')
	{
		if (arg.buttonStyle === mxShapeMockupMultilineButton.prototype.cst.ROUND)
		{
			path.moveTo(dx, dy + 10 * this.scale);
			path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
			path.lineTo(dx + width - 10 * this.scale, dy);
			path.arcTo(dx + width - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + width, dy + 10 * this.scale);
			path.lineTo(dx + width, dy + height - 10 * this.scale);
			path.arcTo(dx + width, dy + height - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + width - 10 * this.scale, dy + height);
			path.lineTo(dx + 10 * this.scale, dy + height);
			path.arcTo(dx + 10 * this.scale, dy + height, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + height - 10 * this.scale);
			path.close();
		}
		else if (arg.buttonStyle === mxShapeMockupMultilineButton.prototype.cst.CHEVRON)
		{
			path.moveTo(dx, dy + h * 0.1);
			path.arcTo(dx, dy + h * 0.1, w * 0.0372, h * 0.1111, 0, 0, 1, dx + w * 0.0334, dy);
			path.lineTo(dx + w * 0.768, dy);
			path.arcTo(dx + w * 0.768, dy, w * 0.0722, h * 0.216, 0, 0, 1, dx + w * 0.8014, dy + h * 0.0399);
			path.lineTo(dx + w * 0.99, dy + h * 0.4585);
			path.arcTo(dx + w * 0.99, dy + h * 0.4585, w * 0.09, h * 0.1, 0, 0, 1, dx + w * 0.99, dy + h * 0.5415);
			path.lineTo(dx + w * 0.8014, dy + h * 0.9568);
			path.arcTo(dx + w * 0.8014, dy + h * 0.9568, w * 0.0722, h * 0.216, 0, 0, 1, dx + w * 0.768, dy + h);
			path.lineTo(dx + w * 0.0334, dy + h);
			path.arcTo(dx + w * 0.0334, dy + h, w * 0.0372, h * 0.1111, 0, 0, 1, dx, dy + h * 0.9);
			path.close();
		}
	}
};


//**********************************************************************************************************************************************************
//Button
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupButton.prototype = new mxShapeMockup();
mxShapeMockupButton.prototype.constructor = mxShapeMockupButton;

mxShapeMockupButton.prototype.origWidth = 150;
mxShapeMockupButton.prototype.origHeight = 50;
mxShapeMockupButton.prototype.origAspect = mxShapeMockupButton.prototype.origWidth / mxShapeMockupButton.prototype.origHeight;

mxShapeMockupButton.prototype.cst = {
		ROUND : 'round',
		CHEVRON : 'chevron'
};

function mxShapeMockupButton(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupButton.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.mainTextShape = document.createElement('v:shape');
	this.configureVmlShape(this.mainTextShape);
	node.appendChild(this.mainTextShape);

	this.mainTextPath = document.createElement('v:line');
	this.mainTextPath.style.position = 'absolute';
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';
	this.mainTextPath.to = '1 0';
	this.mainTextPath.from = '0 0';

	this.mainTextFillElem = document.createElement('v:fill');
	this.mainTextFillElem.on = 'true';
	this.mainTextPath.appendChild(this.mainTextFillElem);

	this.mainTextStrokeElem = document.createElement('v:stroke');
	this.mainTextStrokeElem.on = 'false';
	this.mainTextPath.appendChild(this.mainTextStrokeElem);

	this.mainTextPathElem = document.createElement('v:path');
	this.mainTextPathElem.textpathok = 'true';
	this.mainTextPath.appendChild(this.mainTextPathElem);

	this.mainTextTpElem = document.createElement('v:textpath');
	this.mainTextTpElem.style.cssText = 'v-text-align: center';
	this.mainTextTpElem.on = 'true';
	this.mainTextPath.appendChild(this.mainTextTpElem);

	node.appendChild(this.mainTextPath);

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

mxShapeMockupButton.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupButton.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	arg.buttonStyle  = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_STYLE, mxShapeMockupButton.prototype.cst.ROUND);

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.mainTextPath);

	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Main text');

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');

	var fontColor = mxUtils.getValue(this.style, mxConstants.FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.FONTSIZE, '30');

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';
	this.mainTextPath.to = Math.round(arg.dx + arg.w * 0.5 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.5);
	this.mainTextPath.from = Math.round(arg.dx + arg.w * 0.5 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.5);
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';
	this.mainTextTpElem.string = buttonText;

	this.updateRotation();
};

mxShapeMockupButton.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	arg.buttonStyle  = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_STYLE, mxShapeMockupButton.prototype.cst.ROUND);

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));

	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, 'Main text');

	var fontColor = mxUtils.getValue(this.style, mxConstants.FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.FONTSIZE, '30');

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);
	this.mainText.setAttribute('text-anchor', 'middle');
	this.mainText.setAttribute('x', this.bounds.x + arg.w * 0.5);
	this.mainText.setAttribute('y', this.bounds.y + arg.h * 0.5 + fontSize * 0.25 * this.scale);

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(buttonText);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupButton.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 20 * this.scale);
	var height = Math.max(h, 20 * this.scale);

	if (shape === 'background')
	{
		if (arg.buttonStyle === mxShapeMockupButton.prototype.cst.ROUND)
		{
			path.moveTo(dx, dy + 10 * this.scale);
			path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
			path.lineTo(dx + width - 10 * this.scale, dy);
			path.arcTo(dx + width - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + width, dy + 10 * this.scale);
			path.lineTo(dx + width, dy + height - 10 * this.scale);
			path.arcTo(dx + width, dy + height - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + width - 10 * this.scale, dy + height);
			path.lineTo(dx + 10 * this.scale, dy + height);
			path.arcTo(dx + 10 * this.scale, dy + height, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + height - 10 * this.scale);
			path.close();
		}
		else if (arg.buttonStyle === mxShapeMockupButton.prototype.cst.CHEVRON)
		{
			path.moveTo(dx, dy + h * 0.1);
			path.arcTo(dx, dy + h * 0.1, w * 0.0372, h * 0.1111, 0, 0, 1, dx + w * 0.0334, dy);
			path.lineTo(dx + w * 0.768, dy);
			path.arcTo(dx + w * 0.768, dy, w * 0.0722, h * 0.216, 0, 0, 1, dx + w * 0.8014, dy + h * 0.0399);
			path.lineTo(dx + w * 0.99, dy + h * 0.4585);
			path.arcTo(dx + w * 0.99, dy + h * 0.4585, w * 0.09, h * 0.1, 0, 0, 1, dx + w * 0.99, dy + h * 0.5415);
			path.lineTo(dx + w * 0.8014, dy + h * 0.9568);
			path.arcTo(dx + w * 0.8014, dy + h * 0.9568, w * 0.0722, h * 0.216, 0, 0, 1, dx + w * 0.768, dy + h);
			path.lineTo(dx + w * 0.0334, dy + h);
			path.arcTo(dx + w * 0.0334, dy + h, w * 0.0372, h * 0.1111, 0, 0, 1, dx, dy + h * 0.9);
			path.close();
		}
	}
};

//**********************************************************************************************************************************************************
//Horizontal Button Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorButtonBar.prototype = new mxShapeMockup();
mxShapeMockupHorButtonBar.prototype.constructor = mxShapeMockupHorButtonBar;

mxShapeMockupHorButtonBar.prototype.origWidth = 250;
mxShapeMockupHorButtonBar.prototype.origHeight = 50;
mxShapeMockupHorButtonBar.prototype.origAspect = mxShapeMockupHorButtonBar.prototype.origWidth / mxShapeMockupHorButtonBar.prototype.origHeight;

function mxShapeMockupHorButtonBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupHorButtonBar.prototype.createVml = function()
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

mxShapeMockupHorButtonBar.prototype.createSvg = function()
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

mxShapeMockupHorButtonBar.prototype.redrawVml = function()
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
	var buttonTotalWidth = 0;

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

		buttonTotalWidth += this.buttonWidths[i];

		if(button[i].charAt(0) === '+')
		{
			selectedButton = i;
		}
	}

	var labelOffset = 15 * this.scale;
	var currOffset = 0;
	arg.labelOffset = labelOffset;

	arg.startingOffset = currOffset;
	arg.buttonTotalWidth = buttonTotalWidth;
	arg.minHeight = Math.round(Math.max(arg.h, fontSize * 1.5 * this.scale, 20 * this.scale));

	this.minWidth = 2 * arg.labelOffset * this.buttonNum + buttonTotalWidth;
	this.background.path = this.createPath(arg, 'background');
	this.button.path = this.createPath(arg, 'buttonSeparator');
	this.button.filled = 'false';
	this.button.fillcolor = 'none';
	this.button.strokecolor = strokeColor;
	this.button.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';


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

	var totalWidth = Math.max(this.minWidth , this.bounds.width);

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);
		currOffset = 0;

		for (var j = 0; j < i; j++)
		{
			currOffset += this.buttonWidths[j] + 2 * labelOffset;  
		}

		currOffset += labelOffset + this.buttonWidths[i] / 2;
		currOffset = currOffset * totalWidth / this.minWidth;
		this.fillElem[i].color = textColor;
		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		this.currentPath[i].to = (currOffset + 1) + ' ' + Math.round(arg.minHeight * 0.5);
		this.currentPath[i].from = (currOffset) + ' ' + Math.round(arg.minHeight * 0.5);

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

mxShapeMockupHorButtonBar.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

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
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, '0'));

	var selectedButton = -1;
	var buttonTotalWidth = 0;

	for (var i = 0; i < this.buttonNum; i++)
	{
		if ((fontStyle & 4) === 4)
		{
			this.buttonText[i].setAttribute('text-decoration', 'underline');
		}
		else
		{
			this.buttonText[i].removeAttribute('text-decoration');
		}

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

		buttonTotalWidth += this.buttonWidths[i];
	}

	var labelOffset = 15 * this.scale;
	arg.labelOffset = labelOffset;
	arg.buttonTotalWidth = buttonTotalWidth;
	arg.minHeight = Math.round(Math.max(arg.h, fontSize * 1.5 * this.scale, 20 * this.scale));

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.button.setAttribute('d', this.createPath(arg, 'buttonSeparator'));
	this.button.setAttribute('fill', fillColor);
	this.button.setAttribute('stroke', strokeColor);
	this.button.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.minWidth = 2 * labelOffset * this.buttonNum + buttonTotalWidth;

	if (selectedButton !== -1)
	{
		if (typeof this.selectedButton === 'undefined' || this.selectedButton === null)
		{
			this.selectedButton = document.createElementNS(mxConstants.NS_SVG, 'path');
			this.g.insertBefore(this.selectedButton,this.buttonText[0]);
		}

		arg.selectedButton = selectedButton;
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
	var totalWidth = Math.max(this.minWidth , arg.w);

	for (var i = 0; i < this.buttonNum; i++)
	{
		var currWidth = 0;

		for (var j = 0; j < i; j++)
		{
			currWidth += this.buttonWidths[j] + 2 * arg.labelOffset;
		}

		currWidth += this.buttonWidths[i]/2 + arg.labelOffset;
		currWidth = currWidth * totalWidth / this.minWidth;

		this.buttonText[i].setAttribute('fill', textColor);
		this.buttonText[i].setAttribute('font-size', fontSize * this.scale);
		this.buttonText[i].setAttribute('text-anchor', 'middle');
		this.buttonText[i].setAttribute('x', this.bounds.x + currWidth);
		this.buttonText[i].setAttribute('y', this.bounds.y + arg.minHeight * 0.5 + fontSize * 0.25 * this.scale);

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

mxShapeMockupHorButtonBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var dx = arg.dx;
	var dy = arg.dy;
	var minWidth = arg.buttonTotalWidth + (2 * arg.labelOffset * this.buttonNum);
	var totalWidth = Math.max(minWidth , w);

	if (shape === 'background')
	{
		path.moveTo(dx, dy + 10 * this.scale);
		path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
		path.lineTo(dx + totalWidth - 10 * this.scale, dy);
		path.arcTo(dx + totalWidth - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + totalWidth, dy + 10 * this.scale);
		path.lineTo(dx + totalWidth, dy + arg.minHeight - 10 * this.scale);
		path.arcTo(dx + totalWidth, dy + arg.minHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + totalWidth - 10 * this.scale, dy + arg.minHeight);
		path.lineTo(dx + 10 * this.scale, dy + arg.minHeight);
		path.arcTo(dx + 10 * this.scale, dy + arg.minHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + arg.minHeight - 10 * this.scale);
		path.close();
	}
	else if (shape === 'buttonSeparator')
	{
		for (var i = 1; i < this.buttonNum ; i++)
		{
			var currWidth = 0;

			for (var j = 0; j < i; j++)
			{
				currWidth += this.buttonWidths[j] + 2 * arg.labelOffset;
			}

			currWidth = currWidth * totalWidth / minWidth;

			path.moveTo(dx + currWidth, dy);
			path.lineTo(dx + currWidth, dy + arg.minHeight);
		}
	}
	else if (shape === 'selectedButton')
	{
		var buttonLeft = 0;

		for (var i = 0; i < arg.selectedButton; i++)
		{
			buttonLeft += this.buttonWidths[i] + 2 * arg.labelOffset;
		}

		buttonLeft = buttonLeft * totalWidth / minWidth;
		var buttonRight = (this.buttonWidths[arg.selectedButton] + 2 * arg.labelOffset) * totalWidth / minWidth;
		buttonRight += buttonLeft;
		if (arg.selectedButton === 0)
		{
			// we draw a path for the first button
			path.moveTo(dx, dy + 10 * this.scale);
			path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
			path.lineTo(dx + buttonRight, dy);
			path.lineTo(dx + buttonRight, dy + arg.minHeight);
			path.lineTo(dx + 10 * this.scale, dy + arg.minHeight);
			path.arcTo(dx + 10 * this.scale, dy + arg.minHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + height - 10 * this.scale);
			path.close();
		}
		else if (arg.selectedButton === this.buttonNum - 1)
		{
			// we draw a path for the last button
			path.moveTo(dx + buttonLeft, dy);
			path.lineTo(dx + buttonRight - 10 * this.scale, dy);
			path.arcTo(dx + buttonRight - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + buttonRight, dy + 10 * this.scale);
			path.lineTo(dx + buttonRight, dy + arg.minHeight - 10 * this.scale);
			path.arcTo(dx + buttonRight, dy + arg.minHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + buttonRight - 10 * this.scale, dy + arg.minHeight);
			path.lineTo(dx + buttonLeft, dy + arg.minHeight);
			path.close();
		}
		else
		{
			// we draw a path rectangle for one of the buttons in the middle
			path.moveTo(dx + buttonLeft, dy);
			path.lineTo(dx + buttonRight, dy);
			path.lineTo(dx + buttonRight, dy + arg.minHeight);
			path.lineTo(dx + buttonLeft, dy + arg.minHeight);
			path.close();
		}
	}
};

//**********************************************************************************************************************************************************
//Vertical Button Bar
//**********************************************************************************************************************************************************
/**
 * Extends Horizontal Button Bar.
 */
mxShapeMockupVerButtonBar.prototype = new mxShapeMockupHorButtonBar();
mxShapeMockupVerButtonBar.prototype.constructor = mxShapeMockupVerButtonBar;

mxShapeMockupVerButtonBar.prototype.origWidth = 100;
mxShapeMockupVerButtonBar.prototype.origHeight = 150;
mxShapeMockupVerButtonBar.prototype.origAspect = mxShapeMockupVerButtonBar.prototype.origWidth / mxShapeMockupVerButtonBar.prototype.origHeight;

function mxShapeMockupVerButtonBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerButtonBar.prototype.redrawVml = function()
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
	this.button.path = this.createPath(arg, 'buttonSeparator');
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

	var totalWidth = Math.max(this.minWidth , arg.w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, arg.h);
	var minHeight = this.buttonNum * arg.buttonHeight;

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);
		this.fillElem[i].color = textColor;
		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		var currX = Math.round((this.greatestWidth / 2  + labelOffset) * totalWidth / this.minWidth);
		var currY = Math.round(arg.buttonHeight * (i + 0.5) * totalHeight / minHeight);
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

mxShapeMockupVerButtonBar.prototype.redrawSvg = function()
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
	this.button.setAttribute('d', this.createPath(arg, 'buttonSeparator'));
	this.button.setAttribute('fill', fillColor);
	this.button.setAttribute('stroke', strokeColor);
	this.button.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.minWidth = 2 * labelOffset + this.greatestWidth;

	if (selectedButton !== -1)
	{
		if (typeof this.selectedButton === 'undefined' || this.selectedButton === null)
		{
			this.selectedButton = document.createElementNS(mxConstants.NS_SVG, 'path');
			this.g.insertBefore(this.selectedButton,this.buttonText[0]);
		}

		arg.selectedButton = selectedButton;
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

	var totalWidth = Math.max(this.minWidth , arg.w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, arg.h);
	var minHeight = this.buttonNum * arg.buttonHeight;

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.buttonText[i].setAttribute('fill', textColor);
		this.buttonText[i].setAttribute('font-size', fontSize * this.scale);
		this.buttonText[i].setAttribute('text-anchor', 'middle');
		this.buttonText[i].setAttribute('x', this.bounds.x + (this.greatestWidth / 2  + labelOffset) * totalWidth / this.minWidth);
		this.buttonText[i].setAttribute('y', this.bounds.y + arg.buttonHeight * (i + 0.5) * totalHeight / minHeight + fontSize * 0.25 * this.scale);

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

mxShapeMockupVerButtonBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var minWidth = this.greatestWidth + 2 * arg.labelOffset;
	var totalWidth = Math.max(minWidth, w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, h);
	var minHeight = this.buttonNum * arg.buttonHeight;

	if (shape === 'background')
	{
		path.moveTo(dx, dy + 10 * this.scale);
		path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
		path.lineTo(dx + totalWidth - 10 * this.scale, dy);
		path.arcTo(dx + totalWidth - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + totalWidth, dy + 10 * this.scale);
		path.lineTo(dx + totalWidth, dy + totalHeight - 10 * this.scale);
		path.arcTo(dx + totalWidth, dy + totalHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + totalWidth - 10 * this.scale, dy + totalHeight);
		path.lineTo(dx + 10 * this.scale, dy + totalHeight);
		path.arcTo(dx + 10 * this.scale, dy + totalHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + totalHeight - 10 * this.scale);
		path.close();
	}
	else if (shape === 'buttonSeparator')
	{
		for (var i = 1; i < this.buttonNum ; i++)
		{
			var currHeight = 0;

			currHeight = (arg.buttonHeight * i) * totalHeight / minHeight;

			path.moveTo(dx, dy + currHeight);
			path.lineTo(dx + totalWidth, dy + currHeight);
		}
	}
	else if (shape === 'selectedButton')
	{
		if (arg.selectedButton === 0)
		{
			// we draw a path for the first button
			var buttonBottom = arg.buttonHeight * totalHeight / minHeight;
			path.moveTo(dx, dy + 10 * this.scale);
			path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
			path.lineTo(dx + totalWidth - 10 * this.scale, dy);
			path.arcTo(dx + totalWidth - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + totalWidth, dy + 10 * this.scale);
			path.lineTo(dx + totalWidth, dy + buttonBottom);
			path.lineTo(dx, dy + buttonBottom);
			path.close();
		}
		else if (arg.selectedButton === this.buttonNum - 1)
		{
			// we draw a path for the last button
			var buttonTop = totalHeight - arg.buttonHeight * totalHeight / minHeight;
			path.moveTo(dx, dy + buttonTop);
			path.lineTo(dx + totalWidth, dy + buttonTop);
			path.lineTo(dx + totalWidth, dy + totalHeight - 10 * this.scale);
			path.arcTo(dx + totalWidth, dy + totalHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + totalWidth - 10 * this.scale, dy + totalHeight);
			path.lineTo(dx + 10 * this.scale, dy + totalHeight);
			path.arcTo(dx + 10 * this.scale, dy + totalHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + totalHeight - 10 * this.scale);
			path.close();
		}
		else
		{
			// we draw a path rectangle for one of the buttons in the middle
			var buttonTop = arg.buttonHeight * arg.selectedButton * totalHeight / minHeight;
			var buttonBottom = arg.buttonHeight * (arg.selectedButton + 1) * totalHeight / minHeight;
			path.moveTo(dx, dy + buttonTop);
			path.lineTo(dx + totalWidth, dy + buttonTop);
			path.lineTo(dx + totalWidth, dy + buttonBottom);
			path.lineTo(dx, dy + buttonBottom);
			path.close();
		}
	}
};


//**********************************************************************************************************************************************************
//On-Off Button
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/

mxShapeMockupOnOffButton.prototype = new mxShapeMockup();
mxShapeMockupOnOffButton.prototype.constructor = mxShapeMockupOnOffButton;

mxShapeMockupOnOffButton.prototype.origWidth = 150;
mxShapeMockupOnOffButton.prototype.origHeight = 30;
mxShapeMockupOnOffButton.prototype.origAspect = mxShapeMockupOnOffButton.prototype.origWidth / mxShapeMockupOnOffButton.prototype.origHeight;

mxShapeMockupOnOffButton.prototype.cst = {
		ON : 'on',
		OFF : 'off'
};

function mxShapeMockupOnOffButton(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupOnOffButton.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.buttonForeground = document.createElement('v:shape');
	this.configureVmlShape(this.buttonForeground);
	node.appendChild(this.buttonForeground);

	this.currentPath = document.createElement('v:line');
	this.currentPath.style.position = 'absolute';
	this.currentPath.style.width = '1px';
	this.currentPath.style.height = '1px';
	this.currentPath.to = '1 0';
	this.currentPath.from = '0 0';

	this.fillElem = document.createElement('v:fill');
	this.fillElem.on = 'true';
	this.currentPath.appendChild(this.fillElem);

	this.strokeElem = document.createElement('v:stroke');
	this.strokeElem.on = 'false';
	this.currentPath.appendChild(this.strokeElem);

	this.pathElem = document.createElement('v:path');
	this.pathElem.textpathok = 'true';
	this.currentPath.appendChild(this.pathElem);

	this.tpElem = document.createElement('v:textpath');
	this.tpElem.style.cssText = 'v-text-align: center';
	this.tpElem.on = 'true';
	this.currentPath.appendChild(this.tpElem);

	node.appendChild(this.currentPath);

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

mxShapeMockupOnOffButton.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.buttonForeground = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttonForeground);

	this.buttonText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.buttonText);

	return this.g;
};

mxShapeMockupOnOffButton.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.buttonForeground);
	this.updateVmlShape(this.currentPath);

	this.shadowNode = null;

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var buttonState = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_STATE, mxShapeMockupOnOffButton.prototype.cst.ON).toLowerCase();
	var onColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.ON_COLOR, '#00ff00');
	var offColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.OFF_COLOR, '#ff0000');
	var onText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.ON_TEXT, 'ON');
	var offText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.OFF_TEXT, 'OFF');

	var minHeight = Math.round(Math.max(arg.h, fontSize * 1.5 * this.scale, 20 * this.scale));
	var minWidth = 20 * this.scale;

	arg.currHeight = Math.round(Math.max(arg.h, minHeight));
	arg.currWidth = Math.round(Math.max(arg.w, minWidth));
	arg.buttonState = buttonState;

	this.background.path = this.createPath(arg, 'background');
	this.buttonForeground.path = this.createPath(arg, 'buttonForeground');

	this.buttonForeground.strokecolor = strokeColor;
	this.buttonForeground.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	var textPos = 0;
	if (buttonState === 'on')
	{
		this.buttonForeground.fillcolor = onColor;
		textPos = Math.round(arg.currWidth * 0.4);
		this.tpElem.string = onText;
	}
	else
	{
		this.buttonForeground.fillcolor = offColor;
		textPos = Math.round(arg.currWidth * 0.6);
		this.tpElem.string = offText;
	}

	this.fillElem.color = textColor;
	this.tpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';

	this.currentPath.to = (textPos + 1) + ' ' + Math.round(arg.currHeight * 0.5);
	this.currentPath.from = (textPos) + ' ' + Math.round(arg.currHeight * 0.5);

	this.currentPath.style.width = '1px';
	this.currentPath.style.height = '1px';

	this.updateRotation();
};

mxShapeMockupOnOffButton.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var buttonState = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_STATE, mxShapeMockupOnOffButton.prototype.cst.ON).toLowerCase();
	var onColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.ON_COLOR, '#00ff00');
	var offColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.OFF_COLOR, '#ff0000');
	var onText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.ON_TEXT, 'ON');
	var offText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.OFF_TEXT, 'OFF');

	var minHeight = Math.round(Math.max(arg.h, fontSize * 1.5 * this.scale, 20 * this.scale));
	var minWidth = 20 * this.scale;

	arg.currHeight = Math.round(Math.max(arg.h, minHeight));
	arg.currWidth = Math.round(Math.max(arg.w, minWidth));
	arg.buttonState = buttonState;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.buttonForeground.setAttribute('d', this.createPath(arg, 'buttonForeground'));
	this.buttonForeground.setAttribute('stroke', strokeColor);
	this.buttonForeground.setAttribute('stroke-width', this.strokewidth * this.scale);

	var textPos = 0;
	var buttonString = '';
	if (buttonState === 'on')
	{
		this.buttonForeground.setAttribute('fill', onColor);
		buttonString = onText;
		textPos = arg.currWidth * 0.4;
	}
	else
	{
		this.buttonForeground.setAttribute('fill', offColor);
		buttonString = offText;
		textPos = arg.currWidth * 0.6;
	}

	this.buttonText.setAttribute('fill', textColor);
	this.buttonText.setAttribute('font-size', fontSize * this.scale);
	this.buttonText.setAttribute('text-anchor', 'middle');
	this.buttonText.setAttribute('x', this.bounds.x + textPos);
	this.buttonText.setAttribute('y', this.bounds.y + arg.currHeight * 0.5 + fontSize * 0.25 * this.scale);

	if (typeof this.buttonTextNode !== 'undefined' && this.buttonTextNode !== 'null')
	{
		this.buttonText.removeChild(this.buttonTextNode);
	}

	this.buttonTextNode = document.createTextNode(buttonString);
	this.buttonText.appendChild(this.buttonTextNode);

	this.updateRotation();
};

mxShapeMockupOnOffButton.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		path.moveTo(dx, dy + 10 * this.scale);
		path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
		path.lineTo(dx + arg.currWidth - 10 * this.scale, dy);
		path.arcTo(dx + arg.currWidth - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth, dy + 10 * this.scale);
		path.lineTo(dx + arg.currWidth, dy + arg.currHeight - 10 * this.scale);
		path.arcTo(dx + arg.currWidth, dy + arg.currHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth - 10 * this.scale, dy + arg.currHeight);
		path.lineTo(dx + 10 * this.scale, dy + arg.currHeight);
		path.arcTo(dx + 10 * this.scale, dy + arg.currHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + arg.currHeight - 10 * this.scale);
		path.close();
	}
	else if (shape === 'buttonForeground')
	{
		if (arg.buttonState === mxShapeMockupOnOffButton.prototype.cst.ON)
		{
			path.moveTo(dx, dy + 10 * this.scale);
			path.arcTo(dx, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + 10 * this.scale, dy);
			path.lineTo(dx + arg.currWidth * 0.8 - 10 * this.scale, dy);
			path.arcTo(dx + arg.currWidth * 0.8 - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth * 0.8, dy + 10 * this.scale);
			path.lineTo(dx + arg.currWidth * 0.8, dy + arg.currHeight - 10 * this.scale);
			path.arcTo(dx + arg.currWidth * 0.8, dy + arg.currHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth * 0.8 - 10 * this.scale, dy + arg.currHeight);
			path.lineTo(dx + 10 * this.scale, dy + arg.currHeight);
			path.arcTo(dx + 10 * this.scale, dy + arg.currHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx, dy + arg.currHeight - 10 * this.scale);
			path.close();
		}
		else if (arg.buttonState === mxShapeMockupOnOffButton.prototype.cst.OFF)
		{
			path.moveTo(dx + arg.currWidth * 0.2, dy + 10 * this.scale);
			path.arcTo(dx + arg.currWidth * 0.2, dy + 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth * 0.2 + 10 * this.scale, dy);
			path.lineTo(dx + arg.currWidth - 10 * this.scale, dy);
			path.arcTo(dx + arg.currWidth - 10 * this.scale, dy, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth, dy + 10 * this.scale);
			path.lineTo(dx + arg.currWidth, dy + arg.currHeight - 10 * this.scale);
			path.arcTo(dx + arg.currWidth, dy + arg.currHeight - 10 * this.scale, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth - 10 * this.scale, dy + arg.currHeight);
			path.lineTo(dx + arg.currWidth * 0.2 + 10 * this.scale, dy + arg.currHeight);
			path.arcTo(dx + arg.currWidth * 0.2 + 10 * this.scale, dy + arg.currHeight, 10 * this.scale, 10 * this.scale, 0, 0, 1, dx + arg.currWidth * 0.2, dy + arg.currHeight - 10 * this.scale);
			path.close();
		}
	}
};

