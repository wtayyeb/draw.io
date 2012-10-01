
//**********************************************************************************************************************************************************
//Shopping Cart
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupShoppingCart.prototype = new mxShapeMockup();
mxShapeMockupShoppingCart.prototype.constructor = mxShapeMockupShoppingCart;

mxShapeMockupShoppingCart.prototype.origWidth = 50;
mxShapeMockupShoppingCart.prototype.origHeight = 50;
mxShapeMockupShoppingCart.prototype.origAspect = mxShapeMockupShoppingCart.prototype.origWidth / mxShapeMockupShoppingCart.prototype.origHeight;

function mxShapeMockupShoppingCart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupShoppingCart.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.girder = document.createElement('v:shape');
	this.configureVmlShape(this.girder);
	node.appendChild(this.girder);

	this.wheels = document.createElement('v:shape');
	this.configureVmlShape(this.wheels);
	node.appendChild(this.wheels);

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

mxShapeMockupShoppingCart.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.girder = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.girder);
	this.wheels = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.wheels);
	return this.g;
};

mxShapeMockupShoppingCart.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.girder);
	this.updateVmlShape(this.wheels);

	this.background.path = this.createPath(arg, 'background');
	this.background.strokeweight = Math.round(2.5 * this.strokewidth * this.scale) + 'px';

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');

	this.girder.path = this.createPath(arg, 'girder');
	this.wheels.path = this.createPath(arg, 'wheels');

	this.girder.filled = 'false';
	this.girder.strokecolor = strokeColor;
	this.girder.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.wheels.stroked = 'false';
	this.wheels.filled = 'true';
	this.wheels.fillcolor = strokeColor;

	this.updateRotation();
};

mxShapeMockupShoppingCart.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	this.girder.setAttribute('d', this.createPath(arg, 'girder'));
	this.girder.setAttribute('fill', 'none');
	this.girder.setAttribute('stroke', strokeColor);
	this.girder.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.wheels.setAttribute('d', this.createPath(arg, 'wheels'));
	this.wheels.setAttribute('fill', strokeColor);
	this.wheels.setAttribute('stroke', 'none');

	this.innerNode.setAttribute('stroke-width', (Math.max(1, 2.5 * this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', 'none');

	this.updateRotation();
};

mxShapeMockupShoppingCart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.975, dy + h * 0.025);
		path.lineTo(dx + w * 0.82, dy + h * 0.055);
		path.lineTo(dx + w * 0.59, dy + h * 0.66);
		path.lineTo(dx + w * 0.7, dy + h * 0.765);
		path.arcTo(dx + w * 0.7, dy + h * 0.765, w * 0.06, h * 0.06, 0, 0, 1, dx + w * 0.665, dy + h * 0.86);
		path.lineTo(dx + w * 0.05, dy + h * 0.86);
		path.end();
		path.moveTo(dx + w * 0.74, dy + h * 0.26);
		path.lineTo(dx + w * 0.03, dy + h * 0.28);
		path.lineTo(dx + w * 0.065, dy + h * 0.61);
		path.lineTo(dx + w * 0.59, dy + h * 0.66);
		path.end();
	}
	else if (shape === 'girder')
	{
		path.moveTo(dx + w * 0.15, dy + h * 0.28);
		path.lineTo(dx + w * 0.15, dy + h * 0.62);
		path.moveTo(dx + w * 0.265, dy + h * 0.275);
		path.lineTo(dx + w * 0.265, dy + h * 0.63);
		path.moveTo(dx + w * 0.38, dy + h * 0.27);
		path.lineTo(dx + w * 0.38, dy + h * 0.64);
		path.moveTo(dx + w * 0.495, dy + h * 0.265);
		path.lineTo(dx + w * 0.495, dy + h * 0.65);
		path.moveTo(dx + w * 0.61, dy + h * 0.265);
		path.lineTo(dx + w * 0.61, dy + h * 0.61);

		path.moveTo(dx + w * 0.69, dy + h * 0.405);
		path.lineTo(dx + w * 0.045, dy + h * 0.405);
		path.moveTo(dx + w * 0.645, dy + h * 0.52);
		path.lineTo(dx + w * 0.055, dy + h * 0.52);
		path.end();
		path.ellipse(dx + w * 0.075, dy + h * 0.89, w * 0.1, h * 0.1);
		path.close();
		path.ellipse(dx + w * 0.62, dy + h * 0.89, w * 0.1, h * 0.1);
		path.close();
	}
	else if (shape === 'wheels')
	{
		path.ellipse(dx + w * 0.11, dy + h * 0.925, w * 0.03, h * 0.03);
		path.close();
		path.ellipse(dx + w * 0.655, dy + h * 0.925, w * 0.03, h * 0.03);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Edit
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupEdit.prototype = new mxShapeMockup();
mxShapeMockupEdit.prototype.constructor = mxShapeMockupEdit;

mxShapeMockupEdit.prototype.origWidth = 50;
mxShapeMockupEdit.prototype.origHeight = 50;
mxShapeMockupEdit.prototype.origAspect = mxShapeMockupEdit.prototype.origWidth / mxShapeMockupEdit.prototype.origHeight;

function mxShapeMockupEdit(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupEdit.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.pencil = document.createElement('v:shape');
	this.configureVmlShape(this.pencil);
	node.appendChild(this.pencil);

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

mxShapeMockupEdit.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.pencil = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.pencil);
	return this.g;
};

mxShapeMockupEdit.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.pencil);

	this.background.path = this.createPath(arg, 'background');
	this.background.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	this.pencil.path = this.createPath(arg, 'pencil');

	this.pencil.stroked = 'false';
	this.pencil.fillcolor = strokeColor;
	this.pencil.strokecolor = 'none';

	this.updateRotation();
};

mxShapeMockupEdit.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.pencil.setAttribute('d', this.createPath(arg, 'pencil'));
	this.pencil.setAttribute('fill', strokeColor);
	this.pencil.setAttribute('stroke', 'none');

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', fillColor);

	this.updateRotation();
};

mxShapeMockupEdit.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.95, dy);
		path.arcTo(dx + w * 0.95, dy, w * 0.05, h * 0.05, 0, 0, 1, dx + w, dy + h * 0.05);
		path.lineTo(dx + w, dy + h  * 0.95);
		path.arcTo(dx + w, dy + h  * 0.95, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.95, dy + h);
		path.lineTo(dx + w * 0.05, dy + h);
		path.arcTo(dx + w * 0.05, dy + h, w * 0.05, h * 0.05, 0, 0, 1, dx, dy + h * 0.95);
		path.lineTo(dx, dy + h  * 0.05);
		path.arcTo(dx, dy + h  * 0.05, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.05, dy);
		path.close();
	}
	else if (shape === 'pencil')
	{
		path.moveTo(dx + w * 0.11, dy + h * 0.8);
		path.lineTo(dx + w * 0.2, dy + h * 0.89);
		path.lineTo(dx + w * 0.05, dy + h * 0.95);
		path.close();
		path.moveTo(dx + w * 0.74, dy + h * 0.16);
		path.lineTo(dx + w * 0.84, dy + h * 0.26);
		path.lineTo(dx + w * 0.22, dy + h * 0.88);
		path.lineTo(dx + w * 0.12, dy + h * 0.78);
		path.close();
		path.moveTo(dx + w * 0.755, dy + h * 0.145);
		path.lineTo(dx + w * 0.82, dy + h * 0.08);
		path.lineTo(dx + w * 0.92, dy + h * 0.18);
		path.lineTo(dx + w * 0.855, dy + h * 0.245);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Print
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockupEdit.
 */
mxShapeMockupPrint.prototype = new mxShapeMockupEdit();
mxShapeMockupPrint.prototype.constructor = mxShapeMockupPrint;

function mxShapeMockupPrint(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupPrint.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.95, dy);
		path.arcTo(dx + w * 0.95, dy, w * 0.05, h * 0.05, 0, 0, 1, dx + w, dy + h * 0.05);
		path.lineTo(dx + w, dy + h  * 0.95);
		path.arcTo(dx + w, dy + h  * 0.95, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.95, dy + h);
		path.lineTo(dx + w * 0.05, dy + h);
		path.arcTo(dx + w * 0.05, dy + h, w * 0.05, h * 0.05, 0, 0, 1, dx, dy + h * 0.95);
		path.lineTo(dx, dy + h  * 0.05);
		path.arcTo(dx, dy + h  * 0.05, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.05, dy);
		path.close();
	}
	else if (shape === 'pencil')
	{
		path.moveTo(dx + w * 0.15, dy + h * 0.58);
		path.arcTo(dx + w * 0.15, dy + h * 0.58, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.18, dy + h * 0.55);
		path.lineTo(dx + w * 0.82, dy + h * 0.55);
		path.arcTo(dx + w * 0.82, dy + h * 0.55, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.85, dy + h * 0.58);
		path.lineTo(dx + w * 0.85, dy + h * 0.82);
		path.arcTo(dx + w * 0.85, dy + h * 0.82, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.82, dy + h * 0.85);
		path.lineTo(dx + w * 0.18, dy + h * 0.85);
		path.arcTo(dx + w * 0.18, dy + h * 0.85, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.15, dy + h * 0.82);
		path.close();
		path.moveTo(dx + w * 0.7, dy + h * 0.52);
		path.lineTo(dx + w * 0.3, dy + h * 0.52);
		path.lineTo(dx + w * 0.3, dy + h * 0.15);
		path.lineTo(dx + w * 0.55, dy + h * 0.15);
		path.lineTo(dx + w * 0.55, dy + h * 0.3);
		path.lineTo(dx + w * 0.7, dy + h * 0.3);
		path.close();
		path.moveTo(dx + w * 0.57, dy + h * 0.15);
		path.lineTo(dx + w * 0.7, dy + h * 0.28);
		path.lineTo(dx + w * 0.57, dy + h * 0.28);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Share
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupShare.prototype = new mxShapeMockup();
mxShapeMockupShare.prototype.constructor = mxShapeMockupShare;

function mxShapeMockupShare(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupShare.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.bgRect = document.createElement('v:shape');
	this.configureVmlShape(this.bgRect);
	node.appendChild(this.bgRect);

	this.share = document.createElement('v:shape');
	this.configureVmlShape(this.share);
	node.appendChild(this.share);

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

mxShapeMockupShare.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.bgRect = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.bgRect);
	this.share = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.share);
	return this.g;
};

mxShapeMockupShare.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.bgRect);
	this.updateVmlShape(this.share);

	this.background.path = this.createPath(arg, 'background');
	this.background.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.bgRect.path = this.createPath(arg, 'bgRect');
	this.share.path = this.createPath(arg, 'share');

	this.bgRect.stroked = 'false';
	this.bgRect.fillcolor = strokeColor;
	this.bgRect.strokecolor = 'none';
	this.share.stroked = 'false';
	this.share.fillcolor = fillColor;
	this.share.strokecolor = 'none';

	this.updateRotation();
};

mxShapeMockupShare.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.bgRect.setAttribute('d', this.createPath(arg, 'bgRect'));
	this.bgRect.setAttribute('fill', strokeColor);
	this.bgRect.setAttribute('stroke', 'none');
	this.share.setAttribute('d', this.createPath(arg, 'share'));

	if (fillColor === 'none')
	{
		this.share.setAttribute('fill', '#ffffff');
	}
	else
	{
		this.share.setAttribute('fill', fillColor);
	}

	this.share.setAttribute('stroke', 'none');

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', fillColor);

	this.updateRotation();
};

mxShapeMockupShare.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.95, dy);
		path.arcTo(dx + w * 0.95, dy, w * 0.05, h * 0.05, 0, 0, 1, dx + w, dy + h * 0.05);
		path.lineTo(dx + w, dy + h  * 0.95);
		path.arcTo(dx + w, dy + h  * 0.95, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.95, dy + h);
		path.lineTo(dx + w * 0.05, dy + h);
		path.arcTo(dx + w * 0.05, dy + h, w * 0.05, h * 0.05, 0, 0, 1, dx, dy + h * 0.95);
		path.lineTo(dx, dy + h  * 0.05);
		path.arcTo(dx, dy + h  * 0.05, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.05, dy);
		path.close();
	}
	else if (shape === 'bgRect')
	{
		path.moveTo(dx + w * 0.15, dy + h * 0.18);
		path.arcTo(dx + w * 0.15, dy + h * 0.18, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.18, dy + h * 0.15);
		path.lineTo(dx + w * 0.82, dy + h * 0.15);
		path.arcTo(dx + w * 0.82, dy + h * 0.15, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.85, dy + h * 0.18);
		path.lineTo(dx + w * 0.85, dy + h * 0.82);
		path.arcTo(dx + w * 0.85, dy + h * 0.82, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.82, dy + h * 0.85);
		path.lineTo(dx + w * 0.18, dy + h * 0.85);
		path.arcTo(dx + w * 0.18, dy + h * 0.85, w * 0.03, h * 0.03, 0, 0, 1, dx + w * 0.15, dy + h * 0.82);
		path.close();
	}
	else if (shape === 'share')
	{
		path.moveTo(dx + w * 0.563, dy + h * 0.34);
		path.arcTo(dx + w * 0.563, dy + h * 0.34, w * 0.095, h * 0.095, 0, 1, 1, dx + w * 0.603, dy + h * 0.42);
		path.lineTo(dx + w * 0.44, dy + h * 0.5);
		path.lineTo(dx + w * 0.602, dy + h * 0.582);
		path.arcTo(dx + w * 0.602, dy + h * 0.582, w * 0.095, h * 0.095, 0, 1, 1, dx + w * 0.563, dy + h * 0.653);
		path.lineTo(dx + w * 0.403, dy + h * 0.575);
		path.arcTo(dx + w * 0.403, dy + h * 0.575, w * 0.095, h * 0.095, 0, 1, 1, dx + w * 0.4, dy + h * 0.42);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Playback Controls
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupPlaybackControls.prototype = new mxShapeMockup();
mxShapeMockupPlaybackControls.prototype.constructor = mxShapeMockupPlaybackControls;

mxShapeMockupPlaybackControls.prototype.origWidth = 250;
mxShapeMockupPlaybackControls.prototype.origHeight = 30;
mxShapeMockupPlaybackControls.prototype.origAspect = mxShapeMockupPlaybackControls.prototype.origWidth / mxShapeMockupPlaybackControls.prototype.origHeight;

function mxShapeMockupPlaybackControls(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupPlaybackControls.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.buttons = document.createElement('v:shape');
	this.configureVmlShape(this.buttons);
	node.appendChild(this.buttons);

	this.buttonMarks = document.createElement('v:shape');
	this.configureVmlShape(this.buttonMarks);
	node.appendChild(this.buttonMarks);

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

mxShapeMockupPlaybackControls.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.buttons = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttons);
	this.buttonMarks = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttonMarks);
	return this.g;
};

mxShapeMockupPlaybackControls.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.buttons);
	this.updateVmlShape(this.buttonMarks);

	this.background.path = this.createPath(arg, 'background');
	this.background.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.buttons.path = this.createPath(arg, 'buttons');
	this.buttons.fillcolor = strokeColor;
	this.buttons.strokecolor = fillColor;

	this.buttonMarks.path = this.createPath(arg, 'buttonMarks');
	this.buttonMarks.fillcolor = fillColor;
	this.buttonMarks.strokecolor = fillColor;

	this.updateRotation();
};

mxShapeMockupPlaybackControls.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.buttons.setAttribute('d', this.createPath(arg, 'buttons'));
	this.buttons.setAttribute('fill', strokeColor);
	this.buttons.setAttribute('stroke', 'none');

	this.buttonMarks.setAttribute('d', this.createPath(arg, 'buttonMarks'));
	this.buttonMarks.setAttribute('fill', fillColor);
	this.buttonMarks.setAttribute('stroke', fillColor);

	this.updateRotation();
};

mxShapeMockupPlaybackControls.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	//only the progress bar handle needs to be drawn
	var controlBarHeight = 30 * this.scale;
	var buttonSize = 22 * this.scale;
	var h = Math.max(arg.h, controlBarHeight);
	var w = Math.max(225 * this.scale, arg.w);
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w, dy + h * 0.5 - controlBarHeight * 0.5);
		path.lineTo(dx + w, dy + h * 0.5 + controlBarHeight * 0.5);
		path.lineTo(dx, dy + h * 0.5 + controlBarHeight * 0.5);
		path.lineTo(dx, dy + h * 0.5 - controlBarHeight * 0.5);
		path.close();
	}
	else if (shape === 'buttons')
	{
		path.ellipse(dx + 10 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
		path.ellipse(dx + 40 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
		path.ellipse(dx + 70 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
		path.ellipse(dx + 100 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
		path.ellipse(dx + 130 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
		path.ellipse(dx + 160 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
		path.ellipse(dx + 190 * this.scale, dy + h * 0.5 - buttonSize * 0.5, buttonSize, buttonSize);
		path.close();
	}
	else if (shape === 'buttonMarks')
	{
		// start
		var top = dy + h * 0.5 - controlBarHeight * 0.5;
		path.moveTo(dx + 16 * this.scale, top + 10 * this.scale);
		path.lineTo(dx + 16 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 18 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 18 * this.scale, top + 10 * this.scale);
		path.close();
		path.moveTo(dx + 20 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 25 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 25 * this.scale, top + 10 * this.scale);
		path.close();
		// rewind
		path.moveTo(dx + 44 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 49 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 49 * this.scale, top + 10 * this.scale);
		path.close();
		path.moveTo(dx + 51 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 56 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 56 * this.scale, top + 10 * this.scale);
		path.close();
		// back
		path.moveTo(dx + 77 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 82 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 82 * this.scale, top + 10 * this.scale);
		path.close();
		// play/pause
		path.moveTo(dx + 108 * this.scale, top + 10 * this.scale);
		path.lineTo(dx + 108 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 110 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 110 * this.scale, top + 10 * this.scale);
		path.close();
		path.moveTo(dx + 117 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 112 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 112 * this.scale, top + 10 * this.scale);
		path.close();
		// forward
		path.moveTo(dx + 144 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 139 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 139 * this.scale, top + 10 * this.scale);
		path.close();
		// fast forward
		path.moveTo(dx + 171 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 166 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 166 * this.scale, top + 10 * this.scale);
		path.close();
		path.moveTo(dx + 178 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 173 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 173 * this.scale, top + 10 * this.scale);
		path.close();
		// end
		path.moveTo(dx + 203 * this.scale, top + 10 * this.scale);
		path.lineTo(dx + 203 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 205 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 205 * this.scale, top + 10 * this.scale);
		path.close();
		path.moveTo(dx + 201 * this.scale, top + 15 * this.scale);
		path.lineTo(dx + 196 * this.scale, top + 20 * this.scale);
		path.lineTo(dx + 196 * this.scale, top + 10 * this.scale);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Progress Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupProgressBar.prototype = new mxShapeMockup();
mxShapeMockupProgressBar.prototype.constructor = mxShapeMockupProgressBar;

mxShapeMockupProgressBar.prototype.origWidth = 200;
mxShapeMockupProgressBar.prototype.origHeight = 20;
mxShapeMockupProgressBar.prototype.origAspect = mxShapeMockupProgressBar.prototype.origWidth / mxShapeMockupProgressBar.prototype.origHeight;

mxShapeMockupProgressBar.prototype.cst = {
		SLIDER_BASIC : 'basic',
		SLIDER_FANCY : 'fancy'
};
function mxShapeMockupProgressBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupProgressBar.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.leftSlider = document.createElement('v:shape');
	this.configureVmlShape(this.leftSlider);
	node.appendChild(this.leftSlider);

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

mxShapeMockupProgressBar.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.leftSlider = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.leftSlider);
	return this.g;
};

mxShapeMockupProgressBar.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.leftSlider);

	var sliderPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_POS, '70');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var leftColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LEFT_COLOR, '#00ff00');
	arg.sliderStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_STYLE, mxShapeMockupProgressBar.prototype.cst.SLIDER_BASIC);

	sliderPos = Math.max(0, sliderPos);
	sliderPos = Math.min(100, sliderPos);
	arg.sliderPos = sliderPos;

	this.background.path = this.createPath(arg, 'background');
	this.leftSlider.path = this.createPath(arg, 'leftSlider');

	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	if (arg.sliderStyle === 'normal')
	{
		this.leftSlider.strokecolor = leftColor;
	}
	else
	{
		this.leftSlider.strokecolor = strokeColor;
	}

	this.leftSlider.fillcolor = leftColor;
	this.leftSlider.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupProgressBar.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var sliderPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_POS, '70');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var leftColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LEFT_COLOR, '#00ff00');
	arg.sliderStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_STYLE, mxShapeMockupProgressBar.prototype.cst.SLIDER_BASIC);

	sliderPos = Math.max(0, sliderPos);
	sliderPos = Math.min(100, sliderPos);
	arg.sliderPos = sliderPos;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.leftSlider.setAttribute('d', this.createPath(arg, 'leftSlider'));

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	if (arg.sliderStyle === 'normal')
	{
		this.leftSlider.setAttribute('stroke', leftColor);
	}
	else
	{
		this.leftSlider.setAttribute('stroke', strokeColor);
	}

	this.leftSlider.setAttribute('fill', leftColor);
	this.leftSlider.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupProgressBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var h = Math.max(arg.h, 20 * this.scale);
	var w = Math.max(arg.w, 10 * this.scale);
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + w, dy);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx, dy + h);
		path.close();
	}
	if (shape === 'leftSlider')
	{
		var barCenterPos = w  * arg.sliderPos / 100;

		path.moveTo(dx, dy);
		path.lineTo(dx + barCenterPos, dy);
		path.lineTo(dx + barCenterPos, dy + h);
		path.lineTo(dx, dy + h);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Rating
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupRating.prototype = new mxShapeMockup();
mxShapeMockupRating.prototype.constructor = mxShapeMockupRating;

mxShapeMockupRating.prototype.origWidth = 225;
mxShapeMockupRating.prototype.origHeight = 30;
mxShapeMockupRating.prototype.origAspect = mxShapeMockupRating.prototype.origWidth / mxShapeMockupRating.prototype.origHeight;

mxShapeMockupRating.prototype.cst = {
		RATING_STAR : 'star',
		RATING_HEART : 'heart'
};
function mxShapeMockupRating(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupRating.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.emptyShapes = document.createElement('v:shape');
	this.configureVmlShape(this.emptyShapes);
	node.appendChild(this.emptyShapes);

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

mxShapeMockupRating.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.emptyShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.emptyShapes);
	return this.g;
};

mxShapeMockupRating.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	arg.ratingStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.RATING_STYLE, mxShapeMockupRating.prototype.cst.RATING_STAR);
	arg.grade = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.GRADE, '5');
	arg.ratingScale = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.RATING_SCALE, '10');
	var emptyFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.EMPTY_FILL_COLOR, 'none');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.emptyShapes);

	this.background.path = this.createPath(arg, 'background');
	this.background.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.emptyShapes.path = this.createPath(arg, 'emptyShapes');

//	this.emptyShapes.stroked = 'false';
	this.emptyShapes.fillcolor = emptyFillColor;
	this.emptyShapes.strokecolor = strokeColor;
	this.emptyShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupRating.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	arg.ratingStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.RATING_STYLE, mxShapeMockupRating.prototype.cst.RATING_STAR);
	arg.grade = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.GRADE, '5');
	arg.ratingScale = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.RATING_SCALE, '10');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var emptyFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.EMPTY_FILL_COLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.emptyShapes.setAttribute('d', this.createPath(arg, 'emptyShapes'));
	this.emptyShapes.setAttribute('fill', emptyFillColor);
	this.emptyShapes.setAttribute('stroke', strokeColor);
	this.emptyShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', fillColor);

	this.updateRotation();
};

mxShapeMockupRating.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		if (arg.ratingStyle === mxShapeMockupRating.prototype.cst.RATING_STAR)
		{
			for (var i = 0; i < arg.grade; i++)
			{
				path.moveTo(dx + i * h * 1.5, dy + 0.33 * h);
				path.lineTo(dx + i * h * 1.5 + 0.364 * h, dy + 0.33 * h);
				path.lineTo(dx + i * h * 1.5 + 0.475 * h, dy);
				path.lineTo(dx + i * h * 1.5 + 0.586 * h, dy + 0.33 * h);
				path.lineTo(dx + i * h * 1.5 + 0.95 * h, dy + 0.33 * h);
				path.lineTo(dx + i * h * 1.5 + 0.66 * h, dy + 0.551 * h);
				path.lineTo(dx + i * h * 1.5 + 0.775 * h, dy + 0.9 * h);
				path.lineTo(dx + i * h * 1.5 + 0.475 * h, dy + 0.684 * h);
				path.lineTo(dx + i * h * 1.5 + 0.175 * h, dy + 0.9 * h);
				path.lineTo(dx + i * h * 1.5 + 0.29 * h, dy + 0.551 * h);
				path.close();
			}
		}
		else if (arg.ratingStyle === mxShapeMockupRating.prototype.cst.RATING_HEART)
		{
			for (var i = 0; i < arg.grade; i++)
			{
				path.moveTo(dx + i * h * 1.5 + h * 0.519, dy + h * 0.947);
				path.curveTo(dx + i * h * 1.5 + h * 0.558, dy + h * 0.908, dx + i * h * 1.5 + h * 0.778, dy + h * 0.682, dx + i * h * 1.5 + h * 0.916, dy + h * 0.54);
				path.curveTo(dx + i * h * 1.5 + h * 1.039, dy + h * 0.414, dx + i * h * 1.5 + h * 1.036, dy + h * 0.229, dx + i * h * 1.5 + h * 0.924, dy + h * 0.115);
				path.curveTo(dx + i * h * 1.5 + h * 0.812, dy, dx + i * h * 1.5 + h * 0.631, dy, dx + i * h * 1.5 + h * 0.519, dy + h * 0.115);
				path.curveTo(dx + i * h * 1.5 + h * 0.408, dy, dx + i * h * 1.5 + h * 0.227, dy, dx + i * h * 1.5 + h * 0.115, dy + h * 0.115);
				path.curveTo(dx + i * h * 1.5 + h * 0.03, dy + h * 0.229, dx + i * h * 1.5, dy + h * 0.414, dx + i * h * 1.5 + h * 0.123, dy + h * 0.54);
				path.close();
			}
		}
	}
	else if (shape === 'emptyShapes')
	{
		if (arg.ratingStyle === mxShapeMockupRating.prototype.cst.RATING_STAR)
		{
			for (var i = arg.grade; i < arg.ratingScale; i++)
			{
				path.moveTo(dx + i * arg.h * 1.5, dy + 0.33 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.364 * arg.h, dy + 0.33 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.475 * arg.h, dy);
				path.lineTo(dx + i * arg.h * 1.5 + 0.586 * arg.h, dy + 0.33 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.95 * arg.h, dy + 0.33 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.66 * arg.h, dy + 0.551 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.775 * arg.h, dy + 0.9 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.475 * arg.h, dy + 0.684 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.175 * arg.h, dy + 0.9 * arg.h);
				path.lineTo(dx + i * arg.h * 1.5 + 0.29 * arg.h, dy + 0.551 * arg.h);
				path.close();
			}
		}
		else if (arg.ratingStyle === mxShapeMockupRating.prototype.cst.RATING_HEART)
		{
			for (var i = arg.grade; i < arg.ratingScale; i++)
			{
				path.moveTo(dx + i * h * 1.5 + h * 0.519, dy + h * 0.947);
				path.curveTo(dx + i * h * 1.5 + h * 0.558, dy + h * 0.908, dx + i * h * 1.5 + h * 0.778, dy + h * 0.682, dx + i * h * 1.5 + h * 0.916, dy + h * 0.54);
				path.curveTo(dx + i * h * 1.5 + h * 1.039, dy + h * 0.414, dx + i * h * 1.5 + h * 1.036, dy + h * 0.229, dx + i * h * 1.5 + h * 0.924, dy + h * 0.115);
				path.curveTo(dx + i * h * 1.5 + h * 0.812, dy, dx + i * h * 1.5 + h * 0.631, dy, dx + i * h * 1.5 + h * 0.519, dy + h * 0.115);
				path.curveTo(dx + i * h * 1.5 + h * 0.408, dy, dx + i * h * 1.5 + h * 0.227, dy, dx + i * h * 1.5 + h * 0.115, dy + h * 0.115);
				path.curveTo(dx + i * h * 1.5 + h * 0.03, dy + h * 0.229, dx + i * h * 1.5, dy + h * 0.414, dx + i * h * 1.5 + h * 0.123, dy + h * 0.54);
				path.close();
			}
		}
	}
};

//**********************************************************************************************************************************************************
//Volume Slider
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupVolumeSlider.prototype = new mxShapeMockup();
mxShapeMockupVolumeSlider.prototype.constructor = mxShapeMockupVolumeSlider;

mxShapeMockupVolumeSlider.prototype.origWidth = 250;
mxShapeMockupVolumeSlider.prototype.origHeight = 30;
mxShapeMockupVolumeSlider.prototype.origAspect = mxShapeMockupVolumeSlider.prototype.origWidth / mxShapeMockupVolumeSlider.prototype.origHeight;

function mxShapeMockupVolumeSlider(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupVolumeSlider.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.controlBarPlay = document.createElement('v:shape');
	this.configureVmlShape(this.controlBarPlay);
	node.appendChild(this.controlBarPlay);

	this.playAndSpeaker = document.createElement('v:shape');
	this.configureVmlShape(this.playAndSpeaker);
	node.appendChild(this.playAndSpeaker);

	this.progressBar = document.createElement('v:shape');
	this.configureVmlShape(this.progressBar);
	node.appendChild(this.progressBar);

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

mxShapeMockupVolumeSlider.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.controlBarPlay = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.controlBarPlay);
	this.playAndSpeaker = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.playAndSpeaker);
	this.progressBar = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.progressBar);
	this.controlBarLines = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.controlBarLines);
	this.videoButton = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.videoButton);
	return this.g;
};

mxShapeMockupVolumeSlider.prototype.redrawVml = function()
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

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.controlBarPlay.path = this.createPath(arg, 'controlBarPlay');
	this.controlBarPlay.filled = 'true';
	this.controlBarPlay.fillcolor = fillColor;
	this.controlBarPlay.strokecolor = strokeColor;

	this.playAndSpeaker.path = this.createPath(arg, 'playAndSpeaker');
	this.playAndSpeaker.fillcolor = strokeColor;
	this.playAndSpeaker.strokecolor = 'none';

	this.progressBar.path = this.createPath(arg, 'progressBar');
	this.progressBar.fillcolor = strokeColor;
	this.progressBar.strokecolor = 'none';

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

mxShapeMockupVolumeSlider.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var barPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_POS, '20');
	barPos = Math.max(0, barPos);
	barPos = Math.min(100, barPos);
	arg.barPos = barPos;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.controlBarPlay.setAttribute('d', this.createPath(arg, 'controlBarPlay'));
	this.controlBarPlay.setAttribute('fill', fillColor);
	this.controlBarPlay.setAttribute('stroke', strokeColor);

	this.playAndSpeaker.setAttribute('d', this.createPath(arg, 'playAndSpeaker'));
	this.playAndSpeaker.setAttribute('fill', strokeColor);
	this.playAndSpeaker.setAttribute('stroke', 'none');

	this.progressBar.setAttribute('d', this.createPath(arg, 'progressBar'));
	this.progressBar.setAttribute('fill', strokeColor);
	this.progressBar.setAttribute('stroke', 'none');

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

mxShapeMockupVolumeSlider.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	//only the progress bar handle needs to be drawn
	var controlBarHeight = 25 * this.scale;
	var h = Math.max(arg.h, controlBarHeight);
	var w = Math.max(arg.w, 3.5 * controlBarHeight);
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'playAndSpeaker')
	{
		var speakerStartX = dx + w - controlBarHeight;
		var speakerStartY = dy + (h - controlBarHeight) * 0.5;
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
		var barMin = dx;
		var barMax = dx + w - controlBarHeight * 1.3;
		var videoBarStartY = dy + (h - controlBarHeight) * 0.5;
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
		//now we draw the video progress bar
		var videoBarStartX = dx;
		var videoBarStartY = dy + (h - controlBarHeight) * 0.5;
		var videoBarEndX = dx + w - controlBarHeight * 1.3;
		path.moveTo(videoBarStartX, videoBarStartY + controlBarHeight * 0.35 );
		path.lineTo(videoBarEndX, videoBarStartY + controlBarHeight * 0.35 );
		path.lineTo(videoBarEndX, videoBarStartY + controlBarHeight * 0.65 );
		path.lineTo(videoBarStartX, videoBarStartY + controlBarHeight * 0.65 );
		path.close();
	}
	else if (shape === 'controlBarLines')
	{
		var soundStartX = dx + w - controlBarHeight;
		var soundStartY = dy + (h - controlBarHeight) * 0.5;
		path.moveTo(soundStartX + controlBarHeight * 0.4, soundStartY + controlBarHeight * 0.35);
		path.arcTo(soundStartX + controlBarHeight * 0.4, soundStartY + controlBarHeight * 0.35, controlBarHeight * 0.2, controlBarHeight * 0.3, 0, 0, 1, soundStartX + controlBarHeight * 0.4, soundStartY + controlBarHeight * 0.65);
		path.moveTo(soundStartX + controlBarHeight * 0.425, soundStartY + controlBarHeight * 0.25);
		path.arcTo(soundStartX + controlBarHeight * 0.425, soundStartY + controlBarHeight * 0.25, controlBarHeight * 0.225, controlBarHeight * 0.35, 0, 0, 1, soundStartX + controlBarHeight * 0.425, soundStartY + controlBarHeight * 0.75);
		path.moveTo(soundStartX + controlBarHeight * 0.5, soundStartY + controlBarHeight * 0.2);
		path.arcTo(soundStartX + controlBarHeight * 0.5, soundStartY + controlBarHeight * 0.2, controlBarHeight * 0.25, controlBarHeight * 0.4, 0, 0, 1, soundStartX + controlBarHeight * 0.5, soundStartY + controlBarHeight * 0.8);

	}
	else if (shape === 'videoButton')
	{
		var barMin = dx;
		var barMax = dx + w - controlBarHeight * 1.3;
		var barRange = barMax - barMin;
		var barPos = barRange * arg.barPos / 100;
		var barEnd = barMin + barPos;
		var videoBarStartY = dy + (h - controlBarHeight) * 0.5;
		path.ellipse(barEnd - controlBarHeight * 0.25, videoBarStartY + controlBarHeight * 0.25, controlBarHeight * 0.5, controlBarHeight * 0.5);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Volume
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupVolume.prototype = new mxShapeMockup();
mxShapeMockupVolume.prototype.constructor = mxShapeMockupVolume;

mxShapeMockupVolume.prototype.origWidth = 50;
mxShapeMockupVolume.prototype.origHeight = 50;
mxShapeMockupVolume.prototype.origAspect = mxShapeMockupVolume.prototype.origWidth / mxShapeMockupVolume.prototype.origHeight;

function mxShapeMockupVolume(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupVolume.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.speaker = document.createElement('v:shape');
	this.configureVmlShape(this.speaker);
	node.appendChild(this.speaker);

	this.waves = document.createElement('v:shape');
	this.configureVmlShape(this.waves);
	node.appendChild(this.waves);

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

mxShapeMockupVolume.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.speaker = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.speaker);
	this.waves = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.waves);
	return this.g;
};

mxShapeMockupVolume.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.speaker);
	this.updateVmlShape(this.waves);

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');

	this.background.path = this.createPath(arg, 'background');
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.speaker.path = this.createPath(arg, 'speaker');
	this.speaker.fillcolor = strokeColor;
	this.speaker.strokecolor = strokeColor;
	this.speaker.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.waves.path = this.createPath(arg, 'waves');
	this.waves.fillcolor = 'none';
	this.waves.strokecolor = strokeColor;
	this.waves.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupVolume.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', fillColor);

	this.speaker.setAttribute('d', this.createPath(arg, 'speaker'));
	this.speaker.setAttribute('fill', strokeColor);
	this.speaker.setAttribute('stroke', strokeColor);
	this.speaker.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.waves.setAttribute('d', this.createPath(arg, 'waves'));
	this.waves.setAttribute('fill', 'none');
	this.waves.setAttribute('stroke', strokeColor);
	this.waves.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupVolume.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.95, dy);
		path.arcTo(dx + w * 0.95, dy, w * 0.05, h * 0.05, 0, 0, 1, dx + w, dy + h * 0.05);
		path.lineTo(dx + w, dy + h  * 0.95);
		path.arcTo(dx + w, dy + h  * 0.95, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.95, dy + h);
		path.lineTo(dx + w * 0.05, dy + h);
		path.arcTo(dx + w * 0.05, dy + h, w * 0.05, h * 0.05, 0, 0, 1, dx, dy + h * 0.95);
		path.lineTo(dx, dy + h  * 0.05);
		path.arcTo(dx, dy + h  * 0.05, w * 0.05, h * 0.05, 0, 0, 1, dx + w * 0.05, dy);
		path.close();
	}
	else if (shape === 'speaker')
	{
		path.moveTo(dx + w * 0.45, dy + h * 0.35);
		path.lineTo(dx + w * 0.6, dy + h * 0.15);
		path.lineTo(dx + w * 0.6, dy + h * 0.85);
		path.lineTo(dx + w * 0.45, dy + h * 0.65);
		path.lineTo(dx + w * 0.3, dy + h * 0.65);
		path.lineTo(dx + w * 0.3, dy + h * 0.35);
		path.close();
	}
	else if (shape === 'waves')
	{
		path.moveTo(dx + w * 0.65, dy + h * 0.35);
		path.arcTo(dx + w * 0.65, dy + h * 0.35, w * 0.1, h * 0.17, 0, 0, 1, dx + w * 0.65, dy + h * 0.65);
		path.moveTo(dx + w * 0.67, dy + h * 0.3);
		path.arcTo(dx + w * 0.67, dy + h * 0.3, w * 0.17, h * 0.235, 0, 0, 1, dx + w * 0.67, dy + h * 0.7);
		path.moveTo(dx + w * 0.695, dy + h * 0.25);
		path.arcTo(dx + w * 0.695, dy + h * 0.25, w * 0.21, h * 0.29, 0, 0, 1, dx + w * 0.695, dy + h * 0.75);
	}
};

//**********************************************************************************************************************************************************
//Horizontal Ruler
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorRuler.prototype = new mxShapeMockup();
mxShapeMockupHorRuler.prototype.constructor = mxShapeMockupHorRuler;

mxShapeMockupHorRuler.prototype.origWidth = 350;
mxShapeMockupHorRuler.prototype.origHeight = 20;
mxShapeMockupHorRuler.prototype.origAspect = mxShapeMockupHorRuler.prototype.origWidth / mxShapeMockupHorRuler.prototype.origHeight;

mxShapeMockupHorRuler.prototype.cst = {
		RULER_FACE_UP : 'faceUp',
		RULER_FACE_DOWN : 'faceDown',
		RULER_FACE_LEFT : 'faceLeft',
		RULER_FACE_RIGHT : 'faceRight'
};

function mxShapeMockupHorRuler(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupHorRuler.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.rulerMarks = document.createElement('v:shape');
	this.configureVmlShape(this.rulerMarks);
	node.appendChild(this.rulerMarks);

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

mxShapeMockupHorRuler.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.rulerMarks = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.rulerMarks);
	return this.g;
};

mxShapeMockupHorRuler.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	arg.unitSize = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.UNIT_SIZE, '5');
	arg.rulerOrientation = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.RULER_ORIENTATION, mxShapeMockupVerRuler.prototype.cst.RULER_FACE_DOWN);

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.rulerMarks);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.rulerMarks.path = this.createPath(arg, 'rulerMarks');

	this.background.strokecolor = strokeColor;

	this.rulerMarks.strokecolor = strokeColor;
	this.rulerMarks.fillcolor = 'none';
	this.rulerMarks.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupHorRuler.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	arg.unitSize = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.UNIT_SIZE, '10');

	if (arg.unitSize === '0')
	{
		arg.unitSize = '1';
	}

	arg.rulerOrientation = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.RULER_ORIENTATION, mxShapeMockupVerRuler.prototype.cst.RULER_FACE_DOWN);

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.rulerMarks.setAttribute('d', this.createPath(arg, 'rulerMarks'));

	this.innerNode.setAttribute('stroke', strokeColor);
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.rulerMarks.setAttribute('stroke', strokeColor);
	this.rulerMarks.setAttribute('fill', 'none');
	this.rulerMarks.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupHorRuler.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var w = arg.w;
	var h = arg.h;
	var unitSize = parseFloat(arg.unitSize) * this.scale;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + w, dy);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx, dy + h);
		path.close();
	}
	else if (shape === 'rulerMarks')
	{
		var currX = unitSize;
		var i = 1;

		if (arg.rulerOrientation === mxShapeMockupVerRuler.prototype.cst.RULER_FACE_DOWN)
		{
			while (currX < w)
			{
				var remainder = i % 10;

				if (remainder === 0)
				{
					path.moveTo(dx + currX, dy + h * 0.5);
					path.lineTo(dx + currX, dy + h);
				}
				else if ( remainder === 5)
				{
					path.moveTo(dx + currX, dy + h * 0.7);
					path.lineTo(dx + currX, dy + h);
				}
				else
				{
					path.moveTo(dx + currX, dy + h * 0.8);
					path.lineTo(dx + currX, dy + h);
				}

				currX = currX + unitSize;
				i = i + 1;
			}
		}
		else if (arg.rulerOrientation === mxShapeMockupVerRuler.prototype.cst.RULER_FACE_UP)
		{
			while (currX < w)
			{
				var remainder = i % 10;

				if (remainder === 0)
				{
					path.moveTo(dx + currX, dy + h * 0.5);
					path.lineTo(dx + currX, dy);
				}
				else if ( remainder === 5)
				{
					path.moveTo(dx + currX, dy + h * 0.3);
					path.lineTo(dx + currX, dy);
				}
				else
				{
					path.moveTo(dx + currX, dy + h * 0.2);
					path.lineTo(dx + currX, dy);
				}

				currX = currX + unitSize;
				i = i + 1;
			}
		}
	}
};

//**********************************************************************************************************************************************************
//Vertical Ruler
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupVerRuler.prototype = new mxShapeMockupHorRuler();
mxShapeMockupVerRuler.prototype.constructor = mxShapeMockupVerRuler;

mxShapeMockupVerRuler.prototype.origWidth = 20;
mxShapeMockupVerRuler.prototype.origHeight = 350;
mxShapeMockupVerRuler.prototype.origAspect = mxShapeMockupVerRuler.prototype.origWidth / mxShapeMockupVerRuler.prototype.origHeight;

function mxShapeMockupVerRuler(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerRuler.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var w = arg.w;
	var h = arg.h;
	var unitSize = parseFloat(arg.unitSize) * this.scale;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx + w, dy);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx, dy + h);
		path.close();
	}
	else if (shape === 'rulerMarks')
	{
		var currY = unitSize;
		var i = 1;

		if (arg.rulerOrientation === mxShapeMockupVerRuler.prototype.cst.RULER_FACE_RIGHT)
		{
			while (currY < h)
			{
				var remainder = i % 10;

				if (remainder === 0)
				{
					path.moveTo(dx + w * 0.5, dy + currY);
					path.lineTo(dx + w, dy + currY);
				}
				else if ( remainder === 5)
				{
					path.moveTo(dx + w * 0.7, dy + currY);
					path.lineTo(dx + w, dy + currY);
				}
				else
				{
					path.moveTo(dx + w * 0.8, dy + currY);
					path.lineTo(dx + w, dy + currY);
				}

				currY = currY + unitSize;
				i = i + 1;
			}
		}
		else if (arg.rulerOrientation === mxShapeMockupVerRuler.prototype.cst.RULER_FACE_LEFT)
		{
			while (currY < h)
			{
				var remainder = i % 10;

				if (remainder === 0)
				{
					path.moveTo(dx + w * 0.5, dy + currY);
					path.lineTo(dx, dy + currY);
				}
				else if ( remainder === 5)
				{
					path.moveTo(dx + w * 0.3, dy + currY);
					path.lineTo(dx, dy + currY);
				}
				else
				{
					path.moveTo(dx + w * 0.2, dy + currY);
					path.lineTo(dx, dy + currY);
				}

				currY = currY + unitSize;
				i = i + 1;
			}
		}
	}
};