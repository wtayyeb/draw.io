//**********************************************************************************************************************************************************
//Link
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupLink.prototype = new mxShapeMockup();
mxShapeMockupLink.prototype.constructor = mxShapeMockupLink;

mxShapeMockupLink.prototype.origWidth = 150;
mxShapeMockupLink.prototype.origHeight = 30;
mxShapeMockupLink.prototype.origAspect = mxShapeMockupLink.prototype.origWidth / mxShapeMockupLink.prototype.origHeight;

function mxShapeMockupLink(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupLink.prototype.createVml = function()
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
	this.mainTextTpElem.style.cssText = 'v-text-align: left';
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

mxShapeMockupLink.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupLink.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var pwString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.PW_STRING, 'Main text');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.mainTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';

	this.mainTextTpElem.style.textDecoration = 'underline';

	var yPos = Math.round(Math.max(arg.dy + arg.h * 0.5, fontSize * 0.75 * this.scale));
	var xPos = Math.round(arg.dx + 10 * this.scale);
	this.mainTextPath.to = (xPos + 1) + ' ' + yPos;
	this.mainTextPath.from = xPos + ' ' + yPos;
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';

	this.mainTextTpElem.string = pwString;

	this.updateRotation();
};

mxShapeMockupLink.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var pwString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.PW_STRING, 'Main text');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, '0'));

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);

	//TODO
//	if ((fontStyle & 4) === 1)
//	{
//	this.mainText.setAttribute('text-decoration', 'underline');
//	}
//	else
//	{
//	this.mainText.removeAttribute('text-decoration');
//	}

	if ((fontStyle & 4) === 2)
	{
		this.mainText.setAttribute('text-decoration', 'underline');
	}
	else
	{
		this.mainText.removeAttribute('text-decoration');
	}

	//TODO
//	if ((fontStyle & 4) === 3)
//	{
//	this.mainText.setAttribute('text-decoration', 'underline');
//	}
//	else
//	{
//	this.mainText.removeAttribute('text-decoration');
//	}
	if ((fontStyle & 4) === 4)
	{
		this.mainText.setAttribute('text-decoration', 'underline');
	}
	else
	{
		this.mainText.removeAttribute('text-decoration');
	}

	this.mainText.setAttribute('text-anchor', 'start');
	this.mainText.setAttribute('x', this.bounds.x + 10 * this.scale);
	this.mainText.setAttribute('y', Math.max(this.bounds.y + arg.h * 0.5 + fontSize * 0.5 * this.scale, fontSize * 1.25 * this.scale));

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(pwString);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupLink.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var width = Math.max(w, 20 * this.scale);
	var height = Math.max(h, 20 * this.scale);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Link Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupLinkBar.prototype = new mxShapeMockupHorButtonBar();
mxShapeMockupLinkBar.prototype.constructor = mxShapeMockupLinkBar;

mxShapeMockupLinkBar.prototype.origWidth = 250;
mxShapeMockupLinkBar.prototype.origHeight = 50;
mxShapeMockupLinkBar.prototype.origAspect = mxShapeMockupLinkBar.prototype.origWidth / mxShapeMockupLinkBar.prototype.origHeight;

function mxShapeMockupLinkBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupLinkBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var dx = arg.dx;
	var dy = arg.dy;
	var minWidth = arg.buttonTotalWidth + (2 * arg.labelOffset * this.buttonNum);
	var totalWidth = Math.max(minWidth , w);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + totalWidth, dy);
		path.lineTo(dx + totalWidth, dy + arg.minHeight);
		path.lineTo(dx, dy + arg.minHeight);
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
//Callout
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupCallout.prototype = new mxShapeMockup();
mxShapeMockupCallout.prototype.constructor = mxShapeMockupCallout;

mxShapeMockupCallout.prototype.origWidth = 150;
mxShapeMockupCallout.prototype.origHeight = 30;
mxShapeMockupCallout.prototype.origAspect = mxShapeMockupCallout.prototype.origWidth / mxShapeMockupCallout.prototype.origHeight;

mxShapeMockupCallout.prototype.cst = {
		LINE : 'line',
		RECT : 'rect',
		ROUND_RECT : 'roundrect'
};

function mxShapeMockupCallout(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupCallout.prototype.createVml = function()
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
	this.mainTextTpElem.style.cssText = 'v-text-align: left';
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

mxShapeMockupCallout.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupCallout.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '');
	var calloutStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.CALLOUT_STYLE, mxShapeMockupCallout.prototype.cst.RECT);
	var calloutText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.CALLOUT_TEXT, '');

	arg.calloutStyle = calloutStyle;

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.mainTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	if (calloutStyle === 'line')
	{
		this.background.filled = false;
	}
	else
	{
		this.background.filled = true;
	}

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';

	var yPos = Math.round(Math.max(arg.dy + arg.h * 0.5, fontSize * 0.75 * this.scale));
	var xPos = Math.round(arg.dx + 10 * this.scale);
	this.mainTextPath.to = (xPos + 1) + ' ' + yPos;
	this.mainTextPath.from = xPos + ' ' + yPos;
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';

	this.mainTextTpElem.string = calloutText;

	this.updateRotation();
};

mxShapeMockupCallout.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, '0'));
	var calloutStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.CALLOUT_STYLE, mxShapeMockupCallout.prototype.cst.RECT);
	var calloutText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.CALLOUT_TEXT, '');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#FFFFFF');

	arg.calloutStyle = calloutStyle;

	if (calloutStyle === mxShapeMockupCallout.prototype.cst.LINE)
	{
		this.innerNode.setAttribute('fill', 'none');
	}
	else
	{
		this.innerNode.setAttribute('fill', fillColor);
	}

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);

	if ((fontStyle & 4) === 4)
	{
		this.mainText.setAttribute('text-decoration', 'underline');
	}
	else
	{
		this.mainText.removeAttribute('text-decoration');
	}

	this.mainText.setAttribute('text-anchor', 'start');
	this.mainText.setAttribute('x', this.bounds.x + 10 * this.scale);
	this.mainText.setAttribute('y', Math.max(this.bounds.y + arg.h * 0.5 + fontSize * 0.5 * this.scale, fontSize * 1.25 * this.scale));

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(calloutText);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupCallout.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;

	// temporary solution for entpoint of callout tip
	var externalX = - 50 * this.scale;
	var externalY = 50 * this.scale + h;

	var connectX = 25 * this.scale;
	var connectY = h;

	if (shape === 'background')
	{
		if (arg.calloutStyle === mxShapeMockupCallout.prototype.cst.LINE )
		{
			path.moveTo(dx + externalX, dy + externalY);
			path.lineTo(dx, dy + h);
			path.lineTo(dx + w, dy + h);
		}
		else if (arg.calloutStyle === mxShapeMockupCallout.prototype.cst.RECT )
		{
			path.moveTo(dx + w, dy + h);
			path.lineTo(dx + w, dy);
			path.lineTo(dx, dy);
			path.lineTo(dx, dy + h);
			path.lineTo(dx + connectX - 10 * this.scale, dy + connectY);
			path.lineTo(dx + externalX, dy + externalY);
			path.lineTo(dx + connectX + 10 * this.scale, dy + connectY);
			path.close();
		}
		else if (arg.calloutStyle === mxShapeMockupCallout.prototype.cst.ROUND_RECT )
		{
			var r = 10 * this.scale;

			path.moveTo(dx + w - r, dy + h);
			path.arcTo(dx + w - r, dy + h, r, r, 0, 0, 0, dx + w, dy + h - r);
			path.lineTo(dx + w, dy + r);
			path.arcTo(dx + w, dy + r, r, r, 0, 0, 0, dx + w - r, dy);
			path.lineTo(dx + r, dy);
			path.arcTo(dx + r, dy, r, r, 0, 0, 0, dx, dy + r);
			path.lineTo(dx, dy + h - r);
			path.arcTo(dx, dy + h - r, r, r, 0, 0, 0, dx + r, dy + h);
			path.lineTo(dx + connectX - 10 * this.scale, dy + connectY);
			path.lineTo(dx + externalX, dy + externalY);
			path.lineTo(dx + connectX + 10 * this.scale, dy + connectY);
			path.close();

		}

	}
};

//**********************************************************************************************************************************************************
//Sticky Note
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupStickyNote.prototype = new mxShapeMockup();
mxShapeMockupStickyNote.prototype.constructor = mxShapeMockupStickyNote;

mxShapeMockupStickyNote.prototype.origWidth = 200;
mxShapeMockupStickyNote.prototype.origHeight = 200;
mxShapeMockupStickyNote.prototype.origAspect = mxShapeMockupStickyNote.prototype.origWidth / mxShapeMockupStickyNote.prototype.origHeight;


function mxShapeMockupStickyNote(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupStickyNote.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.tape = document.createElement('v:shape');
	this.configureVmlShape(this.tape);
	node.appendChild(this.tape);

	// Ignores values that only apply to the background
	this.label = this.background;

	// Configures the group
	this.isShadow = false;
	this.fill = null;
	this.stroke = null;
	this.configureVmlShape(node);
	this.node = node;

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
	this.mainTextTpElem.style.cssText = 'v-text-align: left';
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

mxShapeMockupStickyNote.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.tape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.tape);
	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupStickyNote.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var tapeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAPE_COLOR, '#ff3300');
	var noteColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffcc');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, '0'));
	var noteText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NOTE_TEXT, 'Note');

	var currWidth = Math.max(50 * this.scale, arg.w);

	arg.currWidth = currWidth;

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.tape);
	this.updateVmlShape(this.mainTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.tape.path = this.createPath(arg, 'tape');

	this.background.strokecolor = strokeColor;
	this.background.fillcolor = noteColor;
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.tape.strokecolor = strokeColor;
	this.tape.fillcolor = tapeColor;
	this.tape.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';

	var yPos = Math.round(Math.max(arg.dy + arg.h * 0.5, fontSize * 0.75 * this.scale));
	var xPos = Math.round(arg.dx + 10 * this.scale);
	this.mainTextPath.to = (xPos + 1) + ' ' + yPos;
	this.mainTextPath.from = xPos + ' ' + yPos;
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';

	this.mainTextTpElem.string = noteText;

	this.updateRotation();
};

mxShapeMockupStickyNote.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var tapeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.TAPE_COLOR, '#ff3300');
	var noteColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffcc');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, '0'));
	var noteText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NOTE_TEXT, 'Note');

	var currWidth = Math.max(50 * this.scale, arg.w);

	arg.currWidth = currWidth;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.tape.setAttribute('d', this.createPath(arg, 'tape'));

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('stroke', strokeColor);
	this.innerNode.setAttribute('fill', noteColor);

	this.tape.setAttribute('stroke', strokeColor);
	this.tape.setAttribute('fill', tapeColor);
	this.tape.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);

	if ((fontStyle & 4) === 4)
	{
		this.mainText.setAttribute('text-decoration', 'underline');
	}
	else
	{
		this.mainText.removeAttribute('text-decoration');
	}

	this.mainText.setAttribute('text-anchor', 'start');
	this.mainText.setAttribute('x', this.bounds.x + 10 * this.scale);
	this.mainText.setAttribute('y', Math.max(this.bounds.y + arg.h * 0.5 + fontSize * 0.5 * this.scale, fontSize * 1.25 * this.scale));

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(noteText);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupStickyNote.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var w = width;
	var h = height;

	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.03, dy + h * 0.07);
		path.lineTo(dx + w * 0.89, dy + h * 0.06);
		path.arcTo(dx + w * 0.89, dy + h * 0.06, 2.81 * w, 2.92 * h, 1, 0, 0, dx + w * 0.99, dy + h * 0.98);
		path.lineTo(dx + w * 0.09, dy + h * 0.99);
		path.arcTo(dx + w * 0.09, dy + h * 0.99, 2.81 * w, 2.92 * h, 1, 0, 1, dx + w * 0.03, dy + h * 0.07);
		path.close();
	}
	else if (shape === 'tape')
	{
		path.moveTo(dx + w * 0.28 , dy);
		path.lineTo(dx + w * 0.59, dy);
		path.lineTo(dx + w * 0.6, dy + h * 0.12);
		path.lineTo(dx + w * 0.28, dy + h * 0.13);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Bulleted List
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupBulletedList.prototype = new mxShapeMockup();
mxShapeMockupBulletedList.prototype.constructor = mxShapeMockupBulletedList;

mxShapeMockupBulletedList.prototype.origWidth = 150;
mxShapeMockupBulletedList.prototype.origHeight = 135;
mxShapeMockupBulletedList.prototype.origAspect = mxShapeMockupBulletedList.prototype.origWidth / mxShapeMockupBulletedList.prototype.origHeight;

mxShapeMockupBulletedList.prototype.cst = {
		HYPHEN : 'hyphen',
		DOT : 'dot',
		NUMBER : 'number'
};

function mxShapeMockupBulletedList(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupBulletedList.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var boxes = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON, 'Button').toString().split(',');
	this.boxNum = boxes.length;
	this.currentPath = new Array();
	this.fillElem = new Array();
	this.strokeElem = new Array();
	this.pathElem = new Array();
	this.tpElem = new Array();
	this.oldBoxNames = new Array();
	this.boxWidths = new Array();
	this.boxes = new Array();
	this.isSelected = new Array();

	for (var i = 0; i < this.boxNum; i++)
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

mxShapeMockupBulletedList.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.frame = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.frame);
	this.button = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.button);

	var boxes = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON, 'Button').toString().split(',');
	this.boxNum = boxes.length;
	this.boxText = new Array();
	this.oldBoxNames = new Array();
	this.boxWidths = new Array();
	this.boxes = new Array();
	this.isSelected = new Array();
	this.boxTextNode = new Array();

	for (var i = 0; i < this.boxNum; i++)
	{
		this.boxText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.boxText[i]);
	}

	return this.g;
};

mxShapeMockupBulletedList.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);

	var boxNames = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAMES, 'Item 1, Item 2, Item 3').toString().split(',');
	var newBoxNum = boxNames.length;

	if (newBoxNum > this.boxNum)
	{ 
		// we have to add some elements
		for (var i = this.boxNum; i < newBoxNum; i++)
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
			this.tpElem[i].style.cssText = 'v-text-align: left';
			this.tpElem[i].on = 'true';
			this.currentPath[i].appendChild(this.tpElem[i]);

			this.node.appendChild(this.currentPath[i]);
		}
	}
	else if (newBoxNum < this.boxNum)
	{ 
		// we have to remove some elements
		for (var i = newBoxNum; i < this.boxNum; i++)
		{
			this.node.removeChild(this.currentPath[i]);
		}

		for (var i = newBoxNum; i < this.boxNum; i++)
		{
			this.currentPath.pop();
			this.fillElem.pop();
			this.strokeElem.pop();
			this.pathElem.pop();
			this.tpElem.pop();
		}
	}

	this.shadowNode = null;

	this.boxNum = newBoxNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var bulletStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BULLET_STYLE, mxShapeMockupBulletedList.prototype.cst.HYPHEN);

	this.greatestWidth = 0;

	for (var i = 0; i < this.boxNum; i++)
	{
		if (this.oldBoxNames[i] !== boxNames[i] || this.oldScale !== this.scale)
		{
			var boxText = boxNames[i];
			this.boxWidths[i] = this.getSizeForString(boxText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.boxWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.boxWidths[i];
		}
	}

	var marginOffset = 15 * this.scale;
	var boxSize = 15 * this.scale;

	arg.marginOffset = marginOffset;
	arg.boxSize = boxSize;
	arg.boxNames = boxNames;
	this.minWidth = 3 * marginOffset + boxSize + this.greatestWidth;
	this.minHeight = marginOffset + (boxSize + marginOffset) * this.boxNum;
	this.totalWidth = Math.max(this.minWidth , arg.w);
	this.totalHeight = Math.max(this.minHeight, arg.h);

	this.background.fillColor = fillColor;
	this.background.strokeColor = strokeColor;
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	//display text
	for (var i = 0; i < this.boxNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);

		var boxText = boxNames[i];

		//coloring the letters depending if the checkbox is disabled or enabled
		if(boxText.charAt(0) === '-' || boxText.charAt(1) === '-')
		{
			this.fillElem[i].color = strokeColor;
		}
		else
		{
			this.fillElem[i].color = textColor;
		}

		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		var currX = Math.round(marginOffset);
		var currY = Math.round(marginOffset  + (marginOffset + boxSize) * i + boxSize / 2);
		this.currentPath[i].to = (currX + 1) + ' ' + currY;
		this.currentPath[i].from = (currX - 1) + ' ' + currY;

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';

		if (bulletStyle === mxShapeMockupBulletedList.prototype.cst.HYPHEN)
		{
			boxText = '- ' + boxText;
		}
		else if (bulletStyle === mxShapeMockupBulletedList.prototype.cst.NUMBER)
		{
			boxText = (i + 1) + ') ' + boxText;
		}
		else if (bulletStyle === mxShapeMockupBulletedList.prototype.cst.DOT)
		{
			boxText = String.fromCharCode(8226) + ' ' + boxText;
		}

		this.tpElem[i].string = boxText;
	}

	this.updateRotation();

	this.oldBoxNames = boxNames;
	this.oldScale = this.scale;
};

mxShapeMockupBulletedList.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var boxNames = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAMES, 'Item 1, Item 2, Item 3').toString().split(',');
	var newBoxNum = boxNames.length;

	if (newBoxNum > this.boxNum)
	{ 
		// we have to add some elements
		for (var i = this.boxNum; i < newBoxNum; i++)
		{
			this.boxText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
			this.g.appendChild(this.boxText[i]);
		}
	}
	else if (newBoxNum < this.boxNum)
	{ 
		// we have to remove some elements
		for (var i = newBoxNum; i < this.boxNum; i++)
		{
			this.node.removeChild(this.boxText[i]);
		}

		for (var i = newBoxNum; i < this.boxNum; i++)
		{
			this.boxText.pop();
		}
	}

	this.shadowNode = null;

	this.boxNum = newBoxNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var bulletStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BULLET_STYLE, mxShapeMockupBulletedList.prototype.cst.HYPHEN);

	this.greatestWidth = 0;

	for (var i = 0; i < this.boxNum; i++)
	{
		if (this.oldBoxNames[i] !== boxNames[i] || this.oldScale !== this.scale)
		{
			var boxText = boxNames[i];
			this.boxWidths[i] = this.getSizeForString(boxText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.boxWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.boxWidths[i];
		}
	}

	var marginOffset = 15 * this.scale;
	var boxSize = 15 * this.scale;

	arg.marginOffset = marginOffset;
	arg.boxSize = boxSize;
	arg.boxNames = boxNames;
	this.minWidth = marginOffset + this.greatestWidth;
	this.minHeight = marginOffset + (boxSize + marginOffset) * this.boxNum;
	this.totalWidth = Math.max(this.minWidth , arg.w);
	this.totalHeight = Math.max(this.minHeight, arg.h);

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));

	this.innerNode.setAttribute('fill', fillColor);
	this.innerNode.setAttribute('stroke', strokeColor);
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	//display text
	for (var i = 0; i < this.boxNum; i++)
	{
		var boxText = boxNames[i];

		this.boxText[i].setAttribute('fill', textColor);
		this.boxText[i].setAttribute('font-size', fontSize * this.scale);

		this.boxText[i].setAttribute('text-anchor', 'start');
		this.boxText[i].setAttribute('x', this.bounds.x + marginOffset);
		this.boxText[i].setAttribute('y', this.bounds.y + marginOffset  + (marginOffset + boxSize) * i + boxSize / 2 + fontSize * 0.25 * this.scale);

		if (this.boxTextNode.length > i)
		{
			this.boxText[i].removeChild(this.boxTextNode[i]);
		}

		if (bulletStyle === mxShapeMockupBulletedList.prototype.cst.HYPHEN)
		{
			boxText = '- ' + boxText;
		}
		else if (bulletStyle === mxShapeMockupBulletedList.prototype.cst.NUMBER)
		{
			boxText = (i + 1) + ') ' + boxText;
		}
		else if (bulletStyle === mxShapeMockupBulletedList.prototype.cst.DOT)
		{
			boxText = String.fromCharCode(8226) + ' ' + boxText;
		}

		this.boxTextNode[i] = document.createTextNode(boxText);
		this.boxText[i].appendChild(this.boxTextNode[i]);
	}

	this.updateRotation();

	this.oldBoxNames = boxNames;
	this.oldScale = this.scale;
};

mxShapeMockupBulletedList.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + this.totalWidth, dy);
		path.lineTo(dx + this.totalWidth, dy + this.totalHeight);
		path.lineTo(dx, dy + this.totalHeight);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Table
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup
 */
//TODO finish Table shape
mxShapeMockupTable.prototype = new mxShapeMockup();
mxShapeMockupTable.prototype.constructor = mxShapeMockupTable;

mxShapeMockupTable.prototype.origWidth = 400;
mxShapeMockupTable.prototype.origHeight = 600;
mxShapeMockupTable.prototype.origAspect = mxShapeMockupTable.prototype.origWidth / mxShapeMockupTable.prototype.origHeight;

function mxShapeMockupTable(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupTable.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');
	var xSize = parseInt(mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.X_SIZE, '3').toString(), 10);
	var ySize = parseInt(mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.Y_SIZE, '3').toString(), 10);

	var names = new Array(xSize);
	for (var i = 0; i < xSize; i++)
	{
		names[i] = new Array(ySize);

		for (var j = 0; j < ySize; j++)
		{
			names[i][j] = listEntry[ i * xSize + j];
		}
	}

//	this.buttonNum = listEntry.length;
	this.currentPath = new Array(xSize);
	this.fillElem = new Array(xSize);
	this.strokeElem = new Array(xSize);
	this.pathElem = new Array(xSize);
	this.tpElem = new Array(xSize);
	this.oldButtonNames = new Array();
	this.buttonWidths = new Array();

	this.headerShape = document.createElement('v:shape');
	this.configureVmlShape(this.headerShape);
	node.appendChild(this.headerShape);

	for (var i = 0; i < xSize; i++)
	{
		for (var j = 0; j < ySize; j++)
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

mxShapeMockupTable.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');

	this.buttonNum = listEntry.length;
	this.buttonText = new Array();
	this.oldButtonNames = new Array();
	this.buttonWidths = new Array();
	this.buttonTextNode = new Array();

	this.headerShape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.headerShape);

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.buttonText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.buttonText[i]);
	}

	return this.g;
};

mxShapeMockupTable.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.headerShape);

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');
	arg.hasHeader = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HAS_HEADER, mxShapeMockup.prototype.cst.TRUE).toString();
	var headerColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HEADER_COLOR, '#444444').toString();

	var newButtonNum = listEntry.length;

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
		if (this.oldButtonNames[i] !== listEntry[i] || this.oldScale !== this.scale)
		{
			var buttonText = listEntry[i];

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

		if(listEntry[i].charAt(0) === '+')
		{
			selectedButton = i;
		}
	}

	var labelOffset = 15 * this.scale;
	arg.labelOffset = labelOffset;
	arg.buttonHeight = fontSize * 1.5 * this.scale;

	this.background.path = this.createPath(arg, 'background');
	this.headerShape.path = this.createPath(arg, 'headerShape');
	this.headerShape.fillcolor = headerColor;
	this.headerShape.strokecolor = strokeColor;
	this.headerShape.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.minWidth = 2 * labelOffset + this.greatestWidth;

	if (selectedButton !== -1)
	{
		if (typeof this.selectedButton === 'undefined' || this.selectedButton === null)
		{
			this.selectedButton = document.createElement('v:shape');
			this.node.insertBefore(this.selectedButton,this.headerShape);
		}

		this.updateVmlShape(this.selectedButton);
		arg.selectedButton = selectedButton;
		this.selectedButton.path = this.createPath(arg, 'selectedButton');
		this.selectedButton.filled = 'true';
		this.selectedButton.fillcolor = selButtonColor;
		this.selectedButton.strokecolor = 'none';
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

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);
		this.fillElem[i].color = textColor;
		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		var currX = Math.round((this.greatestWidth / 2  + labelOffset) * totalWidth / this.minWidth);
		var currY = Math.round(arg.buttonHeight * (i + 0.5));
		this.currentPath[i].to = (currX + 1) + ' ' + currY;
		this.currentPath[i].from = (currX - 1) + ' ' + currY;

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';
		var buttonText = listEntry[i];

		if(buttonText.charAt(0) === '+')
		{
			buttonText = buttonText.substring(1);
		}

		this.tpElem[i].string = buttonText;
	}

	this.updateRotation();

	this.oldButtonNames = listEntry;
	this.oldScale = this.scale;
};

mxShapeMockupTable.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');
	arg.hasHeader = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HAS_HEADER, mxShapeMockup.prototype.cst.TRUE).toString();
	var headerColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HEADER_COLOR, '#444444').toString();

	var newButtonNum = listEntry.length;

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
	var selButtonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEL_BUTTON_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	var selectedButton = -1;
	this.greatestWidth = 0;

	for (var i = 0; i < this.buttonNum; i++)
	{
		if(listEntry[i].charAt(0) === '+')
		{
			selectedButton = i;
		}

		var buttonString = listEntry[i];

		if(buttonString.charAt(0) === '+')
		{
			buttonString = buttonString.substring(1);
		}

		if (this.oldButtonNames[i] !== listEntry[i] || this.scale !== this.oldScale || fontSize !== this.oldFontSize)
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
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);
	this.headerShape.setAttribute('d', this.createPath(arg, 'headerShape'));
	this.headerShape.setAttribute('fill', headerColor);
	this.headerShape.setAttribute('stroke', strokeColor);
	this.headerShape.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.minWidth = 2 * labelOffset + this.greatestWidth;

	if (selectedButton !== -1)
	{
		if (typeof this.selectedButton === 'undefined' || this.selectedButton === null)
		{
			this.selectedButton = document.createElementNS(mxConstants.NS_SVG, 'path');
			this.g.insertBefore(this.selectedButton,this.headerShape);
		}

		arg.selectedButton = selectedButton;
		this.selectedButton.setAttribute('d', this.createPath(arg, 'selectedButton'));
		this.selectedButton.setAttribute('fill', selButtonColor);
		this.selectedButton.setAttribute('stroke', 'none');
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

	var minHeight = this.buttonNum * arg.buttonHeight;

	for (var i = 0; i < this.buttonNum; i++)
	{
		this.buttonText[i].setAttribute('fill', textColor);
		this.buttonText[i].setAttribute('font-size', fontSize * this.scale);
		this.buttonText[i].setAttribute('text-anchor', 'middle');
		this.buttonText[i].setAttribute('x', this.bounds.x + (this.greatestWidth / 2  + labelOffset));
		this.buttonText[i].setAttribute('y', this.bounds.y + arg.buttonHeight * (i + 0.5) + fontSize * 0.25 * this.scale);

		var buttonString = listEntry[i];

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

	this.oldTabNames = listEntry;
	this.oldFontSize = fontSize;
	this.oldScale = this.scale;
};

mxShapeMockupTable.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var minWidth = this.greatestWidth + 2 * arg.labelOffset;
	var totalWidth = Math.max(minWidth, w);
	var totalHeight = Math.max(this.buttonNum * arg.buttonHeight, h);

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + totalWidth, dy);
		path.lineTo(dx + totalWidth, dy + totalHeight);
		path.lineTo(dx, dy + totalHeight);
		path.close();
	}
	else if (shape === 'headerShape')
	{
		if (arg.hasHeader === mxShapeMockup.prototype.cst.TRUE)
		{
			path.moveTo(dx, dy);
			path.lineTo(dx + totalWidth, dy);
			path.lineTo(dx + totalWidth, dy + arg.buttonHeight);
			path.lineTo(dx, dy + arg.buttonHeight);
			path.close();
		}
	}
	else if (shape === 'selectedButton')
	{
		if (arg.selectedButton !== 0)
		{
			// we draw a path rectangle for one of the buttons in the middle
			var buttonTop = arg.buttonHeight * arg.selectedButton;
			var buttonBottom = arg.buttonHeight * (arg.selectedButton + 1);
			path.moveTo(dx + 5 * this.scale, dy + buttonTop);
			path.lineTo(dx + totalWidth - 5 * this.scale, dy + buttonTop);
			path.lineTo(dx + totalWidth - 5 * this.scale, dy + buttonBottom);
			path.lineTo(dx + 5 * this.scale, dy + buttonBottom);
			path.close();
		}
	}
};


//**********************************************************************************************************************************************************
//Captcha
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupCaptcha.prototype = new mxShapeMockup();
mxShapeMockupCaptcha.prototype.constructor = mxShapeMockupCaptcha;

mxShapeMockupCaptcha.prototype.origWidth = 150;
mxShapeMockupCaptcha.prototype.origHeight = 50;
mxShapeMockupCaptcha.prototype.origAspect = mxShapeMockupCaptcha.prototype.origWidth / mxShapeMockupCaptcha.prototype.origHeight;

function mxShapeMockupCaptcha(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupCaptcha.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.bgShapes = document.createElement('v:shape');
	this.configureVmlShape(this.bgShapes);
	node.appendChild(this.bgShapes);

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

	this.frameShape = document.createElement('v:shape');
	this.configureVmlShape(this.frameShape);
	node.appendChild(this.frameShape);

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

mxShapeMockupCaptcha.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.bgShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.bgShapes);

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	this.frameShape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.frameShape);

	return this.g;
};

mxShapeMockupCaptcha.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var fillColor2 = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FILL_COLOR2, '#888888');
	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.CAPTCHA_TEXT, 'XM6qKi');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.bgShapes);
	this.updateVmlShape(this.frameShape);
	this.updateVmlShape(this.mainTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.bgShapes.path = this.createPath(arg, 'bgShapes');
	this.bgShapes.fillcolor = fillColor2;
	this.bgShapes.stroked = 'false';

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';
	this.mainTextPath.to = Math.round(arg.dx + arg.w * 0.5 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.5);
	this.mainTextPath.from = Math.round(arg.dx + arg.w * 0.5 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.5);
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';
	this.mainTextTpElem.string = buttonText;

	this.frameShape.path = this.createPath(arg, 'frameShape');
	this.frameShape.filled = 'false';
	this.frameShape.strokecolor = strokeColor;
	this.frameShape.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupCaptcha.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var fillColor2 = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FILL_COLOR2, '#888888');
	var buttonText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.CAPTCHA_TEXT, 'XM6qKi');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.bgShapes.setAttribute('d', this.createPath(arg, 'bgShapes'));
	this.bgShapes.setAttribute('fill', fillColor2);
	this.bgShapes.setAttribute('stroke', 'none');
	this.frameShape.setAttribute('d', this.createPath(arg, 'frameShape'));
	this.frameShape.setAttribute('fill', 'none');
	this.frameShape.setAttribute('stroke', strokeColor);
	this.frameShape.setAttribute('stroke-width', this.strokewidth * this.scale);

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

mxShapeMockupCaptcha.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
	else if (shape ==='bgShapes')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + w * 0.35, dy);
		path.lineTo(dx + w * 0.55, dy + h * 0.85);
		path.lineTo(dx + w * 0.4, dy + h * 0.75);
		path.close();
		
		path.moveTo(dx + w * 0.7, dy + h * 0.1);
		path.lineTo(dx + w * 0.95, dy + h * 0.23);
		path.lineTo(dx + w, dy + h * 0.4);
		path.lineTo(dx + w, dy + h * 0.9);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w * 0.8, dy + h);
		path.close();
	}
	else if (shape ==='frameShape')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + width, dy);
		path.lineTo(dx + width, dy + height);
		path.lineTo(dx, dy + height);
		path.close();
	}
};
