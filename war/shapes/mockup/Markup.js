//**********************************************************************************************************************************************************
//Vertical Curly brace
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupVerCurlyBrace.prototype = new mxShapeMockupCoverFlow();
mxShapeMockupVerCurlyBrace.prototype.constructor = mxShapeMockupVerCurlyBrace;

mxShapeMockupVerCurlyBrace.prototype.origWidth = 20;
mxShapeMockupVerCurlyBrace.prototype.origHeight = 100;
mxShapeMockupVerCurlyBrace.prototype.origAspect = mxShapeMockupVerCurlyBrace.prototype.origWidth / mxShapeMockupVerCurlyBrace.prototype.origHeight;

function mxShapeMockupVerCurlyBrace(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupCoverFlow.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerCurlyBrace.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.background.filled = 'false';

	this.background.path = this.createPath(arg, 'background');
	this.updateRotation();
};

mxShapeMockupVerCurlyBrace.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('fill', 'none');
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
};

mxShapeMockupVerCurlyBrace.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w, dy);
		path.arcTo(dx + w, dy, w * 0.5, h * 0.1, 0, 0, 0, dx + w * 0.5, dy + h * 0.1);
		path.lineTo(dx + w * 0.5, dy + h * 0.4);
		path.arcTo(dx + w * 0.5, dy + h * 0.4, w * 0.5, h * 0.1, 0, 0, 1, dx, dy + h * 0.5);
		path.arcTo(dx, dy + h * 0.5, w * 0.5, h * 0.1, 0, 0, 1, dx + w * 0.5, dy + h * 0.6);
		path.lineTo(dx + w * 0.5, dy + h * 0.9);
		path.arcTo(dx + w * 0.5, dy + h * 0.9, w * 0.5, h * 0.1, 0, 0, 0, dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Horizontal Curly brace
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorCurlyBrace.prototype = new mxShapeMockupVerCurlyBrace();
mxShapeMockupHorCurlyBrace.prototype.constructor = mxShapeMockupHorCurlyBrace;

mxShapeMockupHorCurlyBrace.prototype.origWidth = 100;
mxShapeMockupHorCurlyBrace.prototype.origHeight = 20;
mxShapeMockupHorCurlyBrace.prototype.origAspect = mxShapeMockupHorCurlyBrace.prototype.origWidth / mxShapeMockupHorCurlyBrace.prototype.origHeight;

function mxShapeMockupHorCurlyBrace(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupCoverFlow.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupHorCurlyBrace.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy + h);
		path.arcTo(dx, dy + h, w * 0.1, h * 0.5, 0, 0, 1, dx + w * 0.1, dy + h * 0.5);
		path.lineTo(dx + w * 0.4, dy + h * 0.5);
		path.arcTo(dx + w * 0.4, dy + h * 0.5, w * 0.1, h * 0.5, 0, 0, 0, dx + w * 0.5, dy);
		path.arcTo(dx + w * 0.5, dy, w * 0.1, h * 0.5, 0, 0, 0, dx + w * 0.6, dy + h * 0.5);
		path.lineTo(dx + w * 0.9, dy + h * 0.5);
		path.arcTo(dx + w * 0.9, dy + h * 0.5, w * 0.1, h * 0.5, 0, 0, 1, dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Red X
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupRedX.prototype = new mxShapeMockupCoverFlow();
mxShapeMockupRedX.prototype.constructor = mxShapeMockupRedX;

mxShapeMockupRedX.prototype.origWidth = 200;
mxShapeMockupRedX.prototype.origHeight = 100;
mxShapeMockupRedX.prototype.origAspect = mxShapeMockupRedX.prototype.origWidth / mxShapeMockupRedX.prototype.origHeight;

function mxShapeMockupRedX(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupCoverFlow.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupRedX.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.1, dy);
		path.lineTo(dx + w * 0.5, dy + h * 0.4);
		path.lineTo(dx + w * 0.9, dy);
		path.lineTo(dx + w, dy + h * 0.1);
		path.lineTo(dx + w * 0.6, dy + h * 0.5);
		path.lineTo(dx + w, dy + h * 0.9);
		path.lineTo(dx + w * 0.9, dy + h);
		path.lineTo(dx + w * 0.5, dy + h * 0.6);
		path.lineTo(dx + w * 0.1, dy + h);
		path.lineTo(dx, dy + h * 0.9);
		path.lineTo(dx + w * 0.4, dy + h * 0.5);
		path.lineTo(dx, dy + h * 0.1);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Scratch out
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupScratchOut.prototype = new mxShapeMockupVerCurlyBrace();
mxShapeMockupScratchOut.prototype.constructor = mxShapeMockupScratchOut;

mxShapeMockupScratchOut.prototype.origWidth = 200;
mxShapeMockupScratchOut.prototype.origHeight = 100;
mxShapeMockupScratchOut.prototype.origAspect = mxShapeMockupScratchOut.prototype.origWidth / mxShapeMockupScratchOut.prototype.origHeight;

function mxShapeMockupScratchOut(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupCoverFlow.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupScratchOut.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.038, dy + h * 0.095);
		path.curveTo(dx + w * 0.038, dy + h * 0.095, dx + w * 0.289, dy + h * -0.045, dx + w * 0.186, dy + h * 0.05);
		path.curveTo(dx + w * 0.084, dy + h * 0.145, dx + w * -0.046, dy + h * 0.251, dx + w * 0.072, dy + h * 0.208);
		path.curveTo(dx + w * 0.191, dy + h * 0.164, dx + w * 0.522, dy + h * -0.09, dx + w * 0.366, dy + h * 0.062);
		path.curveTo(dx + w * 0.21, dy + h * 0.215, dx + w * -0.094, dy + h * 0.38, dx + w * 0.108, dy + h * 0.304);
		path.curveTo(dx + w * 0.309, dy + h * 0.228, dx + w * 0.73, dy + h * -0.126, dx + w * 0.544, dy + h * 0.096);
		path.curveTo(dx + w * 0.358, dy + h * 0.319, dx + w * -0.168, dy + h * 0.592, dx + w * 0.108, dy + h * 0.476);
		path.curveTo(dx + w * 0.382, dy + h * 0.36, dx + w * 0.972, dy + h * -0.138, dx + w * 0.779, dy + h * 0.114);
		path.curveTo(dx + w * 0.585, dy + h * 0.365, dx + w * -0.12, dy + h * 0.688, dx + w * 0.071, dy + h * 0.639);
		path.curveTo(dx + w * 0.262, dy + h * 0.59, dx + w * 1.174, dy + h * 0.012, dx + w * 0.936, dy + h * 0.238);
		path.curveTo(dx + w * 0.699, dy + h * 0.462, dx + w * -0.216, dy + h * 0.855, dx + w * 0.085, dy + h * 0.806);
		path.curveTo(dx + w * 0.386, dy + h * 0.758, dx + w * 1.185, dy + h * 0.26, dx + w * 0.935, dy + h * 0.534);
		path.curveTo(dx + w * 0.685, dy + h * 0.808, dx + w * -0.186, dy + h * 0.94, dx + w * 0.236, dy + h * 0.895);
		path.curveTo(dx + w * 0.659, dy + h * 0.85, dx + w * 1.095, dy + h * 0.608, dx + w * 0.905, dy + h * 0.769);
		path.curveTo(dx + w * 0.715, dy + h * 0.93, dx + w * 0.286, dy + h * 0.962, dx + w * 0.661, dy + h * 0.931);
	}
};

//**********************************************************************************************************************************************************
//Horizontal Line
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorLine.prototype = new mxShapeMockup();
mxShapeMockupHorLine.prototype.constructor = mxShapeMockupHorLine;

mxShapeMockupHorLine.prototype.origWidth = 200;
mxShapeMockupHorLine.prototype.origHeight = 5;
mxShapeMockupHorLine.prototype.origAspect = mxShapeMockupHorLine.prototype.origWidth / mxShapeMockupHorLine.prototype.origHeight;


function mxShapeMockupHorLine(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupHorLine.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

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

mxShapeMockupHorLine.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	return this.g;
};

mxShapeMockupHorLine.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.background.path = this.createPath(arg, null);
	this.updateRotation();
};

mxShapeMockupHorLine.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, null));
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.updateRotation();
};

mxShapeMockupHorLine.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	path.moveTo(arg.dx, arg.dy + arg.h * 0.5);
	path.lineTo(arg.dx + arg.w, arg.dy + arg.h * 0.5);
};

//**********************************************************************************************************************************************************
//Vertical Line
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupVerLine.prototype = new mxShapeMockupHorLine();
mxShapeMockupVerLine.prototype.constructor = mxShapeMockupVerLine;

function mxShapeMockupVerLine(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerLine.prototype.origWidth = 5;
mxShapeMockupVerLine.prototype.origHeight = 200;
mxShapeMockupVerLine.prototype.origAspect = mxShapeMockupVerLine.prototype.origWidth / mxShapeMockupVerLine.prototype.origHeight;

mxShapeMockupVerLine.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	path.moveTo(arg.dx  + arg.w * 0.5, arg.dy);
	path.lineTo(arg.dx + arg.w * 0.5, arg.dy + arg.h);
};
