//**********************************************************************************************************************************************************
//Cover Flow
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupCoverFlow.prototype = new mxShapeMockup();
mxShapeMockupCoverFlow.prototype.constructor = mxShapeMockupCoverFlow;

mxShapeMockupCoverFlow.prototype.origWidth = 400;
mxShapeMockupCoverFlow.prototype.origHeight = 200;
mxShapeMockupCoverFlow.prototype.origAspect = mxShapeMockupCoverFlow.prototype.origWidth / mxShapeMockupCoverFlow.prototype.origHeight;

function mxShapeMockupCoverFlow(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupCoverFlow.prototype.createVml = function()
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

mxShapeMockupCoverFlow.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	return this.g;
};

mxShapeMockupCoverFlow.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);

	this.background.path = this.createPath(arg, 'background');
	this.updateRotation();
};

mxShapeMockupCoverFlow.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
};

mxShapeMockupCoverFlow.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.0924, dy + h * 0.07);
		path.lineTo(dx + w * 0.005, dy + h * 0.01);
		path.lineTo(dx + w * 0.005, dy + h * 0.99);
		path.lineTo(dx + w * 0.0924, dy + h * 0.93);

		path.moveTo(dx + w * 0.1774, dy + h * 0.09);
		path.lineTo(dx + w * 0.0924, dy + h * 0.01);
		path.lineTo(dx + w * 0.0924, dy + h * 0.99);
		path.lineTo(dx + w * 0.1774, dy + h * 0.91);

		path.moveTo(dx + w * 0.3373, dy + h * 0.22);
		path.lineTo(dx + w * 0.1774, dy + h * 0.01);
		path.lineTo(dx + w * 0.1774, dy + h * 0.99);
		path.lineTo(dx + w * 0.3373, dy + h * 0.78);

		path.moveTo(dx + w * 0.912, dy + h * 0.07);
		path.lineTo(dx + w * 0.998, dy + h * 0.01);
		path.lineTo(dx + w * 0.998, dy + h * 0.99);
		path.lineTo(dx + w * 0.912, dy + h * 0.93);

		path.moveTo(dx + w * 0.8271, dy + h * 0.09);
		path.lineTo(dx + w * 0.912, dy + h * 0.01);
		path.lineTo(dx + w * 0.912, dy + h * 0.99);
		path.lineTo(dx + w * 0.8271, dy + h * 0.91);

		path.moveTo(dx + w * 0.6672, dy + h * 0.22);
		path.lineTo(dx + w * 0.8271, dy + h * 0.01);
		path.lineTo(dx + w * 0.8271, dy + h * 0.99);
		path.lineTo(dx + w * 0.6672, dy + h * 0.78);

		path.moveTo(dx + w * 0.3373, dy + h * 0.005);
		path.lineTo(dx + w * 0.3373, dy + h * 0.995);
		path.lineTo(dx + w * 0.6672, dy + h * 0.995);
		path.lineTo(dx + w * 0.6672, dy + h * 0.005);
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Horizontal Scrollbar
//**********************************************************************************************************************************************************
/**
* Extends mxShapeMockup.
*/
mxShapeMockupHorScrollBar.prototype = new mxShapeMockup();
mxShapeMockupHorScrollBar.prototype.constructor = mxShapeMockupHorScrollBar;

mxShapeMockupHorScrollBar.prototype.origWidth = 200;
mxShapeMockupHorScrollBar.prototype.origHeight = 20;
mxShapeMockupHorScrollBar.prototype.origAspect = mxShapeMockupHorScrollBar.prototype.origWidth / mxShapeMockupHorScrollBar.prototype.origHeight;

function mxShapeMockupHorScrollBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupHorScrollBar.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.foreground = document.createElement('v:shape');
	this.configureVmlShape(this.foreground);
	node.appendChild(this.foreground);

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

mxShapeMockupHorScrollBar.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.foreground = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.foreground);
	return this.g;
};

mxShapeMockupHorScrollBar.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.foreground);
	var barPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_POS, '20');
	barPos = Math.max(0, barPos);
	barPos = Math.min(100, barPos);
	arg.barPos = barPos;

	this.background.path = this.createPath(arg, 'background');
	this.background.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');

	this.foreground.path = this.createPath(arg, 'foreground');

	this.foreground.stroked = 'false';
	this.foreground.fillcolor = strokeColor;
	this.foreground.strokecolor = 'none';

	this.updateRotation();
};

mxShapeMockupHorScrollBar.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var barPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_POS, '20');
	barPos = Math.max(0, barPos);
	barPos = Math.min(100, barPos);
	arg.barPos = barPos;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');

	this.foreground.setAttribute('d', this.createPath(arg, 'foreground'));
	this.foreground.setAttribute('fill', strokeColor);
	this.foreground.setAttribute('stroke', 'none');

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('fill', fillColor);

	this.updateRotation();
};

mxShapeMockupHorScrollBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var h = 20 * this.scale;
	var buttonX = 20 * this.scale;
	var w = Math.max(arg.w, 2 * buttonX);
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx + w, dy);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx, dy + h);
		path.lineTo(dx, dy);
		path.close();
		path.moveTo(dx + buttonX, dy);
		path.lineTo(dx + buttonX, dy + h);
		path.moveTo(dx + w - buttonX, dy);
		path.lineTo(dx + w - buttonX, dy + h);
	}
	else if (shape === 'foreground')
	{
		path.moveTo(dx + buttonX * 0.2, dy + h * 0.5);
		path.lineTo(dx + buttonX * 0.8, dy + h * 0.2);
		path.lineTo(dx + buttonX * 0.8, dy + h * 0.8);
		path.close();
		path.moveTo(dx + w - buttonX * 0.2, dy + h * 0.5);
		path.lineTo(dx + w - buttonX * 0.8, dy + h * 0.2);
		path.lineTo(dx + w - buttonX * 0.8, dy + h * 0.8);
		path.close();

		//draw the handle based on arg.barPos
		var barWidth = 60 * this.scale;
		var barMin = buttonX;
		var barMax = w - buttonX;
		barWidth = Math.min(barWidth, barMax - barMin);
		var barCenterMin = barMin + barWidth / 2;
		var barCenterMax = barMax - barWidth / 2;
		var barCenterRange = barCenterMax - barCenterMin;
		var barCenterPos = barCenterRange * arg.barPos / 100;
		var barStart = barMin + barCenterPos;

		path.moveTo(dx + barStart, dy + h * 0.15);
		path.lineTo(dx + barStart + barWidth, dy + h * 0.15);
		path.lineTo(dx + barStart + barWidth, dy + h * 0.85);
		path.lineTo(dx + barStart, dy + h * 0.85);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Vertical Scrollbar
//**********************************************************************************************************************************************************
/**
* Extends mxShapeMockup.
*/
mxShapeMockupVerScrollBar.prototype = new mxShapeMockupHorScrollBar();
mxShapeMockupVerScrollBar.prototype.constructor = mxShapeMockupVerScrollBar;

mxShapeMockupVerScrollBar.prototype.origWidth = 20;
mxShapeMockupVerScrollBar.prototype.origHeight = 200;
mxShapeMockupVerScrollBar.prototype.origAspect = mxShapeMockupVerScrollBar.prototype.origWidth / mxShapeMockupVerScrollBar.prototype.origHeight;

function mxShapeMockupVerScrollBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupHorScrollBar.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerScrollBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = 20 * this.scale;
	var buttonY = 20 * this.scale;
	var h = Math.max(arg.h, 2 * buttonY);
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy);
		path.lineTo(dx, dy);
		path.close();
		path.moveTo(dx, dy + buttonY);
		path.lineTo(dx + w, dy + buttonY);
		path.moveTo(dx, dy + h - buttonY);
		path.lineTo(dx + w, dy + h - buttonY);
	}
	else if (shape === 'foreground')
	{
		path.moveTo(dx + w * 0.5, dy + buttonY * 0.2);
		path.lineTo(dx + w * 0.2, dy + buttonY * 0.8);
		path.lineTo(dx + w * 0.8, dy + buttonY * 0.8);
		path.close();
		path.moveTo(dx + w * 0.5, dy + h - buttonY * 0.2);
		path.lineTo(dx + w * 0.2, dy + h - buttonY * 0.8);
		path.lineTo(dx + w * 0.8, dy + h - buttonY * 0.8);
		path.close();

		//draw the handle based on arg.barPos
		var barHeight = 60 * this.scale;
		var barMin = buttonY;
		var barMax = h - buttonY;
		barHeight = Math.min(barHeight, barMax - barMin);
		var barCenterMin = barMin + barHeight / 2;
		var barCenterMax = barMax - barHeight / 2;
		var barCenterRange = barCenterMax - barCenterMin;
		var barCenterPos = barCenterRange * arg.barPos / 100;
		var barStart = barMin + barCenterPos;

		path.moveTo(dx + w * 0.15, dy + barStart);
		path.lineTo(dx + w * 0.15, dy + barStart + barHeight);
		path.lineTo(dx + w * 0.85, dy + barStart + barHeight);
		path.lineTo(dx + w * 0.85, dy + barStart);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Map Navigator
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupMapNavigator.prototype = new mxShapeMockup();
mxShapeMockupMapNavigator.prototype.constructor = mxShapeMockupMapNavigator;

mxShapeMockupMapNavigator.prototype.origWidth = 60;
mxShapeMockupMapNavigator.prototype.origHeight = 100;
mxShapeMockupMapNavigator.prototype.origAspect = mxShapeMockupMapNavigator.prototype.origWidth / mxShapeMockupMapNavigator.prototype.origHeight;

function mxShapeMockupMapNavigator(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
	this.fixedAspect = true;
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupMapNavigator.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.bgShape = document.createElement('v:shape');
	this.configureVmlShape(this.bgShape);
	node.appendChild(this.bgShape);

	this.notFilledShapes = document.createElement('v:shape');
	this.configureVmlShape(this.notFilledShapes);
	node.appendChild(this.notFilledShapes);

	this.filledShapes = document.createElement('v:shape');
	this.configureVmlShape(this.filledShapes);
	node.appendChild(this.filledShapes);

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

mxShapeMockupMapNavigator.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.bgShape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.bgShape);
	this.notFilledShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.notFilledShapes);
	this.filledShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.filledShapes);

	return this.g;
};

mxShapeMockupMapNavigator.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#000000');
	var fillColor2 = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FILL_COLOR2, '#000000');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.bgShape);
	this.updateVmlShape(this.notFilledShapes);
	this.updateVmlShape(this.filledShapes);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.bgShape.path = this.createPath(arg, 'bgShape');
	this.notFilledShapes.path = this.createPath(arg, 'notFilledShapes');
	this.filledShapes.path = this.createPath(arg, 'filledShapes');

	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.bgShape.strokecolor = strokeColor;
	this.bgShape.fillcolor = fillColor;
	this.bgShape.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.notFilledShapes.strokecolor = strokeColor;
	this.notFilledShapes.fillcolor = 'none';
	this.notFilledShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.filledShapes.strokecolor = strokeColor;
	this.filledShapes.fillcolor = fillColor2;
	this.filledShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupMapNavigator.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var fillColor2 = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FILL_COLOR2, 'none');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.bgShape.setAttribute('d', this.createPath(arg, 'bgShape'));
	this.notFilledShapes.setAttribute('d', this.createPath(arg, 'notFilledShapes'));
	this.filledShapes.setAttribute('d', this.createPath(arg, 'filledShapes'));

	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);
	this.innerNode.setAttribute('fill', fillColor);
	this.bgShape.setAttribute('stroke', strokeColor);
	this.bgShape.setAttribute('fill', fillColor);
	this.bgShape.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.notFilledShapes.setAttribute('stroke', strokeColor);
	this.notFilledShapes.setAttribute('fill', 'none');
	this.notFilledShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.filledShapes.setAttribute('stroke', strokeColor);
	this.filledShapes.setAttribute('fill', fillColor2);
	this.filledShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupMapNavigator.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		path.moveTo(dx + w * 0.35, dy + h * 0.584);
		path.lineTo(dx + w * 0.35, dy + h);
		path.lineTo(dx + w * 0.65, dy + h);
		path.lineTo(dx + w * 0.65, dy + h * 0.584);
	}
	else if (shape === 'bgShape')
	{
		path.ellipse(dx, dy, w, w);
		path.close;
	}
	else if (shape === 'notFilledShapes')
	{
		path.ellipse(dx + w * 0.4, dy + h * 0.65, w * 0.2, h * 0.12);
		path.close();
		path.ellipse(dx + w * 0.4, dy + h * 0.85, w * 0.2, h * 0.12);
		path.close();
		path.moveTo(dx + w * 0.5, dy + h * 0.67);
		path.lineTo(dx + w * 0.5, dy + h * 0.75);
		path.moveTo(dx + w * 0.43, dy + h * 0.71);
		path.lineTo(dx + w * 0.57, dy + h * 0.71);
		path.moveTo(dx + w * 0.43, dy + h * 0.91);
		path.lineTo(dx + w * 0.57, dy + h * 0.91);
	}
	else if (shape === 'filledShapes')
	{
		path.moveTo(dx + w * 0.1806, dy + h * 0.34);
		path.lineTo(dx + w * 0.1357, dy + h * 0.366);
		path.lineTo(dx + w * 0.0228, dy + h * 0.3);
		path.lineTo(dx + w * 0.1357, dy + h * 0.234);
		path.lineTo(dx + w * 0.1806, dy + h * 0.26);
		path.lineTo(dx + w * 0.1142, dy + h * 0.3);
		path.close();

		path.moveTo(dx + w * 0.433, dy + h * 0.108);
		path.lineTo(dx + w * 0.3881, dy + h * 0.08);
		path.lineTo(dx + w * 0.4994, dy + h * 0.012);
		path.lineTo(dx + w * 0.6123, dy + h * 0.08);
		path.lineTo(dx + w * 0.5658, dy + h * 0.108);
		path.lineTo(dx + w * 0.4994, dy + h * 0.068);
		path.close();

		path.moveTo(dx + w * 0.8198, dy + h * 0.262);
		path.lineTo(dx + w * 0.868, dy + h * 0.233);
		path.lineTo(dx + w * 0.9776, dy + h * 0.3);
		path.lineTo(dx + w * 0.868, dy + h * 0.367);
		path.lineTo(dx + w * 0.8198, dy + h * 0.341);
		path.lineTo(dx + w * 0.8863, dy + h * 0.3);
		path.close();

		path.moveTo(dx + w * 0.5641, dy + h * 0.493);
		path.lineTo(dx + w * 0.6123, dy + h * 0.522);
		path.lineTo(dx + w * 0.4994, dy + h * 0.588);
		path.lineTo(dx + w * 0.3881, dy + h * 0.521);
		path.lineTo(dx + w * 0.4363, dy + h * 0.493);
		path.lineTo(dx + w * 0.4994, dy + h * 0.533);
		path.close();

		path.moveTo(dx + w * 0.3333, dy + h * 0.32);
		path.lineTo(dx + w * 0.3333, dy + h * 0.28);
		path.lineTo(dx + w * 0.4163, dy + h * 0.3);
		path.close();

		path.moveTo(dx + w * 0.4662, dy + h * 0.2);
		path.lineTo(dx + w * 0.5326, dy + h * 0.2);
		path.lineTo(dx + w * 0.4994, dy + h * 0.25);
		path.close();

		path.moveTo(dx + w * 0.6654, dy + h * 0.28);
		path.lineTo(dx + w * 0.6654, dy + h * 0.32);
		path.lineTo(dx + w * 0.5824, dy + h * 0.3);
		path.close();

		path.moveTo(dx + w * 0.5326, dy + h * 0.4);
		path.lineTo(dx + w * 0.4662, dy + h * 0.4);
		path.lineTo(dx + w * 0.4994, dy + h * 0.35);
		path.close();

	}
};

//**********************************************************************************************************************************************************
//Breadcrumb
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupBreadcrumb.prototype = new mxShapeMockup();
mxShapeMockupBreadcrumb.prototype.constructor = mxShapeMockupBreadcrumb;

mxShapeMockupBreadcrumb.prototype.origWidth = 250;
mxShapeMockupBreadcrumb.prototype.origHeight = 30;
mxShapeMockupBreadcrumb.prototype.origAspect = mxShapeMockupBreadcrumb.prototype.origWidth / mxShapeMockupBreadcrumb.prototype.origHeight;

function mxShapeMockupBreadcrumb(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupBreadcrumb.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LAYER_NAME, 'Button').toString().split(',');
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

mxShapeMockupBreadcrumb.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LAYER_NAME, 'Button').toString().split(',');
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

mxShapeMockupBreadcrumb.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.button);

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LAYER_NAME, 'Button').toString().split(',');
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

			this.buttonWidths[i] = this.getSizeForString(buttonText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		buttonTotalWidth += this.buttonWidths[i];
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

mxShapeMockupBreadcrumb.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var button = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LAYER_NAME, 'Button').toString().split(',');
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
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '0'));

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

		var buttonString = button[i];

		if (this.oldButtonNames[i] !== button[i] || this.scale !== this.oldScale || fontSize !== this.oldFontSize)
		{
			this.buttonWidths[i] = this.getSizeForString(buttonString, fontSize * this.scale, mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
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

mxShapeMockupBreadcrumb.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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

			path.moveTo(dx + currWidth - 3 * this.scale, dy + arg.minHeight * 0.5 - 5 * this.scale);
			path.lineTo(dx + currWidth + 3 * this.scale, dy + arg.minHeight * 0.5);
			path.lineTo(dx + currWidth - 3 * this.scale, dy + arg.minHeight * 0.5 + 5 * this.scale);
		}
	}
};
