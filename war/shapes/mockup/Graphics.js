//**********************************************************************************************************************************************************
//Bar Chart
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupBarChart.prototype = new mxShapeMockup();
mxShapeMockupBarChart.prototype.constructor = mxShapeMockupBarChart;

mxShapeMockupBarChart.prototype.origWidth = 400;
mxShapeMockupBarChart.prototype.origHeight = 200;
mxShapeMockupBarChart.prototype.origAspect = mxShapeMockupBarChart.prototype.origWidth / mxShapeMockupBarChart.prototype.origHeight;

function mxShapeMockupBarChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupBarChart.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.barOne = document.createElement('v:shape');
	this.configureVmlShape(this.barOne);
	node.appendChild(this.barOne);
	this.barOne.strokeweight = Math.max(1, Math.round(this.strokewidth * this.scale)) + 'px';

	this.barTwo = document.createElement('v:shape');
	this.configureVmlShape(this.barTwo);
	node.appendChild(this.barTwo);
	this.barTwo.strokeweight = Math.max(1, Math.round(this.strokewidth * this.scale)) + 'px';

	this.coordSystem= document.createElement('v:shape');
	this.configureVmlShape(this.coordSystem);
	node.appendChild(this.coordSystem);
	this.coordSystem.strokeweight = Math.max(1, Math.round(2 * this.strokewidth * this.scale)) + 'px';
	this.coordSystem.filled = 'false';

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

mxShapeMockupBarChart.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.barOne = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.barOne);
	this.barTwo = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.barTwo);
	this.coordSystem = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.coordSystem);

	return this.g;
};

mxShapeMockupBarChart.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.barOne);
	this.updateVmlShape(this.barTwo);
	this.updateVmlShape(this.coordSystem);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.barOne.path = this.createPath(arg, 'barOne');
	this.barTwo.path = this.createPath(arg, 'barTwo');
	this.coordSystem.path = this.createPath(arg, 'coordSystem');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var barOneColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_ONE_COLOR, 'none');
	var barTwoColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_TWO_COLOR, 'none');
	this.background.strokecolor = 'none';

	this.barOne.strokecolor = strokeColor;

	if (barOneColor !== 'none')
	{
		this.barOne.filled = 'true';
	}

	if (barTwoColor !== 'none')
	{
		this.barTwo.filled = 'true';
	}

	this.barTwo.strokecolor = strokeColor;
	this.barOne.fillcolor = barOneColor;
	this.barTwo.fillcolor = barTwoColor;

	if (strokeColor === 'none')
	{
		this.coordSystem.strokecolor = '#000000';
		this.coordSystem.stroked = true;
	}
	else
	{
		this.coordSystem.strokecolor = strokeColor;
	}

	this.barOne.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.barTwo.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.coordSystem.strokeweight = Math.round(2 * this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupBarChart.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke', 'none');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var barOneColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_ONE_COLOR, 'none');
	var barTwoColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_TWO_COLOR, 'none');

	this.barOne.setAttribute('fill', barOneColor);
	this.barOne.setAttribute('stroke', strokeColor);
	this.barOne.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.barOne.setAttribute('d', this.createPath(arg, 'barOne'));

	this.barTwo.setAttribute('fill', barTwoColor);
	this.barTwo.setAttribute('stroke', strokeColor);
	this.barTwo.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.barTwo.setAttribute('d', this.createPath(arg, 'barTwo'));

	this.coordSystem.setAttribute('fill', 'none');
	this.coordSystem.setAttribute('stroke-width', (Math.max(1, 2 * this.strokewidth * this.scale)));
	this.coordSystem.setAttribute('d', this.createPath(arg, 'coordSystem'));

	if (strokeColor === 'none')
	{
		this.coordSystem.setAttribute('stroke', '#000000');
	}
	else
	{
		this.coordSystem.setAttribute('stroke', strokeColor);
	}
};

mxShapeMockupBarChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy);
		path.close();
	}
	else if (shape === 'barOne')
	{
		path.moveTo(dx, dy + h * 0.2);
		path.lineTo(dx + w * 0.75, dy + h * 0.2);
		path.lineTo(dx + w * 0.75, dy + h * 0.25);
		path.lineTo(dx, dy + h * 0.25);
		path.close();

		path.moveTo(dx, dy + h * 0.45);
		path.lineTo(dx + w * 0.6, dy + h * 0.45);
		path.lineTo(dx + w * 0.6, dy + h * 0.5);
		path.lineTo(dx, dy + h * 0.5);
		path.close();

		path.moveTo(dx, dy + h * 0.7);
		path.lineTo(dx + w * 0.95, dy + h * 0.7);
		path.lineTo(dx + w * 0.95, dy + h * 0.75);
		path.lineTo(dx, dy + h * 0.75);
		path.close();
	}
	else if (shape === 'barTwo')
	{
		path.moveTo(dx, dy + h * 0.25);
		path.lineTo(dx + w * 0.85, dy + h * 0.25);
		path.lineTo(dx + w * 0.85, dy + h * 0.3);
		path.lineTo(dx, dy + h * 0.3);
		path.close();

		path.moveTo(dx, dy + h * 0.5);
		path.lineTo(dx + w * 0.65, dy + h * 0.5);
		path.lineTo(dx + w * 0.65, dy + h * 0.55);
		path.lineTo(dx, dy + h * 0.55);
		path.close();

		path.moveTo(dx, dy + h * 0.75);
		path.lineTo(dx + w * 0.8, dy + h * 0.75);
		path.lineTo(dx + w * 0.8, dy + h * 0.8);
		path.lineTo(dx, dy + h * 0.8);
		path.close();
	}
	else if (shape === 'coordSystem')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Column Chart
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockupBarChart.
 */
mxShapeMockupColumnChart.prototype = new mxShapeMockupBarChart();
mxShapeMockupColumnChart.prototype.constructor = mxShapeMockupColumnChart;

function mxShapeMockupColumnChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupBarChart.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupColumnChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy);
		path.close();
	}
	else if (shape === 'barOne')
	{
		path.moveTo(dx + w * 0.2, dy + h * 0.25);
		path.lineTo(dx + w * 0.2, dy + h);
		path.lineTo(dx + w * 0.25, dy + h);
		path.lineTo(dx + w * 0.25, dy + h * 0.25);
		path.close();

		path.moveTo(dx + w * 0.45, dy + h * 0.4);
		path.lineTo(dx + w * 0.45, dy + h);
		path.lineTo(dx + w * 0.5, dy + h);
		path.lineTo(dx + w * 0.5, dy + h * 0.4);
		path.close();

		path.moveTo(dx + w * 0.7, dy + h * 0.05);
		path.lineTo(dx + w * 0.7, dy + h);
		path.lineTo(dx + w * 0.75, dy + h);
		path.lineTo(dx + w * 0.75, dy + h * 0.05);
		path.close();
	}
	else if (shape === 'barTwo')
	{
		path.moveTo(dx + w * 0.25, dy + h * 0.15);
		path.lineTo(dx + w * 0.25, dy + h);
		path.lineTo(dx + w * 0.3, dy + h);
		path.lineTo(dx + w * 0.3, dy + h * 0.15);
		path.close();

		path.moveTo(dx + w * 0.5, dy + h * 0.35);
		path.lineTo(dx + w * 0.5, dy + h);
		path.lineTo(dx + w * 0.55, dy + h);
		path.lineTo(dx + w * 0.55, dy + h * 0.35);
		path.close();

		path.moveTo(dx + w * 0.75, dy + h * 0.2);
		path.lineTo(dx + w * 0.75, dy + h);
		path.lineTo(dx + w * 0.8, dy + h);
		path.lineTo(dx + w * 0.8, dy + h * 0.2);
		path.close();
	}
	else if (shape === 'coordSystem')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Line Chart
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupLineChart.prototype = new mxShapeMockupBarChart();
mxShapeMockupLineChart.prototype.constructor = mxShapeMockupLineChart;

function mxShapeMockupLineChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockupBarChart.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupLineChart.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.barOne);
	this.updateVmlShape(this.barTwo);
	this.updateVmlShape(this.coordSystem);
	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.barOne.path = this.createPath(arg, 'barOne');
	this.barTwo.path = this.createPath(arg, 'barTwo');
	this.coordSystem.path = this.createPath(arg, 'coordSystem');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var barOneColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_ONE_COLOR, '#000000');
	var barTwoColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_TWO_COLOR, '#000000');
	this.background.strokecolor = 'none';

	this.barOne.strokecolor = barOneColor;
	this.barOne.filled='false';
	this.barTwo.strokecolor = barTwoColor;
	this.barTwo.filled='false';

	if (strokeColor === 'none')
	{
		this.coordSystem.strokecolor = '#000000';
		this.coordSystem.stroked = true;
	}
	else
	{
		this.coordSystem.strokecolor = strokeColor;
	}

	this.barOne.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.barTwo.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.coordSystem.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupLineChart.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke', 'none');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var barOneColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_ONE_COLOR, '#000000');
	var barTwoColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BAR_TWO_COLOR, '#000000');

	this.barOne.setAttribute('fill', 'none');
	this.barOne.setAttribute('stroke', barOneColor);
	this.barOne.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.barOne.setAttribute('d', this.createPath(arg, 'barOne'));

	this.barTwo.setAttribute('fill', 'none');
	this.barTwo.setAttribute('stroke', barTwoColor);
	this.barTwo.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.barTwo.setAttribute('d', this.createPath(arg, 'barTwo'));

	this.coordSystem.setAttribute('fill', 'none');
	this.coordSystem.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.coordSystem.setAttribute('d', this.createPath(arg, 'coordSystem'));

	if (strokeColor === 'none')
	{
		this.coordSystem.setAttribute('stroke', '#000000');
	}
	else
	{
		this.coordSystem.setAttribute('stroke', strokeColor);
	}
};

mxShapeMockupLineChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy);
		path.close();
	}
	else if (shape === 'barOne')
	{
		path.moveTo(dx , dy + h);
		path.lineTo(dx + w * 0.3, dy + h * 0.65);
		path.lineTo(dx + w * 0.6, dy + h * 0.6);
		path.lineTo(dx + w * 0.9, dy + h * 0.35);
	}
	else if (shape === 'barTwo')
	{
		path.moveTo(dx, dy + h);
		path.lineTo(dx + w * 0.3, dy + h * 0.5);
		path.lineTo(dx + w * 0.6, dy + h * 0.74);
		path.lineTo(dx + w * 0.9, dy + h * 0.24);
	}
	else if (shape === 'coordSystem')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Pie Chart
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupPieChart.prototype = new mxShapeMockup();
mxShapeMockupPieChart.prototype.constructor = mxShapeMockupPieChart;

mxShapeMockupPieChart.prototype.origWidth = 200;
mxShapeMockupPieChart.prototype.origHeight = 200;
mxShapeMockupPieChart.prototype.origAspect = mxShapeMockupPieChart.prototype.origWidth / mxShapeMockupPieChart.prototype.origHeight;

function mxShapeMockupPieChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupPieChart.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var val = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.VAL, '1').toString().split(',');
	this.partNum = val.length;
	this.part = new Array();

	for (var i = 0; i < val.length; i++)
	{
		this.part.push(document.createElement('v:shape'));
		this.configureVmlShape(this.part[i]);
		node.appendChild(this.part[i]);
	}

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

mxShapeMockupPieChart.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	var val = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.VAL, '1').toString().split(',');
	this.partNum = val.length;
	this.part = new Array();

	for (var i = 0; i < this.partNum; i++)
	{
		this.part.push(document.createElementNS(mxConstants.NS_SVG, 'path'));
		this.g.appendChild(this.part[i]);
	}

	return this.g;
};

mxShapeMockupPieChart.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);

	var val = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.VAL, '1').toString().split(',');
	var newPartNum = val.length;

	if ((this.part === null || typeof this.part === 'undefined') && newPartNum > 0)
	{
		this.part = new Array();
	}

	if (newPartNum > this.partNum)
	{
		// we have to add some elements
		for (var i = this.partNum; i < newPartNum; i++)
		{
			this.part.push(document.createElement('v:shape'));
			this.configureVmlShape(this.part[i]);
			this.node.appendChild(this.part[i]);
		}
	}
	else if (newPartNum < this.partNum)
	{
		// we have to remove some elements
		for (var i = newPartNum; i < this.partNum; i++)
		{
			this.g.removeChild(this.part[i]);
		}

		for (var i = newPartNum; i < this.partNum; i++)
		{
			this.part.pop();
		}
	}

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');

	this.partNum = newPartNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none').split(',');

	var total = 0;

	for (var i = 0; i < this.partNum; i++)
	{
		total = total + parseInt(val[i], 10);
	}

	for (var i = 0; i < this.partNum; i++)
	{
		var beginPerc = 0; // the percentage where the current part begins
		var endPerc = 0; // the percentage where the current part ends

		for (var j = 0; j < i; j++)
		{
			beginPerc = beginPerc + parseInt(val[j], 10) / total;
		}

		var currPerc = parseInt(val[i], 10) / total;
		endPerc = currPerc + beginPerc;
		arg.beginPerc = beginPerc;
		arg.endPerc = endPerc;

		this.updateVmlShape(this.part[i]);
		this.part[i].path = this.createPath(arg, 'part');

		if (fillColor[i] !== 'none')
		{
			this.part[i].filled = 'true';
		}

		this.part[i].strokecolor = strokeColor;
		this.part[i].fillcolor = fillColor[i];
		this.part[i].strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	}

	this.updateRotation();
};

mxShapeMockupPieChart.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke', 'none');

	var val = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.VAL, '1').toString().split(',');
	var newPartNum = val.length;

	if ((this.part === null || typeof this.part === 'undefined') && newPartNum > 0)
	{
		this.part = new Array();
	}

	if (newPartNum > this.partNum)
	{
		// we have to add some elements
		for (var i = this.partNum; i < newPartNum; i++)
		{
			this.part.push(document.createElementNS(mxConstants.NS_SVG, 'path'));
			this.g.appendChild(this.part[i]);
		}
	}
	else if (newPartNum < this.partNum)
	{ 
		// we have to remove some elements
		for (var i = newPartNum; i < this.partNum; i++)
		{
			this.g.removeChild(this.part[i]);
		}

		for (var i = newPartNum; i < this.partNum; i++)
		{
			this.part.pop();
		}
	}
	this.partNum = newPartNum;
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none').split(',');

	var total = 0;

	for (var i = 0; i < this.partNum; i++)
	{
		total = total + parseInt(val[i], 10);
	}

	for (var i = 0; i < this.partNum; i++)
	{
		var beginPerc = 0; // the percentage where the current part begins
		var endPerc = 0; // the percentage where the current part ends

		for (var j = 0; j < i; j++)
		{
			beginPerc = beginPerc + parseInt(val[j], 10) / total;
		}

		var currPerc = parseInt(val[i], 10) / total;
		endPerc = currPerc + beginPerc;
		arg.beginPerc = beginPerc;
		arg.endPerc = endPerc;

		this.part[i].setAttribute('d', this.createPath(arg, 'part'));
		this.part[i].setAttribute('fill', fillColor[i]);
		this.part[i].setAttribute('stroke', strokeColor);
		this.part[i].setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	}

	this.innerNode.setAttribute('fill', fillColor[0]);
	this.updateRotation();
};

mxShapeMockupPieChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.ellipse(dx, dy, w, h);
		path.close();
	}
	else if (shape === 'part')
	{
		var beginPerc = arg.beginPerc;
		var endPerc = arg.endPerc;

		path.moveTo(dx + w * 0.5, dy + h * 0.5);
		var startAngle = 2 * Math.PI * beginPerc;
		var x1 = -Math.sin(startAngle);
		var y1 = -Math.cos(startAngle);
		x1 = dx + w * 0.5 + w * x1 * 0.5;
		y1 = dy + h * 0.5 + h * y1 * 0.5;
		path.lineTo(x1, y1);

		var endAngle = 2 * Math.PI * endPerc;
		var x2 = -Math.sin(endAngle);
		var y2 = -Math.cos(endAngle);
		x2 = dx + w * 0.5 + w * x2 * 0.5;
		y2 = dy + h * 0.5 + h * y2 * 0.5;

		var largeArc=1;

		if (endPerc - beginPerc <= 0.5)
		{
			largeArc=0;
		}

		// the zeroes are intentional to avoid a mxUtils.arcToCurves limitation
		path.arcTo(x1, y1, w * 0.5000001, h * 0.5000001, 0, largeArc, 0, x2 * 1.0001, y2 * 1.0001);
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Image Placeholder
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupImgPlaceholder.prototype = new mxShapeMockup();
mxShapeMockupImgPlaceholder.prototype.constructor = mxShapeMockupImgPlaceholder;

mxShapeMockupImgPlaceholder.prototype.origWidth = 200;
mxShapeMockupImgPlaceholder.prototype.origHeight = 200;
mxShapeMockupImgPlaceholder.prototype.origAspect = mxShapeMockupImgPlaceholder.prototype.origWidth / mxShapeMockupImgPlaceholder.prototype.origHeight;


function mxShapeMockupImgPlaceholder(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupImgPlaceholder.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.crosses = document.createElement('v:shape');
	this.configureVmlShape(this.crosses);
	node.appendChild(this.crosses);

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

mxShapeMockupImgPlaceholder.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.crosses = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.crosses);
	return this.g;
};

mxShapeMockupImgPlaceholder.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	arg.gridSize = new Array();
	arg.gridSize = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.GRID_SIZE, '3,3').split(',');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.crosses);

	this.background.path = this.createPath(arg, 'background');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none').split(',');

	this.crosses.path = this.createPath(arg, 'crosses');

	this.crosses.filled = 'false';
	this.crosses.strokecolor = strokeColor;
	this.crosses.fillcolor = fillColor;
	this.crosses.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupImgPlaceholder.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	arg.gridSize = new Array();
	arg.gridSize = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.GRID_SIZE, '3,3').split(',');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.crosses.setAttribute('d', this.createPath(arg, 'crosses'));
	this.crosses.setAttribute('fill', 'none');
	this.crosses.setAttribute('stroke', strokeColor);
	this.crosses.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupImgPlaceholder.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var boxSizeX = arg.w / (parseInt(arg.gridSize[0],10) + (arg.gridSize[0]-1) * 0.5);
	var boxSizeY = arg.h / (parseInt(arg.gridSize[1],10) + (arg.gridSize[1]-1) * 0.5);

	if (shape === 'background')
	{
		for (var i = 0; i < arg.gridSize[0]; i++)
		{
			for (var j = 0; j < arg.gridSize[1]; j++)
			{
				path.moveTo(dx + boxSizeX * 1.5 * i, dy + boxSizeY * 1.5 * j);
				path.lineTo(dx + boxSizeX * 1.5 * i + boxSizeX, dy + boxSizeY * 1.5 * j);
				path.lineTo(dx + boxSizeX * 1.5 * i + boxSizeX, dy + boxSizeY * 1.5 * j + boxSizeY);
				path.lineTo(dx + boxSizeX * 1.5 * i, dy + boxSizeY * 1.5 * j + boxSizeY);
				path.close();
			}
		}
	}
	else if (shape === 'crosses')
	{
		for (var i = 0; i < arg.gridSize[0]; i++)
		{
			for (var j = 0; j < arg.gridSize[1]; j++)
			{
				path.moveTo(dx + boxSizeX * 1.5 * i, dy + boxSizeY * 1.5 * j);
				path.lineTo(dx + boxSizeX * 1.5 * i + boxSizeX, dy + boxSizeY * 1.5 * j + boxSizeY);
				path.close();
				path.moveTo(dx + boxSizeX * 1.5 * i + boxSizeX, dy + boxSizeY * 1.5 * j);
				path.lineTo(dx + boxSizeX * 1.5 * i, dy + boxSizeY * 1.5 * j + boxSizeY);
				path.close();
			}
		}
	}
};

//**********************************************************************************************************************************************************
//Bubble Chart
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockupBarChart.
 */
mxShapeMockupBubbleChart.prototype = new mxShapeMockupBarChart();
mxShapeMockupBubbleChart.prototype.constructor = mxShapeMockupBubbleChart;

mxShapeMockupBubbleChart.prototype.origWidth = 400;
mxShapeMockupBubbleChart.prototype.origHeight = 200;
mxShapeMockupBubbleChart.prototype.origAspect = mxShapeMockupBubbleChart.prototype.origWidth / mxShapeMockupBubbleChart.prototype.origHeight;

function mxShapeMockupBubbleChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupBubbleChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy);
		path.close();
	}
	else if (shape === 'barOne')
	{
		var cx = w * 0.4;
		var cy = h * 0.45; 
		var r = Math.min(h, w) * 0.14;
		path.ellipse(dx + cx - r, dy + cy - r, 2 * r, 2 * r);
		path.close();

		cx = w * 0.1;
		cy = h * 0.8; 
		r = Math.min(h, w) * 0.1;
		path.ellipse(dx + cx - r, dy + cy - r, 2 * r, 2 * r);
		path.close();

		cx = w * 0.7;
		cy = h * 0.7; 
		r = Math.min(h, w) * 0.22;
		path.ellipse(dx + cx - r, dy + cy - r, 2 * r, 2 * r);
		path.close();
	}
	else if (shape === 'barTwo')
	{
		var cx = w * 0.15;
		var cy = h * 0.25; 
		var r = Math.min(h, w) * 0.19;
		path.ellipse(dx + cx - r, dy + cy - r, 2 * r, 2 * r);
		path.close();

		cx = w * 0.48;
		cy = h * 0.7; 
		r = Math.min(h, w) * 0.12;
		path.ellipse(dx + cx - r, dy + cy - r, 2 * r, 2 * r);
		path.close();

		cx = w * 0.74;
		cy = h * 0.17; 
		r = Math.min(h, w) * 0.1;
		path.ellipse(dx + cx - r, dy + cy - r, 2 * r, 2 * r);
		path.close();
	}
	else if (shape === 'coordSystem')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Gauge
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupGauge.prototype = new mxShapeMockup();
mxShapeMockupGauge.prototype.constructor = mxShapeMockupGauge;

mxShapeMockupGauge.prototype.origWidth = 100;
mxShapeMockupGauge.prototype.origHeight = 100;
mxShapeMockupGauge.prototype.origAspect = mxShapeMockupGauge.prototype.origWidth / mxShapeMockupGauge.prototype.origHeight;

function mxShapeMockupGauge(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
	this.fixedAspect = true;
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupGauge.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.areaMed = document.createElement('v:shape');
	this.configureVmlShape(this.areaMed);
	node.appendChild(this.areaMed);

	this.areaLow = document.createElement('v:shape');
	this.configureVmlShape(this.areaLow);
	node.appendChild(this.areaLow);

	this.areaHigh = document.createElement('v:shape');
	this.configureVmlShape(this.areaHigh);
	node.appendChild(this.areaHigh);

	this.nameTextPath = document.createElement('v:line');
	this.nameTextPath.style.position = 'absolute';
	this.nameTextPath.style.width = '1px';
	this.nameTextPath.style.height = '1px';
	this.nameTextPath.to = '1 0';
	this.nameTextPath.from = '0 0';

	this.nameTextFillElem = document.createElement('v:fill');
	this.nameTextFillElem.on = 'true';
	this.nameTextPath.appendChild(this.nameTextFillElem);

	this.nameTextStrokeElem = document.createElement('v:stroke');
	this.nameTextStrokeElem.on = 'false';
	this.nameTextPath.appendChild(this.nameTextStrokeElem);

	this.nameTextPathElem = document.createElement('v:path');
	this.nameTextPathElem.textpathok = 'true';
	this.nameTextPath.appendChild(this.nameTextPathElem);

	this.nameTextTpElem = document.createElement('v:textpath');
	this.nameTextTpElem.style.cssText = 'v-text-align: center';
	this.nameTextTpElem.on = 'true';
	this.nameTextPath.appendChild(this.nameTextTpElem);

	node.appendChild(this.nameTextPath);

	this.needle = document.createElement('v:shape');
	this.configureVmlShape(this.needle);
	node.appendChild(this.needle);

	this.centerShape = document.createElement('v:shape');
	this.configureVmlShape(this.centerShape);
	node.appendChild(this.centerShape);

	this.outlineShape = document.createElement('v:shape');
	this.configureVmlShape(this.outlineShape);
	node.appendChild(this.outlineShape);

	this.minTextPath = document.createElement('v:line');
	this.minTextPath.style.position = 'absolute';
	this.minTextPath.style.width = '1px';
	this.minTextPath.style.height = '1px';
	this.minTextPath.to = '1 0';
	this.minTextPath.from = '0 0';

	this.minTextFillElem = document.createElement('v:fill');
	this.minTextFillElem.on = 'true';
	this.minTextPath.appendChild(this.minTextFillElem);

	this.minTextStrokeElem = document.createElement('v:stroke');
	this.minTextStrokeElem.on = 'false';
	this.minTextPath.appendChild(this.minTextStrokeElem);

	this.minTextPathElem = document.createElement('v:path');
	this.minTextPathElem.textpathok = 'true';
	this.minTextPath.appendChild(this.minTextPathElem);

	this.minTextTpElem = document.createElement('v:textpath');
	this.minTextTpElem.style.cssText = 'v-text-align: left';
	this.minTextTpElem.on = 'true';
	this.minTextPath.appendChild(this.minTextTpElem);

	node.appendChild(this.minTextPath);

	this.maxTextPath = document.createElement('v:line');
	this.maxTextPath.style.position = 'absolute';
	this.maxTextPath.style.width = '1px';
	this.maxTextPath.style.height = '1px';
	this.maxTextPath.to = '1 0';
	this.maxTextPath.from = '0 0';

	this.maxTextFillElem = document.createElement('v:fill');
	this.maxTextFillElem.on = 'true';
	this.maxTextPath.appendChild(this.maxTextFillElem);

	this.maxTextStrokeElem = document.createElement('v:stroke');
	this.maxTextStrokeElem.on = 'false';
	this.maxTextPath.appendChild(this.maxTextStrokeElem);

	this.maxTextPathElem = document.createElement('v:path');
	this.maxTextPathElem.textpathok = 'true';
	this.maxTextPath.appendChild(this.maxTextPathElem);

	this.maxTextTpElem = document.createElement('v:textpath');
	this.maxTextTpElem.style.cssText = 'v-text-align: right';
	this.maxTextTpElem.on = 'true';
	this.maxTextPath.appendChild(this.maxTextTpElem);

	node.appendChild(this.maxTextPath);

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

mxShapeMockupGauge.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.areaMed = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.areaMed);
	this.areaLow = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.areaLow);
	this.areaHigh = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.areaHigh);

	this.nameText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.nameText);
	this.nameTextNode = document.createTextNode(' ');
	this.nameText.appendChild(this.nameTextNode);

	this.needle = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.needle);
	this.centerShape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.centerShape);
	this.outlineShape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.outlineShape);

	this.minText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.minText);
	this.minTextNode = document.createTextNode(' ');
	this.minText.appendChild(this.minTextNode);

	this.maxText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.maxText);
	this.maxTextNode = document.createTextNode(' ');
	this.maxText.appendChild(this.maxTextNode);

	return this.g;
};

mxShapeMockupGauge.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	var gaugePos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.GAUGE_POS, '20');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var nameText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAME_TEXT, 'CPU[%]').toString();
	var minText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.MIN_TEXT, '0').toString();
	var maxText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.MAX_TEXT, '100').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	this.fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, 12);
	var lowColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LOW_COLOR, '#888888');
	var medColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.MED_COLOR, '#aaaaaa');
	var highColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HIGH_COLOR, '#444444');

	gaugePos = Math.max(0, gaugePos);
	gaugePos = Math.min(100, gaugePos);
	arg.gaugePos = gaugePos;

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.areaMed);
	this.updateVmlShape(this.areaLow);
	this.updateVmlShape(this.areaHigh);
	this.updateVmlShape(this.needle);
	this.updateVmlShape(this.centerShape);
	this.updateVmlShape(this.outlineShape);

	this.background.path = this.createPath(arg, 'background');
	this.areaMed.path = this.createPath(arg, 'areaMed');
	this.areaLow.path = this.createPath(arg, 'areaLow');
	this.areaHigh.path = this.createPath(arg, 'areaHigh');
	this.needle.path = this.createPath(arg, 'needle');
	this.centerShape.path = this.createPath(arg, 'centerShape');
	this.outlineShape.path = this.createPath(arg, 'outlineShape');

	this.areaMed.fillcolor = medColor;
	this.areaMed.stroked = 'false';

	this.areaLow.fillcolor = lowColor;
	this.areaLow.stroked = 'false';

	this.areaHigh.fillcolor = highColor;
	this.areaHigh.stroked = 'false';

	this.needle.fillcolor = medColor;
	this.needle.strokecolor = strokeColor;

	this.centerShape.fillcolor = strokeColor;
	this.centerShape.stroked = 'false';

	this.outlineShape.filled = 'false';
	this.outlineShape.strokecolor = strokeColor;

	var smallerDim = Math.min(arg.w, arg.h);

	this.updateVmlShape(this.nameTextPath);
	this.nameTextFillElem.color = fontColor;
	this.nameTextTpElem.style.fontSize = Math.round(this.fontSize * this.scale * smallerDim * 0.01) + 'px';
	this.nameTextPath.to = Math.round(arg.dx + arg.w * 0.5 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.32);
	this.nameTextPath.from = Math.round(arg.dx + arg.w * 0.5 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.32);
	this.nameTextPath.style.width = '1px';
	this.nameTextPath.style.height = '1px';
	this.nameTextTpElem.string = nameText;

	this.updateVmlShape(this.minTextPath);
	this.minTextFillElem.color = fontColor;
	this.minTextTpElem.style.fontSize = Math.round(this.fontSize * this.scale * smallerDim * 0.0075) + 'px';
	this.minTextPath.to = Math.round(arg.dx + arg.w * 0.2 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.84);
	this.minTextPath.from = Math.round(arg.dx + arg.w * 0.2 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.84);
	this.minTextPath.style.width = '1px';
	this.minTextPath.style.height = '1px';
	this.minTextTpElem.string = minText;

	this.updateVmlShape(this.maxTextPath);
	this.maxTextFillElem.color = fontColor;
	this.maxTextTpElem.style.fontSize = Math.round(this.fontSize * this.scale * smallerDim * 0.0075) + 'px';
	this.maxTextPath.to = Math.round(arg.dx + arg.w * 0.8 + 1) + ' ' + Math.round(arg.dy + arg.h * 0.84);
	this.maxTextPath.from = Math.round(arg.dx + arg.w * 0.8 - 1) + ' ' + Math.round(arg.dy + arg.h * 0.84);
	this.maxTextPath.style.width = '1px';
	this.maxTextPath.style.height = '1px';
	this.maxTextTpElem.string = maxText;

	this.updateRotation();
};

mxShapeMockupGauge.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var gaugePos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.GAUGE_POS, '0');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var nameText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAME_TEXT, 'CPU[%]').toString();
	var minText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.MIN_TEXT, '0').toString();
	var maxText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.MAX_TEXT, '100').toString();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000').toString().split(',');
	this.fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, 12);
	var lowColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LOW_COLOR, '#888888');
	var medColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.MED_COLOR, '#aaaaaa');
	var highColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HIGH_COLOR, '#444444');

	gaugePos = Math.max(0, gaugePos);
	gaugePos = Math.min(100, gaugePos);
	arg.gaugePos = gaugePos;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.areaMed.setAttribute('d', this.createPath(arg, 'areaMed'));
	this.areaLow.setAttribute('d', this.createPath(arg, 'areaLow'));
	this.areaHigh.setAttribute('d', this.createPath(arg, 'areaHigh'));
	this.needle.setAttribute('d', this.createPath(arg, 'needle'));
	this.centerShape.setAttribute('d', this.createPath(arg, 'centerShape'));
	this.outlineShape.setAttribute('d', this.createPath(arg, 'outlineShape'));


	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.areaMed.setAttribute('fill', medColor);
	this.areaMed.setAttribute('stroke', 'none');

	this.areaLow.setAttribute('fill', lowColor);
	this.areaLow.setAttribute('stroke', 'none');

	this.areaHigh.setAttribute('fill', highColor);
	this.areaHigh.setAttribute('stroke', 'none');

	this.needle.setAttribute('fill', medColor);
	this.needle.setAttribute('stroke', strokeColor);
	this.needle.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.centerShape.setAttribute('fill', strokeColor);
	this.centerShape.setAttribute('stroke', 'none');

	this.outlineShape.setAttribute('fill', 'none');
	this.outlineShape.setAttribute('stroke', strokeColor);
	this.outlineShape.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	var smallerDim = Math.min(arg.w, arg.h);

	this.nameText.setAttribute('fill', fontColor);
	this.nameText.setAttribute('font-size', this.fontSize * this.scale * smallerDim * 0.01);
	this.nameText.setAttribute('text-anchor', 'middle');
	this.nameText.setAttribute('x', this.bounds.x + arg.dx + arg.w * 0.5);
	this.nameText.setAttribute('y', this.bounds.y + arg.dy + arg.h * 0.35);

	if (this.nameTextNode !== null || typeof this.nameTextNode !== 'undefined')
	{
		this.nameText.removeChild(this.nameTextNode);
	}

	this.nameTextNode = document.createTextNode(nameText);
	this.nameText.appendChild(this.nameTextNode);

	this.minText.setAttribute('fill', fontColor);
	this.minText.setAttribute('font-size', this.fontSize * this.scale * smallerDim * 0.0075);
	this.minText.setAttribute('text-anchor', 'start');
	this.minText.setAttribute('x', this.bounds.x + arg.dx + arg.w * 0.2);
	this.minText.setAttribute('y', this.bounds.y + arg.dy + arg.h * 0.87);

	if (this.minTextNode !== null || typeof this.minTextNode !== 'undefined')
	{
		this.minText.removeChild(this.minTextNode);
	}

	this.minTextNode = document.createTextNode(minText);
	this.minText.appendChild(this.minTextNode);

	this.maxText.setAttribute('fill', fontColor);
	this.maxText.setAttribute('font-size', this.fontSize * this.scale * smallerDim * 0.0075);
	this.maxText.setAttribute('text-anchor', 'end');
	this.maxText.setAttribute('x', this.bounds.x + arg.dx + arg.w * 0.8);
	this.maxText.setAttribute('y', this.bounds.y + arg.dy + arg.h * 0.87);

	if (this.maxTextNode !== null || typeof this.maxTextNode !== 'undefined')
	{
		this.maxText.removeChild(this.maxTextNode);
	}

	this.maxTextNode = document.createTextNode(maxText);
	this.maxText.appendChild(this.maxTextNode);


	this.updateRotation();
};

mxShapeMockupGauge.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var h = arg.h;
	var w = arg.w;

	if (shape === 'background')
	{
		path.ellipse(dx, dy, w, h);
		path.close();
	}
	else if (shape === 'areaMed')
	{
		path.moveTo(dx + w * 0.05, dy + h * 0.5);
		path.arcTo(dx + w * 0.05, dy + h * 0.5, w * 0.4, h * 0.4, 0, 0, 1, dx + w * 0.95, dy + h * 0.5);
		path.lineTo(dx + w, dy + h * 0.5);
		path.arcTo(dx + w, dy + h * 0.5, w * 0.5, h * 0.5, 0, 0, 0, dx, dy + h * 0.5);
		path.close();
	}
	else if (shape === 'areaLow')
	{
		path.moveTo(dx + w * 0.05, dy + h * 0.5);
		path.arcTo(dx + w * 0.05, dy + h * 0.5, w * 0.45, h * 0.45, 0, 0, 0, dx + w * 0.182, dy + h * 0.818);
		path.lineTo(dx + w * 0.146, dy + h * 0.854);
		path.arcTo(dx + w * 0.146, dy + h * 0.854, w * 0.5, h * 0.5, 0, 0, 1, dx, dy + h * 0.5);
		path.close();
	}
	else if (shape === 'areaHigh')
	{
		path.moveTo(dx + w, dy + h * 0.5);
		path.arcTo(dx + w, dy + h * 0.5, w * 0.5, h * 0.5, 0, 0, 1, dx + w * 0.854, dy + h * 0.854);
		path.lineTo(dx + w * 0.818, dy + h * 0.818);
		path.arcTo(dx + w * 0.818, dy + h * 0.818, w * 0.45, h * 0.45, 0, 0, 0, dx + w * 0.95, dy + h * 0.5);
		path.close();
	}
	else if (shape === 'needle')
	{
		var needlePos = 0.75 * (2 * Math.PI * parseFloat(arg.gaugePos) / 100) + 1.25 * Math.PI;

		var x1 = w * 0.5 + h * 0.38 * Math.sin(needlePos);
		var y1 = h * 0.5 - h * 0.38 * Math.cos(needlePos);
		var x2 = 0;
		var y2 = 0;
		path.moveTo(dx + x1, dy + y1);

		x1 = w * 0.5 + w * 0.05 * Math.cos(needlePos);
		y1 = h * 0.5 + w * 0.05 * Math.sin(needlePos);
		path.lineTo(dx + x1, dy + y1);

		x2 = w * 0.5 + h * (-0.05) * Math.sin(needlePos);
		y2 = h * 0.5 - h * (-0.05) * Math.cos(needlePos);
		path.arcTo(dx + x1, dy + y1, w * 0.05, h * 0.05, 0, 0, 1, dx + x2, dy + y2);

		x1 = x2;
		y1 = y2;
		x2 = w * 0.5 - w * 0.05 * Math.cos(needlePos);
		y2 = h * 0.5 - w * 0.05 * Math.sin(needlePos);
		path.arcTo(dx + x1, dy + y1, w * 0.05, h * 0.05, 0, 0, 1, dx + x2, dy + y2);
		path.close();
	}
	else if (shape === 'centerShape')
	{
		path.moveTo(dx + w * 0.49, dy + h * 0.49);
		path.lineTo(dx + w * 0.51, dy + h * 0.49);
		path.lineTo(dx + w * 0.51, dy + h * 0.51);
		path.lineTo(dx + w * 0.49, dy + h * 0.51);
		path.close();
	}
	else if (shape === 'outlineShape')
	{
		path.ellipse(dx, dy, w, h);
		path.close();
		path.moveTo(dx + w * 0.146, dy + h * 0.854);
		path.lineTo(dx + w * 0.219, dy + h * 0.781);
		path.moveTo(dx + w * 0.854, dy + h * 0.854);
		path.lineTo(dx + w * 0.781, dy + h * 0.781);
	}
};

//**********************************************************************************************************************************************************
//Plot Chart
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupPlotChart.prototype = new mxShapeMockup();
mxShapeMockupPlotChart.prototype.constructor = mxShapeMockupPlotChart;

mxShapeMockupPlotChart.prototype.origWidth = 400;
mxShapeMockupPlotChart.prototype.origHeight = 200;
mxShapeMockupPlotChart.prototype.origAspect = mxShapeMockupPlotChart.prototype.origWidth / mxShapeMockupPlotChart.prototype.origHeight;

function mxShapeMockupPlotChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupPlotChart.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.shapes1 = document.createElement('v:shape');
	this.configureVmlShape(this.shapes1);
	node.appendChild(this.shapes1);

	this.shapes2 = document.createElement('v:shape');
	this.configureVmlShape(this.shapes2);
	node.appendChild(this.shapes2);

	this.shapes3 = document.createElement('v:shape');
	this.configureVmlShape(this.shapes3);
	node.appendChild(this.shapes3);

	this.coordSystem= document.createElement('v:shape');
	this.configureVmlShape(this.coordSystem);
	node.appendChild(this.coordSystem);
	this.coordSystem.filled = 'false';

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

mxShapeMockupPlotChart.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.shapes1 = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.shapes1);
	this.shapes2 = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.shapes2);
	this.shapes3 = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.shapes3);
	this.coordSystem = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.coordSystem);

	return this.g;
};

mxShapeMockupPlotChart.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.shapes1);
	this.updateVmlShape(this.shapes2);
	this.updateVmlShape(this.shapes3);
	this.updateVmlShape(this.coordSystem);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.shapes1.path = this.createPath(arg, 'shapes1');
	this.shapes2.path = this.createPath(arg, 'shapes2');
	this.shapes3.path = this.createPath(arg, 'shapes3');
	this.coordSystem.path = this.createPath(arg, 'coordSystem');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var shapes1Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES1_COLOR, 'none');
	var shapes2Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES2_COLOR, 'none');
	var shapes3Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES3_COLOR, 'none');
	this.background.strokecolor = 'none';

	this.shapes1.strokecolor = strokeColor;
	this.shapes2.strokecolor = strokeColor;
	this.shapes3.strokecolor = strokeColor;

	this.shapes1.fillcolor = shapes1Color;
	this.shapes1.filled = 'true';
	this.shapes2.fillcolor = shapes2Color;
	this.shapes2.filled = 'true';
	this.shapes3.fillcolor = shapes3Color;
	this.shapes3.filled = 'true';

	if (strokeColor !== 'none')
	{
		this.coordSystem.strokecolor = '#000000';
		this.coordSystem.stroked = 'true';
	}
	else
	{
		this.coordSystem.strokecolor = strokeColor;
		this.coordSystem.stroked = 'false';
	}

	this.shapes1.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.shapes2.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.shapes3.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.coordSystem.strokeweight = Math.round(2 * this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupPlotChart.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke', 'none');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var shapes1Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES1_COLOR, 'none');
	var shapes2Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES2_COLOR, 'none');
	var shapes3Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES3_COLOR, 'none');

	this.shapes1.setAttribute('fill', shapes1Color);
	this.shapes1.setAttribute('stroke', strokeColor);
	this.shapes1.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.shapes1.setAttribute('d', this.createPath(arg, 'shapes1'));

	this.shapes2.setAttribute('fill', shapes2Color);
	this.shapes2.setAttribute('stroke', strokeColor);
	this.shapes2.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.shapes2.setAttribute('d', this.createPath(arg, 'shapes2'));

	this.shapes3.setAttribute('fill', shapes3Color);
	this.shapes3.setAttribute('stroke', strokeColor);
	this.shapes3.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.shapes3.setAttribute('d', this.createPath(arg, 'shapes3'));

	this.coordSystem.setAttribute('fill', 'none');
	this.coordSystem.setAttribute('stroke-width', (Math.max(1, 2 * this.strokewidth * this.scale)));
	this.coordSystem.setAttribute('d', this.createPath(arg, 'coordSystem'));

	if (strokeColor === 'none')
	{
		this.coordSystem.setAttribute('stroke', '#000000');
	}
	else
	{
		this.coordSystem.setAttribute('stroke', strokeColor);
	}
};

mxShapeMockupPlotChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	var shapeSize = Math.min(w, h) * 0.03 * this.scale;

	if (shape === 'background')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy);
		path.close();
	}
	else if (shape === 'shapes1')
	{
		var cx = w * 0.2;
		var cy = h * 0.8;
		path.moveTo(dx + cx - shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();

		cx = w * 0.3;
		cy = h * 0.65;
		path.moveTo(dx + cx - shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();

		cx = w * 0.6;
		cy = h * 0.44;
		path.moveTo(dx + cx - shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();

		cx = w * 0.85;
		cy = h * 0.9;
		path.moveTo(dx + cx - shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();

	}
	else if (shape === 'shapes2')
	{
		var cx = w * 0.08;
		var cy = h * 0.65;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();

		cx = w * 0.58;
		cy = h * 0.85;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();

		cx = w * 0.72;
		cy = h * 0.92;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.5);
		path.lineTo(dx + cx + shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.lineTo(dx + cx - shapeSize * 0.5, dy + cy + shapeSize * 0.5);
		path.close();
	}
	else if (shape === 'shapes3')
	{
		var cx = w * 0.32;
		var cy = h * 0.28;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.75);
		path.lineTo(dx + cx + shapeSize * 0.75, dy + cy);
		path.lineTo(dx + cx, dy + cy + shapeSize * 0.75);
		path.lineTo(dx + cx - shapeSize * 0.75, dy + cy);
		path.close();

		cx = w * 0.92;
		cy = h * 0.45;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.75);
		path.lineTo(dx + cx + shapeSize * 0.75, dy + cy);
		path.lineTo(dx + cx, dy + cy + shapeSize * 0.75);
		path.lineTo(dx + cx - shapeSize * 0.75, dy + cy);
		path.close();

		cx = w * 0.81;
		cy = h * 0.37;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.75);
		path.lineTo(dx + cx + shapeSize * 0.75, dy + cy);
		path.lineTo(dx + cx, dy + cy + shapeSize * 0.75);
		path.lineTo(dx + cx - shapeSize * 0.75, dy + cy);
		path.close();

		cx = w * 0.51;
		cy = h * 0.7;
		path.moveTo(dx + cx, dy + cy - shapeSize * 0.75);
		path.lineTo(dx + cx + shapeSize * 0.75, dy + cy);
		path.lineTo(dx + cx, dy + cy + shapeSize * 0.75);
		path.lineTo(dx + cx - shapeSize * 0.75, dy + cy);
		path.close();

	}
	else if (shape === 'coordSystem')
	{
		path.moveTo(dx, dy);
		path.lineTo(dx, dy + h);
		path.lineTo(dx + w, dy + h);
	}
};

//**********************************************************************************************************************************************************
//Gantt Chart
//**********************************************************************************************************************************************************
/**
 * Extends Horizontal Button Bar.
 */
mxShapeMockupGanttChart.prototype = new mxShapeMockup();
mxShapeMockupGanttChart.prototype.constructor = mxShapeMockupGanttChart;

mxShapeMockupGanttChart.prototype.origWidth = 600;
mxShapeMockupGanttChart.prototype.origHeight = 300;
mxShapeMockupGanttChart.prototype.origAspect = mxShapeMockupGanttChart.prototype.origWidth / mxShapeMockupGanttChart.prototype.origHeight;

function mxShapeMockupGanttChart(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupGanttChart.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.itemNum = 5;
	this.tableTextNum = 14;

	this.numPath = new Array();
	this.numFillElem = new Array();
	this.numStrokeElem = new Array();
	this.numPathElem = new Array();
	this.numTpElem = new Array();

	this.taskPath = new Array();
	this.taskFillElem = new Array();
	this.taskStrokeElem = new Array();
	this.taskPathElem = new Array();
	this.taskTpElem = new Array();

	this.startPath = new Array();
	this.startFillElem = new Array();
	this.startStrokeElem = new Array();
	this.startPathElem = new Array();
	this.startTpElem = new Array();

	this.effortPath = new Array();
	this.effortFillElem = new Array();
	this.effortStrokeElem = new Array();
	this.effortPathElem = new Array();
	this.effortTpElem = new Array();

	this.tablePath = new Array();
	this.tableFillElem = new Array();
	this.tableStrokeElem = new Array();
	this.tablePathElem = new Array();
	this.tableTpElem = new Array();

	this.linesShape = document.createElement('v:shape');
	this.configureVmlShape(this.linesShape);
	node.appendChild(this.linesShape);

	this.tableShape1 = document.createElement('v:shape');
	this.configureVmlShape(this.tableShape1);
	node.appendChild(this.tableShape1);

	this.tableShape2 = document.createElement('v:shape');
	this.configureVmlShape(this.tableShape2);
	node.appendChild(this.tableShape2);

	for (var i = 0; i < this.itemNum; i++)
	{
		this.numPath.push(document.createElement('v:line'));
		this.numPath[i].style.position = 'absolute';
		this.numPath[i].style.width = '1px';
		this.numPath[i].style.height = '1px';
		this.numPath[i].to = '1 0';
		this.numPath[i].from = '0 0';

		this.numFillElem.push(document.createElement('v:fill'));
		this.numFillElem[i].on = 'true';
		this.numPath[i].appendChild(this.numFillElem[i]);

		this.numStrokeElem.push(document.createElement('v:stroke'));
		this.numStrokeElem[i].on = 'false';
		this.numPath[i].appendChild(this.numStrokeElem[i]);

		this.numPathElem.push(document.createElement('v:path'));
		this.numPathElem[i].textpathok = 'true';
		this.numPath[i].appendChild(this.numPathElem[i]);

		this.numTpElem.push(document.createElement('v:textpath'));
		this.numTpElem[i].style.cssText = 'v-text-align: center';
		this.numTpElem[i].on = 'true';
		this.numPath[i].appendChild(this.numTpElem[i]);

		node.appendChild(this.numPath[i]);

		this.taskPath.push(document.createElement('v:line'));
		this.taskPath[i].style.position = 'absolute';
		this.taskPath[i].style.width = '1px';
		this.taskPath[i].style.height = '1px';
		this.taskPath[i].to = '1 0';
		this.taskPath[i].from = '0 0';

		this.taskFillElem.push(document.createElement('v:fill'));
		this.taskFillElem[i].on = 'true';
		this.taskPath[i].appendChild(this.taskFillElem[i]);

		this.taskStrokeElem.push(document.createElement('v:stroke'));
		this.taskStrokeElem[i].on = 'false';
		this.taskPath[i].appendChild(this.taskStrokeElem[i]);

		this.taskPathElem.push(document.createElement('v:path'));
		this.taskPathElem[i].textpathok = 'true';
		this.taskPath[i].appendChild(this.taskPathElem[i]);

		this.taskTpElem.push(document.createElement('v:textpath'));
		this.taskTpElem[i].style.cssText = 'v-text-align: center';
		this.taskTpElem[i].on = 'true';
		this.taskPath[i].appendChild(this.taskTpElem[i]);

		node.appendChild(this.taskPath[i]);

		this.startPath.push(document.createElement('v:line'));
		this.startPath[i].style.position = 'absolute';
		this.startPath[i].style.width = '1px';
		this.startPath[i].style.height = '1px';
		this.startPath[i].to = '1 0';
		this.startPath[i].from = '0 0';

		this.startFillElem.push(document.createElement('v:fill'));
		this.startFillElem[i].on = 'true';
		this.startPath[i].appendChild(this.startFillElem[i]);

		this.startStrokeElem.push(document.createElement('v:stroke'));
		this.startStrokeElem[i].on = 'false';
		this.startPath[i].appendChild(this.startStrokeElem[i]);

		this.startPathElem.push(document.createElement('v:path'));
		this.startPathElem[i].textpathok = 'true';
		this.startPath[i].appendChild(this.startPathElem[i]);

		this.startTpElem.push(document.createElement('v:textpath'));
		this.startTpElem[i].style.cssText = 'v-text-align: center';
		this.startTpElem[i].on = 'true';
		this.startPath[i].appendChild(this.startTpElem[i]);

		node.appendChild(this.startPath[i]);

		this.effortPath.push(document.createElement('v:line'));
		this.effortPath[i].style.position = 'absolute';
		this.effortPath[i].style.width = '1px';
		this.effortPath[i].style.height = '1px';
		this.effortPath[i].to = '1 0';
		this.effortPath[i].from = '0 0';

		this.effortFillElem.push(document.createElement('v:fill'));
		this.effortFillElem[i].on = 'true';
		this.effortPath[i].appendChild(this.effortFillElem[i]);

		this.effortStrokeElem.push(document.createElement('v:stroke'));
		this.effortStrokeElem[i].on = 'false';
		this.effortPath[i].appendChild(this.effortStrokeElem[i]);

		this.effortPathElem.push(document.createElement('v:path'));
		this.effortPathElem[i].textpathok = 'true';
		this.effortPath[i].appendChild(this.effortPathElem[i]);

		this.effortTpElem.push(document.createElement('v:textpath'));
		this.effortTpElem[i].style.cssText = 'v-text-align: center';
		this.effortTpElem[i].on = 'true';
		this.effortPath[i].appendChild(this.effortTpElem[i]);

		node.appendChild(this.effortPath[i]);
	}

	for (var i = 0; i < this.tableTextNum; i++)
	{
		this.tablePath.push(document.createElement('v:line'));
		this.tablePath[i].style.position = 'absolute';
		this.tablePath[i].style.width = '1px';
		this.tablePath[i].style.height = '1px';
		this.tablePath[i].to = '1 0';
		this.tablePath[i].from = '0 0';

		this.tableFillElem.push(document.createElement('v:fill'));
		this.tableFillElem[i].on = 'true';
		this.tablePath[i].appendChild(this.tableFillElem[i]);

		this.tableStrokeElem.push(document.createElement('v:stroke'));
		this.tableStrokeElem[i].on = 'false';
		this.tablePath[i].appendChild(this.tableStrokeElem[i]);

		this.tablePathElem.push(document.createElement('v:path'));
		this.tablePathElem[i].textpathok = 'true';
		this.tablePath[i].appendChild(this.tablePathElem[i]);

		this.tableTpElem.push(document.createElement('v:textpath'));
		this.tableTpElem[i].style.cssText = 'v-text-align: center';
		this.tableTpElem[i].on = 'true';
		this.tablePath[i].appendChild(this.tableTpElem[i]);

		node.appendChild(this.tablePath[i]);
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

mxShapeMockupGanttChart.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.numText = new Array();
	this.taskText = new Array();
	this.startText = new Array();
	this.effortText = new Array();
	this.tableText = new Array();
	this.numTextNode = new Array();
	this.taskTextNode = new Array();
	this.startTextNode = new Array();
	this.effortTextNode = new Array();
	this.tableTextNode = new Array();

	this.itemNum = 5;
	this.tableTextNum = 14;
	this.linesShape = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.linesShape);

	this.tableShape1 = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.tableShape1);

	this.tableShape2 = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.tableShape2);

	for (var i = 0; i < this.itemNum; i++)
	{
		this.numText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.numText[i]);
		this.taskText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.taskText[i]);
		this.startText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.startText[i]);
		this.effortText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.effortText[i]);
	}

	for (var i = 0; i < this.tableTextNum; i++)
	{
		this.tableText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.tableText[i]);
	}

	return this.g;
};

mxShapeMockupGanttChart.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var shapes1Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES1_COLOR, 'none');
	var shapes2Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES2_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.linesShape);
	this.updateVmlShape(this.tableShape1);
	this.updateVmlShape(this.tableShape2);

	this.background.path = this.createPath(arg, 'background');
	this.linesShape.path = this.createPath(arg, 'linesShape');
	this.tableShape1.path = this.createPath(arg, 'tableShape1');
	this.tableShape2.path = this.createPath(arg, 'tableShape2');

	this.linesShape.filled = 'true';
	this.linesShape.fillcolor = fillColor;
	this.linesShape.strokecolor = strokeColor;
	this.linesShape.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.tableShape1.filled = 'true';
	this.tableShape1.fillcolor = shapes1Color;
	this.tableShape1.strokecolor = strokeColor;
	this.tableShape1.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.tableShape2.filled = 'true';
	this.tableShape2.fillcolor = shapes2Color;
	this.tableShape2.strokecolor = strokeColor;
	this.tableShape2.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

//	var finalFontSize = fontSize * this.scale * 0.000005 * arg.w * arg.h;
	var finalFontSize = fontSize * this.scale;

	for (var i = 0; i < this.itemNum; i++)
	{
		this.updateVmlShape(this.numPath[i]);
		this.numFillElem[i].color = textColor;
		this.numTpElem[i].style.fontSize = Math.round(finalFontSize * this.scale) + 'px';
		this.numPath[i].to = (Math.round(arg.dx + arg.w * 0.015 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.numPath[i].from = (Math.round(arg.dx + arg.w * 0.015 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.numPath[i].style.width = '1px';
		this.numPath[i].style.height = '1px';

		if (i === 0)
		{
			this.numTpElem[i].string = '#';
		}
		else
		{
			this.numTpElem[i].string = i;
		}

		this.updateVmlShape(this.taskPath[i]);
		this.taskFillElem[i].color = textColor;
		this.taskTpElem[i].style.fontSize = Math.round(finalFontSize * this.scale) + 'px';
		this.taskPath[i].to = (Math.round(arg.dx + arg.w * 0.065 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.taskPath[i].from = (Math.round(arg.dx + arg.w * 0.065 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.taskPath[i].style.width = '1px';
		this.taskPath[i].style.height = '1px';

		if (i === 0)
		{
			this.taskTpElem[i].string = 'Task';
		}
		else
		{
			this.taskTpElem[i].string = 'Task ' + i;
		}

		this.updateVmlShape(this.startPath[i]);
		this.startFillElem[i].color = textColor;
		this.startTpElem[i].style.fontSize = Math.round(finalFontSize * this.scale) + 'px';
		this.startPath[i].to = (Math.round(arg.dx + arg.w * 0.208 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.startPath[i].from = (Math.round(arg.dx + arg.w * 0.208 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.startPath[i].style.width = '1px';
		this.startPath[i].style.height = '1px';

		if (i === 0)
		{
			this.startTpElem[i].string = 'Start';
		}
		else if (i === 1)
		{
			this.startTpElem[i].string = '18/03/2013 8:00 AM';
		}
		else if (i === 2)
		{
			this.startTpElem[i].string = '18/03/2013 8:00 AM';
		}
		else if (i === 3)
		{
			this.startTpElem[i].string = '19/03/2013 8:00 AM';
		}
		else if (i === 4)
		{
			this.startTpElem[i].string = '21/03/2013 8:00 AM';
		}

		this.updateVmlShape(this.effortPath[i]);
		this.effortFillElem[i].color = textColor;
		this.effortTpElem[i].style.fontSize = Math.round(finalFontSize * this.scale) + 'px';
		this.effortPath[i].to = (Math.round(arg.dx + arg.w * 0.358 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.effortPath[i].from = (Math.round(arg.dx + arg.w * 0.358 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.075 * (i + 1.4));
		this.effortPath[i].style.width = '1px';
		this.effortPath[i].style.height = '1px';

		if (i === 0)
		{
			this.effortTpElem[i].string = 'Effort';
		}
		else if (i === 1)
		{
			this.effortTpElem[i].string = '40 h';
		}
		else if (i === 2)
		{
			this.effortTpElem[i].string = '16 h';
		}
		else if (i === 3)
		{
			this.effortTpElem[i].string = '32 h';
		}
		else if (i === 4)
		{
			this.effortTpElem[i].string = '24 h';
		}
	}

	for (var i = 0; i < this.tableTextNum; i++)
	{
		this.updateVmlShape(this.tablePath[i]);
		this.tableFillElem[i].color = textColor;
		this.tableTpElem[i].style.fontSize = Math.round(finalFontSize * this.scale) + 'px';

		if (i === 0)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.575 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.045);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.575 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.045);
			this.tableTpElem[i].string = '18/03/2013';
		}
		else if (i === 1)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.875 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.045);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.875 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.045);
			this.tableTpElem[i].string = '25/03/2013';
		}
		else if (i === 2)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.425 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.425 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'M';
		}
		else if (i === 3)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.475 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.475 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'T';
		}
		else if (i === 4)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.525 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.525 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'W';
		}
		else if (i === 5)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.575 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.575 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'T';
		}
		else if (i === 6)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.625 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.625 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'F';
		}
		else if (i === 7)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.675 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.675 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'S';
		}
		else if (i === 8)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.725 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.725 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'S';
		}
		else if (i === 9)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.775 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.775 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'M';
		}
		else if (i === 10)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.825 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.825 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'T';
		}
		else if (i === 11)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.875 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.875 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'W';
		}
		else if (i === 12)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.925 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.925 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'T';
		}
		else if (i === 13)
		{
			this.tablePath[i].to = (Math.round(arg.dx + arg.w * 0.975 + 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tablePath[i].from = (Math.round(arg.dx + arg.w * 0.975 - 1)) + ' ' + Math.round(arg.dy + arg.h * 0.1);
			this.tableTpElem[i].string = 'F';
		}

		this.tablePath[i].style.width = '1px';
		this.tablePath[i].style.height = '1px';
	}

	this.updateRotation();

};

mxShapeMockupGanttChart.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var shapes1Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES1_COLOR, 'none');
	var shapes2Color = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SHAPES2_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.linesShape.setAttribute('d', this.createPath(arg, 'linesShape'));
	this.tableShape1.setAttribute('d', this.createPath(arg, 'tableShape1'));
	this.tableShape2.setAttribute('d', this.createPath(arg, 'tableShape2'));

	this.linesShape.setAttribute('fill', fillColor);
	this.linesShape.setAttribute('stroke', strokeColor);
	this.tableShape1.setAttribute('fill', shapes1Color);
	this.tableShape1.setAttribute('stroke', strokeColor);
	this.tableShape2.setAttribute('fill', shapes2Color);
	this.tableShape2.setAttribute('stroke', strokeColor);
	this.linesShape.setAttribute('stroke-width', this.strokewidth * this.scale);
	this.tableShape1.setAttribute('stroke-width', this.strokewidth * this.scale);
	this.tableShape2.setAttribute('stroke-width', this.strokewidth * this.scale);

//	var finalFontSize = fontSize * this.scale * 0.000005 * arg.w * arg.h;
	var finalFontSize = fontSize * this.scale;

	for (var i = 0; i < this.itemNum; i++)
	{
		this.numText[i].setAttribute('fill', textColor);
		this.numText[i].setAttribute('font-size', finalFontSize);
		this.numText[i].setAttribute('text-anchor', 'middle');
		this.numText[i].setAttribute('x', this.bounds.x + arg.w * 0.015);
		this.numText[i].setAttribute('y', this.bounds.y + arg.h * 0.075 * (i + 1.5));

		if (this.numTextNode.length > i)
		{
			this.numText[i].removeChild(this.numTextNode[i]);
		}

		if (i === 0)
		{
			this.numTextNode[i] = document.createTextNode('#');
		}
		else
		{
			this.numTextNode[i] = document.createTextNode(i);
		}

		this.numText[i].appendChild(this.numTextNode[i]);

		this.taskText[i].setAttribute('fill', textColor);
		this.taskText[i].setAttribute('font-size', finalFontSize);
		this.taskText[i].setAttribute('text-anchor', 'middle');
		this.taskText[i].setAttribute('x', this.bounds.x + arg.w * 0.065);
		this.taskText[i].setAttribute('y', this.bounds.y + arg.h * 0.075 * (i + 1.5));

		if (this.taskTextNode.length > i)
		{
			this.taskText[i].removeChild(this.taskTextNode[i]);
		}

		if (i === 0)
		{
			this.taskTextNode[i] = document.createTextNode('Task');
		}
		else
		{
			this.taskTextNode[i] = document.createTextNode('Task ' + i);
		}

		this.taskText[i].appendChild(this.taskTextNode[i]);

		this.startText[i].setAttribute('fill', textColor);
		this.startText[i].setAttribute('font-size', finalFontSize);
		this.startText[i].setAttribute('text-anchor', 'middle');
		this.startText[i].setAttribute('x', this.bounds.x + arg.w * 0.208);
		this.startText[i].setAttribute('y', this.bounds.y + arg.h * 0.075 * (i + 1.5));

		if (this.startTextNode.length > i)
		{
			this.startText[i].removeChild(this.startTextNode[i]);
		}

		if (i === 0)
		{
			this.startTextNode[i] = document.createTextNode('Start');
		}
		else if (i === 1)
		{
			this.startTextNode[i] = document.createTextNode('18/03/2013 8:00 AM');
		}
		else if (i === 2)
		{
			this.startTextNode[i] = document.createTextNode('18/03/2013 8:00 AM');
		}
		else if (i === 3)
		{
			this.startTextNode[i] = document.createTextNode('19/03/2013 8:00 AM');
		}
		else if (i === 4)
		{
			this.startTextNode[i] = document.createTextNode('21/03/2013 8:00 AM');
		}

		this.startText[i].appendChild(this.startTextNode[i]);

		this.effortText[i].setAttribute('fill', textColor);
		this.effortText[i].setAttribute('font-size', finalFontSize);
		this.effortText[i].setAttribute('text-anchor', 'middle');
		this.effortText[i].setAttribute('x', this.bounds.x + arg.w * 0.358);
		this.effortText[i].setAttribute('y', this.bounds.y + arg.h * 0.075 * (i + 1.5));

		if (this.effortTextNode.length > i)
		{
			this.effortText[i].removeChild(this.effortTextNode[i]);
		}

		if (i === 0)
		{
			this.effortTextNode[i] = document.createTextNode('Effort');
		}
		else if (i === 1)
		{
			this.effortTextNode[i] = document.createTextNode('40 h');
		}
		else if (i === 2)
		{
			this.effortTextNode[i] = document.createTextNode('16 h');
		}
		else if (i === 3)
		{
			this.effortTextNode[i] = document.createTextNode('32 h');
		}
		else if (i === 4)
		{
			this.effortTextNode[i] = document.createTextNode('24 h');
		}

		this.effortText[i].appendChild(this.effortTextNode[i]);
	}

	for (var i = 0; i < this.tableTextNum; i++)
	{
		this.tableText[i].setAttribute('fill', textColor);
		this.tableText[i].setAttribute('font-size', finalFontSize);
		this.tableText[i].setAttribute('text-anchor', 'middle');

		if (this.tableTextNode.length > i)
		{
			this.tableText[i].removeChild(this.tableTextNode[i]);
		}

		if (i === 0)
		{
			this.tableTextNode[i] = document.createTextNode('18/03/2013');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.575);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.045);
		}
		else if (i === 1)
		{
			this.tableTextNode[i] = document.createTextNode('25/03/2013');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.875);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.045);
		}
		else if (i === 2)
		{
			this.tableTextNode[i] = document.createTextNode('M');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.425);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 3)
		{
			this.tableTextNode[i] = document.createTextNode('T');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.475);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 4)
		{
			this.tableTextNode[i] = document.createTextNode('W');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.525);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 5)
		{
			this.tableTextNode[i] = document.createTextNode('T');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.575);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 6)
		{
			this.tableTextNode[i] = document.createTextNode('F');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.625);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 7)
		{
			this.tableTextNode[i] = document.createTextNode('S');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.675);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 8)
		{
			this.tableTextNode[i] = document.createTextNode('S');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.725);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 9)
		{
			this.tableTextNode[i] = document.createTextNode('M');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.775);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 10)
		{
			this.tableTextNode[i] = document.createTextNode('T');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.825);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 11)
		{
			this.tableTextNode[i] = document.createTextNode('W');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.875);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 12)
		{
			this.tableTextNode[i] = document.createTextNode('T');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.925);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}
		else if (i === 13)
		{
			this.tableTextNode[i] = document.createTextNode('F');
			this.tableText[i].setAttribute('x', this.bounds.x + arg.w * 0.975);
			this.tableText[i].setAttribute('y', this.bounds.y + arg.h * 0.1125);
		}

		this.tableText[i].appendChild(this.tableTextNode[i]);

	}

	this.updateRotation();
};

mxShapeMockupGanttChart.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	}
	else if (shape === 'linesShape')
	{
		path.moveTo(dx, dy + h * 0.13);
		path.lineTo(dx + w, dy + h * 0.13);
		path.moveTo(dx + w * 0.4, dy);
		path.lineTo(dx + w * 0.4, dy + h);
		path.moveTo(dx + w * 0.4, dy + h * 0.065);
		path.lineTo(dx + w, dy + h * 0.065);

		path.moveTo(dx + w * 0.03, dy);
		path.lineTo(dx + w * 0.03, dy + h * 0.13);
		path.moveTo(dx + w * 0.1, dy);
		path.lineTo(dx + w * 0.1, dy + h * 0.13);
		path.moveTo(dx + w * 0.315, dy);
		path.lineTo(dx + w * 0.315, dy + h * 0.13);

		path.moveTo(dx + w * 0.45, dy + h * 0.065);
		path.lineTo(dx + w * 0.45, dy + h * 0.13);
		path.moveTo(dx + w * 0.5, dy + h * 0.065);
		path.lineTo(dx + w * 0.5, dy + h);
		path.moveTo(dx + w * 0.55, dy + h * 0.065);
		path.lineTo(dx + w * 0.55, dy + h * 0.13);
		path.moveTo(dx + w * 0.6, dy + h * 0.065);
		path.lineTo(dx + w * 0.6, dy + h);
		path.moveTo(dx + w * 0.65, dy + h * 0.065);
		path.lineTo(dx + w * 0.65, dy + h * 0.13);
		path.moveTo(dx + w * 0.7, dy + h * 0.065);
		path.lineTo(dx + w * 0.7, dy + h);
		path.moveTo(dx + w * 0.75, dy);
		path.lineTo(dx + w * 0.75, dy + h * 0.13);
		path.moveTo(dx + w * 0.8, dy + h * 0.065);
		path.lineTo(dx + w * 0.8, dy + h);
		path.moveTo(dx + w * 0.85, dy + h * 0.065);
		path.lineTo(dx + w * 0.85, dy + h * 0.13);
		path.moveTo(dx + w * 0.9, dy + h * 0.065);
		path.lineTo(dx + w * 0.9, dy + h);
		path.moveTo(dx + w * 0.95, dy + h * 0.065);
		path.lineTo(dx + w * 0.95, dy + h * 0.13);
	}
	else if (shape === 'tableShape1')
	{
		path.moveTo(dx + w * 0.41, dy + h * 0.15);
		path.lineTo(dx + w * 0.64, dy + h * 0.15);
		path.lineTo(dx + w * 0.64, dy + h * 0.18);
		path.lineTo(dx + w * 0.625, dy + h * 0.21);
		path.lineTo(dx + w * 0.61, dy + h * 0.18);
		path.lineTo(dx + w * 0.44, dy + h * 0.18);
		path.lineTo(dx + w * 0.425, dy + h * 0.21);
		path.lineTo(dx + w * 0.41, dy + h * 0.18);
		path.close();

		path.moveTo(dx + w * 0.41, dy + h * 0.24);
		path.lineTo(dx + w * 0.49, dy + h * 0.24);
		path.lineTo(dx + w * 0.49, dy + h * 0.275);
		path.lineTo(dx + w * 0.41, dy + h * 0.275);
		path.close();

		path.moveTo(dx + w * 0.46, dy + h * 0.31);
		path.lineTo(dx + w * 0.64, dy + h * 0.31);
		path.lineTo(dx + w * 0.64, dy + h * 0.345);
		path.lineTo(dx + w * 0.46, dy + h * 0.345);
		path.close();

		path.moveTo(dx + w * 0.56, dy + h * 0.39);
		path.lineTo(dx + w * 0.69, dy + h * 0.39);
		path.lineTo(dx + w * 0.69, dy + h * 0.425);
		path.lineTo(dx + w * 0.56, dy + h * 0.425);
		path.close();
	}
	else if (shape === 'tableShape2')
	{
		path.moveTo(dx + w * 0.46, dy + h * 0.32);
		path.lineTo(dx + w * 0.58, dy + h * 0.32);
		path.lineTo(dx + w * 0.58, dy + h * 0.335);
		path.lineTo(dx + w * 0.46, dy + h * 0.335);
		path.close();
	}
};