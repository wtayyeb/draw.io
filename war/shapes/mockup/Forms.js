//**********************************************************************************************************************************************************
//Color picker
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupColorPicker.prototype = new mxShapeMockup();
mxShapeMockupColorPicker.prototype.constructor = mxShapeMockupColorPicker;

mxShapeMockupColorPicker.prototype.origWidth = 40;
mxShapeMockupColorPicker.prototype.origHeight = 40;
mxShapeMockupColorPicker.prototype.origAspect = mxShapeMockupColorPicker.prototype.origWidth / mxShapeMockupColorPicker.prototype.origHeight;

function mxShapeMockupColorPicker(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupColorPicker.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.frame = document.createElement('v:shape');
	this.configureVmlShape(this.frame);
	node.appendChild(this.frame);

	this.button = document.createElement('v:shape');
	this.configureVmlShape(this.button);
	node.appendChild(this.button);

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

mxShapeMockupColorPicker.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.frame = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.frame);
	this.button = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.button);
	return this.g;
};

mxShapeMockupColorPicker.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.frame);
	this.updateVmlShape(this.button);

	this.background.path = this.createPath(arg, 'background');

	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, 'none');
	var buttonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_COLOR, 'none');

	this.frame.path = this.createPath(arg, 'frame');
	this.button.path = this.createPath(arg, 'button');

	this.button.filled = fillColor === 'none' ? 'false' : 'true';
	this.button.stroked = 'false';

	this.frame.filled='true';
	this.frame.fillcolor = strokeColor;

	this.button.fillcolor = buttonColor;
	this.button.strokecolor = strokeColor;

	this.frame.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupColorPicker.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var buttonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_COLOR, 'none').split(',');

	this.frame.setAttribute('d', this.createPath(arg, 'frame'));
	this.frame.setAttribute('fill', strokeColor);
	this.frame.setAttribute('stroke', strokeColor);
	this.frame.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.button.setAttribute('d', this.createPath(arg, 'button'));
	this.button.setAttribute('fill', buttonColor);
	this.button.setAttribute('stroke', 'none');

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupColorPicker.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'frame')
	{
		path.moveTo(dx + w * 0.8, dy + h * 0.8);
		path.lineTo(dx + w * 0.8, dy + h);
		path.lineTo(dx + w, dy + h);
		path.lineTo(dx + w, dy + h * 0.8);
		path.close();
	}
	else if (shape === 'button')
	{
		path.moveTo(dx + w * 0.82, dy + h * 0.82);
		path.lineTo(dx + w * 0.9, dy + h * 0.98);
		path.lineTo(dx + w * 0.98, dy + h * 0.82);
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Check box group
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupCheckBoxGroup.prototype = new mxShapeMockup();
mxShapeMockupCheckBoxGroup.prototype.constructor = mxShapeMockupCheckBoxGroup;

mxShapeMockupCheckBoxGroup.prototype.origWidth = 150;
mxShapeMockupCheckBoxGroup.prototype.origHeight = 135;
mxShapeMockupCheckBoxGroup.prototype.origAspect = mxShapeMockupCheckBoxGroup.prototype.origWidth / mxShapeMockupCheckBoxGroup.prototype.origHeight;

function mxShapeMockupCheckBoxGroup(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupCheckBoxGroup.prototype.createVml = function()
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

	this.enCheckBoxes = document.createElement('v:shape');
	this.configureVmlShape(this.enCheckBoxes);
	node.appendChild(this.enCheckBoxes);

	this.disCheckBoxes = document.createElement('v:shape');
	this.configureVmlShape(this.disCheckBoxes);
	node.appendChild(this.disCheckBoxes);

	this.enCheckMarks = document.createElement('v:shape');
	this.configureVmlShape(this.enCheckMarks);
	node.appendChild(this.enCheckMarks);

	this.disCheckMarks = document.createElement('v:shape');
	this.configureVmlShape(this.disCheckMarks);
	node.appendChild(this.disCheckMarks);

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

mxShapeMockupCheckBoxGroup.prototype.createSvg = function()
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

	this.enCheckBoxes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.enCheckBoxes);

	this.disCheckBoxes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.disCheckBoxes);

	this.enCheckMarks = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.enCheckMarks);

	this.disCheckMarks = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.disCheckMarks);

	for (var i = 0; i < this.boxNum; i++)
	{
		this.boxText.push(document.createElementNS(mxConstants.NS_SVG, 'text'));
		this.g.appendChild(this.boxText[i]);
	}

	return this.g;
};

mxShapeMockupCheckBoxGroup.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.enCheckBoxes);
	this.updateVmlShape(this.disCheckBoxes);
	this.updateVmlShape(this.enCheckMarks);
	this.updateVmlShape(this.disCheckMarks);

	var boxNames = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAMES, 'CheckBox1').toString().split(',');
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
	var frameStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_STROKE_COLOR, 'none');
	var frameFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_FILL_COLOR, 'none');
	var disStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_STROKE_COLOR, 'none');
	var disFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_FILL_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	this.greatestWidth = 0;

	for (var i = 0; i < this.boxNum; i++)
	{
		if (this.oldBoxNames[i] !== boxNames[i] || this.oldScale !== this.scale)
		{
			var boxText = boxNames[i];

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '+')
				{
					boxText = boxText.substring(1);
				}
			}
			else if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '-')
				{
					boxText = boxText.substring(1);
				}
			}

			this.boxWidths[i] = this.getSizeForString(boxText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.boxWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.boxWidths[i];
		}

		if(boxNames[i].charAt(0) === '+')
		{
			this.isSelected[i] = true;
		}
		else
		{
			this.isSelected[i] = false;
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

	this.background.path = this.createPath(arg, 'background');
	this.enCheckBoxes.path = this.createPath(arg, 'enCheckBoxes');
	this.disCheckBoxes.path = this.createPath(arg, 'disCheckBoxes');
	this.enCheckMarks.path = this.createPath(arg, 'enCheckMarks');
	this.disCheckMarks.path = this.createPath(arg, 'disCheckMarks');

	this.background.fillColor = frameFillColor;
	this.background.strokeColor = frameStrokeColor;
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.enCheckBoxes.fillcolor = fillColor;
	this.enCheckBoxes.strokecolor = strokeColor;
	this.enCheckBoxes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.disCheckBoxes.fillcolor = disFillColor;
	this.disCheckBoxes.strokecolor = disStrokeColor;
	this.disCheckBoxes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.enCheckMarks.fillcolor = 'none';
	this.enCheckMarks.strokecolor = strokeColor;
	this.enCheckMarks.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.disCheckMarks.fillcolor = 'none';
	this.disCheckMarks.strokecolor = disStrokeColor;
	this.disCheckMarks.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	//display text
	for (var i = 0; i < this.boxNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);

		var boxText = boxNames[i];

		//coloring the letters depending if the checkbox is disabled or enabled
		if(boxText.charAt(0) === '-' || boxText.charAt(1) === '-')
		{
			this.fillElem[i].color = disStrokeColor;
		}
		else
		{
			this.fillElem[i].color = textColor;
		}

		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		var currX = Math.round(2 * marginOffset +  boxSize);
		var currY = Math.round(marginOffset  + (marginOffset + boxSize) * i + boxSize / 2);
		this.currentPath[i].to = (currX + 1) + ' ' + currY;
		this.currentPath[i].from = (currX - 1) + ' ' + currY;

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';

		if(boxText.charAt(0) === '-')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);
			}
		}
		else if(boxText.charAt(0) === '+')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);
			}
		}

		this.tpElem[i].string = boxText;
	}

	this.updateRotation();

	this.oldBoxNames = boxNames;
	this.oldScale = this.scale;
};

mxShapeMockupCheckBoxGroup.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var boxNames = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAMES, 'CheckBox1').toString().split(',');
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
	var frameStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_STROKE_COLOR, 'none');
	var frameFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_FILL_COLOR, 'none');
	var disStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_STROKE_COLOR, 'none');
	var disFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_FILL_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	this.greatestWidth = 0;

	for (var i = 0; i < this.boxNum; i++)
	{
		if (this.oldBoxNames[i] !== boxNames[i] || this.oldScale !== this.scale)
		{
			var boxText = boxNames[i];

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '+')
				{
					boxText = boxText.substring(1);
				}
			}
			else if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '-')
				{
					boxText = boxText.substring(1);
				}
			}

			this.boxWidths[i] = this.getSizeForString(boxText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.boxWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.boxWidths[i];
		}

		if(boxNames[i].charAt(0) === '+')
		{
			this.isSelected[i] = true;
		}
		else
		{
			this.isSelected[i] = false;
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

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.enCheckBoxes.setAttribute('d', this.createPath(arg, 'enCheckBoxes'));
	this.disCheckBoxes.setAttribute('d', this.createPath(arg, 'disCheckBoxes'));
	this.enCheckMarks.setAttribute('d', this.createPath(arg, 'enCheckMarks'));
	this.disCheckMarks.setAttribute('d', this.createPath(arg, 'disCheckMarks'));

	this.innerNode.setAttribute('fill', frameFillColor);
	this.innerNode.setAttribute('stroke', frameStrokeColor);
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.enCheckBoxes.setAttribute('fill', fillColor);
	this.enCheckBoxes.setAttribute('stroke', strokeColor);
	this.enCheckBoxes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.disCheckBoxes.setAttribute('fill', disFillColor);
	this.disCheckBoxes.setAttribute('stroke', disStrokeColor);
	this.disCheckBoxes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.enCheckMarks.setAttribute('fill', 'none');
	this.enCheckMarks.setAttribute('stroke', strokeColor);
	this.enCheckMarks.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.disCheckMarks.setAttribute('fill', 'none');
	this.disCheckMarks.setAttribute('stroke', disStrokeColor);
	this.disCheckMarks.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	//display text
	for (var i = 0; i < this.boxNum; i++)
	{
		var boxText = boxNames[i];

		//coloring the letters depending if the checkbox is disabled or enabled
		if(boxText.charAt(0) === '-' || boxText.charAt(1) === '-')
		{
			this.boxText[i].setAttribute('fill', disStrokeColor);
		}
		else
		{
			this.boxText[i].setAttribute('fill', textColor);
		}

		this.boxText[i].setAttribute('font-size', fontSize * this.scale);

		this.boxText[i].setAttribute('text-anchor', 'start');
		this.boxText[i].setAttribute('x', this.bounds.x + 2 * marginOffset +  boxSize);
		this.boxText[i].setAttribute('y', this.bounds.y + marginOffset  + (marginOffset + boxSize) * i + boxSize / 2 + fontSize * 0.25 * this.scale);

		if(boxText.charAt(0) === '-')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);
			}
		}
		else if(boxText.charAt(0) === '+')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);
			}
		}

		if (this.boxTextNode.length > i)
		{
			this.boxText[i].removeChild(this.boxTextNode[i]);
		}

		this.boxTextNode[i] = document.createTextNode(boxText);
		this.boxText[i].appendChild(this.boxTextNode[i]);
	}

	this.updateRotation();

	this.oldBoxNames = boxNames;
	this.oldScale = this.scale;
};

mxShapeMockupCheckBoxGroup.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'enCheckBoxes')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if(arg.boxNames[i].charAt(0) !== '-' && arg.boxNames[i].charAt(1) !== '-')
			{
				path.moveTo(dx + arg.marginOffset, 					dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i);
				path.lineTo(dx + arg.marginOffset + arg.boxSize, 	dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i);
				path.lineTo(dx + arg.marginOffset + arg.boxSize, 	dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize);
				path.lineTo(dx + arg.marginOffset, 					dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize);
				path.close();
			}
		}
	}
	else if (shape === 'disCheckBoxes')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if(arg.boxNames[i].charAt(0) === '-' || arg.boxNames[i].charAt(1) === '-')
			{
				path.moveTo(dx + arg.marginOffset, 					dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i);
				path.lineTo(dx + arg.marginOffset + arg.boxSize, 	dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i);
				path.lineTo(dx + arg.marginOffset + arg.boxSize, 	dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize);
				path.lineTo(dx + arg.marginOffset, 					dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize);
				path.close();
			}
		}
	}
	else if (shape === 'enCheckMarks')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if((arg.boxNames[i].charAt(0) === '+' || arg.boxNames[i].charAt(1) === '+') && (arg.boxNames[i].charAt(0) !== '-' && arg.boxNames[i].charAt(1) !== '-'))
			{
				path.moveTo(dx + arg.marginOffset + arg.boxSize * 0.1, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize * 0.6);
				path.lineTo(dx + arg.marginOffset + arg.boxSize * 0.4, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize * 0.9);
				path.lineTo(dx + arg.marginOffset + arg.boxSize * 0.9, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize * 0.1);
			}
		}
	}
	else if (shape === 'disCheckMarks')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if((arg.boxNames[i].charAt(0) === '+' || arg.boxNames[i].charAt(1) === '+') && (arg.boxNames[i].charAt(0) === '-' || arg.boxNames[i].charAt(1) === '-'))
			{
				path.moveTo(dx + arg.marginOffset + arg.boxSize * 0.1, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize * 0.6);
				path.lineTo(dx + arg.marginOffset + arg.boxSize * 0.4, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize * 0.9);
				path.lineTo(dx + arg.marginOffset + arg.boxSize * 0.9, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i + arg.boxSize * 0.1);
			}
		}
	}
};

//**********************************************************************************************************************************************************
//Radio button group
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupRadioButtonGroup.prototype = new mxShapeMockupCheckBoxGroup();
mxShapeMockupRadioButtonGroup.prototype.constructor = mxShapeMockupRadioButtonGroup;

mxShapeMockupRadioButtonGroup.prototype.origWidth = 150;
mxShapeMockupRadioButtonGroup.prototype.origHeight = 135;
mxShapeMockupRadioButtonGroup.prototype.origAspect = mxShapeMockupRadioButtonGroup.prototype.origWidth / mxShapeMockupRadioButtonGroup.prototype.origHeight;

function mxShapeMockupRadioButtonGroup(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupRadioButtonGroup.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.enCheckBoxes);
	this.updateVmlShape(this.disCheckBoxes);
	this.updateVmlShape(this.enCheckMarks);
	this.updateVmlShape(this.disCheckMarks);

	var boxNames = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAMES, 'CheckBox1').toString().split(',');
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
	var frameStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_STROKE_COLOR, 'none');
	var frameFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_FILL_COLOR, 'none');
	var disStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_STROKE_COLOR, 'none');
	var disFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_FILL_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	this.greatestWidth = 0;

	for (var i = 0; i < this.boxNum; i++)
	{
		if (this.oldBoxNames[i] !== boxNames[i] || this.oldScale !== this.scale)
		{
			var boxText = boxNames[i];

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '+')
				{
					boxText = boxText.substring(1);
				}
			}
			else if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '-')
				{
					boxText = boxText.substring(1);
				}
			}

			this.boxWidths[i] = this.getSizeForString(boxText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.boxWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.boxWidths[i];
		}

		if(boxNames[i].charAt(0) === '+')
		{
			this.isSelected[i] = true;
		}
		else
		{
			this.isSelected[i] = false;
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

	this.background.path = this.createPath(arg, 'background');
	this.enCheckBoxes.path = this.createPath(arg, 'enCheckBoxes');
	this.disCheckBoxes.path = this.createPath(arg, 'disCheckBoxes');
	this.enCheckMarks.path = this.createPath(arg, 'enCheckMarks');
	this.disCheckMarks.path = this.createPath(arg, 'disCheckMarks');

	this.background.fillColor = frameFillColor;
	this.background.strokeColor = frameStrokeColor;
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.enCheckBoxes.fillcolor = fillColor;
	this.enCheckBoxes.strokecolor = strokeColor;
	this.enCheckBoxes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.disCheckBoxes.fillcolor = disFillColor;
	this.disCheckBoxes.strokecolor = disStrokeColor;
	this.disCheckBoxes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.enCheckMarks.fillcolor = strokeColor;
	this.enCheckMarks.strokecolor = strokeColor;
	this.enCheckMarks.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.disCheckMarks.fillcolor = disStrokeColor;
	this.disCheckMarks.strokecolor = disStrokeColor;
	this.disCheckMarks.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	//display text
	for (var i = 0; i < this.boxNum; i++)
	{
		this.updateVmlShape(this.currentPath[i]);

		var boxText = boxNames[i];

		//coloring the letters depending if the checkbox is disabled or enabled
		if(boxText.charAt(0) === '-' || boxText.charAt(1) === '-')
		{
			this.fillElem[i].color = disStrokeColor;
		}
		else
		{
			this.fillElem[i].color = textColor;
		}

		this.tpElem[i].style.fontSize = Math.round(fontSize * this.scale) + 'px';

		var currX = Math.round(2 * marginOffset +  boxSize);
		var currY = Math.round(marginOffset  + (marginOffset + boxSize) * i + boxSize / 2);
		this.currentPath[i].to = (currX + 1) + ' ' + currY;
		this.currentPath[i].from = (currX - 1) + ' ' + currY;

		this.currentPath[i].style.width = '1px';
		this.currentPath[i].style.height = '1px';

		if(boxText.charAt(0) === '-')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);
			}
		}
		else if(boxText.charAt(0) === '+')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);
			}
		}

		this.tpElem[i].string = boxText;
	}

	this.updateRotation();

	this.oldBoxNames = boxNames;
	this.oldScale = this.scale;
};

mxShapeMockupRadioButtonGroup.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var boxNames = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.NAMES, 'CheckBox1').toString().split(',');
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
	var frameStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_STROKE_COLOR, 'none');
	var frameFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.FRAME_FILL_COLOR, 'none');
	var disStrokeColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_STROKE_COLOR, 'none');
	var disFillColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.DIS_FILL_COLOR, 'none');
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

	this.greatestWidth = 0;

	for (var i = 0; i < this.boxNum; i++)
	{
		if (this.oldBoxNames[i] !== boxNames[i] || this.oldScale !== this.scale)
		{
			var boxText = boxNames[i];

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '+')
				{
					boxText = boxText.substring(1);
				}
			}
			else if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);

				if(boxText.charAt(0) === '-')
				{
					boxText = boxText.substring(1);
				}
			}

			this.boxWidths[i] = this.getSizeForString(boxText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width  * this.scale;
		}

		if (this.boxWidths[i] > this.greatestWidth)
		{
			this.greatestWidth = this.boxWidths[i];
		}

		if(boxNames[i].charAt(0) === '+')
		{
			this.isSelected[i] = true;
		}
		else
		{
			this.isSelected[i] = false;
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

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.enCheckBoxes.setAttribute('d', this.createPath(arg, 'enCheckBoxes'));
	this.disCheckBoxes.setAttribute('d', this.createPath(arg, 'disCheckBoxes'));
	this.enCheckMarks.setAttribute('d', this.createPath(arg, 'enCheckMarks'));
	this.disCheckMarks.setAttribute('d', this.createPath(arg, 'disCheckMarks'));

	this.innerNode.setAttribute('fill', frameFillColor);
	this.innerNode.setAttribute('stroke', frameStrokeColor);
	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.enCheckBoxes.setAttribute('fill', fillColor);
	this.enCheckBoxes.setAttribute('stroke', strokeColor);
	this.enCheckBoxes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.disCheckBoxes.setAttribute('fill', disFillColor);
	this.disCheckBoxes.setAttribute('stroke', disStrokeColor);
	this.disCheckBoxes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.enCheckMarks.setAttribute('fill', strokeColor);
	this.enCheckMarks.setAttribute('stroke', strokeColor);
	this.enCheckMarks.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.disCheckMarks.setAttribute('fill', disStrokeColor);
	this.disCheckMarks.setAttribute('stroke', disStrokeColor);
	this.disCheckMarks.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	//display text
	for (var i = 0; i < this.boxNum; i++)
	{
		var boxText = boxNames[i];

		//coloring the letters depending if the checkbox is disabled or enabled
		if(boxText.charAt(0) === '-' || boxText.charAt(1) === '-')
		{
			this.boxText[i].setAttribute('fill', disStrokeColor);
		}
		else
		{
			this.boxText[i].setAttribute('fill', textColor);
		}

		this.boxText[i].setAttribute('font-size', fontSize * this.scale);

		this.boxText[i].setAttribute('text-anchor', 'start');
		this.boxText[i].setAttribute('x', this.bounds.x + 2 * marginOffset +  boxSize);
		this.boxText[i].setAttribute('y', this.bounds.y + marginOffset  + (marginOffset + boxSize) * i + boxSize / 2 + fontSize * 0.25 * this.scale);

		if(boxText.charAt(0) === '-')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '+')
			{
				boxText = boxText.substring(1);
			}
		}
		else if(boxText.charAt(0) === '+')
		{
			boxText = boxText.substring(1);

			if(boxText.charAt(0) === '-')
			{
				boxText = boxText.substring(1);
			}
		}

		if (this.boxTextNode.length > i)
		{
			this.boxText[i].removeChild(this.boxTextNode[i]);
		}

		this.boxTextNode[i] = document.createTextNode(boxText);
		this.boxText[i].appendChild(this.boxTextNode[i]);
	}

	this.updateRotation();

	this.oldBoxNames = boxNames;
	this.oldScale = this.scale;
};

mxShapeMockupRadioButtonGroup.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'enCheckBoxes')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if(arg.boxNames[i].charAt(0) !== '-' && arg.boxNames[i].charAt(1) !== '-')
			{
				path.ellipse(dx + arg.marginOffset, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i, arg.boxSize, arg.boxSize);
				path.close();
			}
		}
	}
	else if (shape === 'disCheckBoxes')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if(arg.boxNames[i].charAt(0) === '-' || arg.boxNames[i].charAt(1) === '-')
			{
				path.ellipse(dx + arg.marginOffset, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i, arg.boxSize, arg.boxSize);
				path.close();
			}
		}
	}
	else if (shape === 'enCheckMarks')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if((arg.boxNames[i].charAt(0) === '+' || arg.boxNames[i].charAt(1) === '+') && (arg.boxNames[i].charAt(0) !== '-' && arg.boxNames[i].charAt(1) !== '-'))
			{
				path.ellipse(dx + arg.marginOffset + (2 + this.strokewidth) * this.scale, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i+ (2 + this.strokewidth) * this.scale, arg.boxSize - (2 + this.strokewidth) * this.scale * 2, arg.boxSize - (2 + this.strokewidth) * this.scale * 2);
				path.close();
			}
		}
	}
	else if (shape === 'disCheckMarks')
	{
		for (var i=0; i < this.boxNum; i++)
		{
			if((arg.boxNames[i].charAt(0) === '+' || arg.boxNames[i].charAt(1) === '+') && (arg.boxNames[i].charAt(0) === '-' || arg.boxNames[i].charAt(1) === '-'))
			{
				path.ellipse(dx + arg.marginOffset + (2 + this.strokewidth) * this.scale, dy + arg.marginOffset + (arg.marginOffset + arg.boxSize) * i+ (2 + this.strokewidth) * this.scale, arg.boxSize - (2 + this.strokewidth) * this.scale * 2, arg.boxSize - (2 + this.strokewidth) * this.scale * 2);
			}
		}
	}
};


//**********************************************************************************************************************************************************
//Spinner
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupSpinner.prototype = new mxShapeMockup();
mxShapeMockupSpinner.prototype.constructor = mxShapeMockupSpinner;

mxShapeMockupSpinner.prototype.origWidth = 150;
mxShapeMockupSpinner.prototype.origHeight = 30;
mxShapeMockupSpinner.prototype.origAspect = mxShapeMockupSpinner.prototype.origWidth / mxShapeMockupSpinner.prototype.origHeight;

mxShapeMockupSpinner.prototype.cst = {
		LAYOUT_RIGHT : 'right',
		LAYOUT_LEFT : 'left',
		LAYOUT_TOP : 'top',
		LAYOUT_BOTTOM : 'bottom',
		LAYOUT_VERTICAL : 'vertical',
		LAYOUT_HORIZONTAL : 'horizontal',
		SPINNER_MERGED : 'merged',
		SPINNER_NORMAL : 'normal',
		ADJ_TRIANGLE : 'triangle',
		ADJ_PLUSMINUS : 'plusMinus',
		ADJ_ARROW : 'arrow'
};

function mxShapeMockupSpinner(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupSpinner.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.buttonLines = document.createElement('v:shape');
	this.configureVmlShape(this.buttonLines);
	node.appendChild(this.buttonLines);

	this.incButton = document.createElement('v:shape');
	this.configureVmlShape(this.incButton);
	node.appendChild(this.incButton);

	this.decButton = document.createElement('v:shape');
	this.configureVmlShape(this.decButton);
	node.appendChild(this.decButton);

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

	return node;
};

mxShapeMockupSpinner.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.buttonLines = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttonLines);
	this.incButton = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.incButton);
	this.decButton = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.decButton);
	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	return this.g;
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);
};

mxShapeMockupSpinner.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var spinnerText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, '100');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var spinnerLayout = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LAYOUT, mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT);
	var spinnerStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SPINNER_STYLE, mxShapeMockupSpinner.prototype.cst.SPINNER_NORMAL);
	var adjStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.ADJ_STYLE, mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE);
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');

	// calculate the layout
	if (spinnerText !== this.oldSpinnerText)
	{
		this.textWidth = this.getSizeForString(spinnerText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width * this.scale;
	}

	var minWidth = 0;
	var minHeight = 0;

	if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT || spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
	{
		minWidth = this.textWidth + 20 * this.scale;
		minHeight = fontSize * 1.5 * this.scale;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_HORIZONTAL)
	{
		minWidth = this.textWidth + 40 * this.scale;
		minHeight = fontSize * 1.5 * this.scale;
	}
	if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP || spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
	{
		minWidth = this.textWidth;
		minHeight = fontSize * 1.5 * this.scale + 15 * this.scale;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_VERTICAL)
	{
		minWidth = this.textWidth;
		minHeight = fontSize * 1.5 * this.scale + 30 * this.scale;
	}

	var currWidth = Math.max(minWidth, arg.w);
	var currHeight = Math.max(minHeight, arg.h);

	arg.currWidth = currWidth;
	arg.currHeight = currHeight;
	arg.spinnerLayout = spinnerLayout;
	arg.spinnerStyle = spinnerStyle;
	arg.adjStyle = adjStyle;

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.buttonLines);
	this.updateVmlShape(this.incButton);
	this.updateVmlShape(this.decButton);
	this.updateVmlShape(this.mainTextPath);


	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.buttonLines.path = this.createPath(arg, 'buttonLines');
	this.incButton.path = this.createPath(arg, 'incButton');
	this.decButton.path = this.createPath(arg, 'decButton');

	this.buttonLines.strokecolor = strokeColor;
	this.buttonLines.fillcolor = 'none';
	this.buttonLines.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.incButton.strokecolor = strokeColor;
	this.incButton.fillcolor = strokeColor;
	this.incButton.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.decButton.strokecolor = strokeColor;
	this.decButton.fillcolor = strokeColor;
	this.decButton.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';

	var xCoord = arg.dx + currWidth * 0.5;
	var yCoord = arg.dy + currHeight * 0.5;

	if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT)
	{
		xCoord = xCoord - 10;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
	{
		xCoord = xCoord + 10;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP)
	{
		yCoord = yCoord + 7.5;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
	{
		yCoord = yCoord - 7.5;
	}

	this.mainTextPath.to = Math.round(xCoord + 1) + ' ' + Math.round(yCoord);
	this.mainTextPath.from = Math.round(xCoord - 1) + ' ' + Math.round(yCoord);
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';
	this.mainTextTpElem.string = spinnerText;

	this.updateRotation();

	this.oldSpinnerText = spinnerText;
};

mxShapeMockupSpinner.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var spinnerText = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_TEXT, '100');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var spinnerLayout = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LAYOUT, mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT);
	var spinnerStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SPINNER_STYLE, mxShapeMockupSpinner.prototype.cst.SPINNER_NORMAL);
	var adjStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.ADJ_STYLE, mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE);
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');

	// calculate the layout
	if (spinnerText !== this.oldSpinnerText)
	{
		this.textWidth = this.getSizeForString(spinnerText, Math.round(fontSize * this.scale), mxConstants.DEFAULT_FONTFAMILY).width * this.scale;
	}

	var minWidth = 0;
	var minHeight = 0;

	if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT || spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
	{
		minWidth = this.textWidth + 20 * this.scale;
		minHeight = fontSize * 1.5 * this.scale;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_HORIZONTAL)
	{
		minWidth = this.textWidth + 40 * this.scale;
		minHeight = fontSize * 1.5 * this.scale;
	}
	if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP || spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
	{
		minWidth = this.textWidth;
		minHeight = fontSize * 1.5 * this.scale + 15 * this.scale;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_VERTICAL)
	{
		minWidth = this.textWidth;
		minHeight = fontSize * 1.5 * this.scale + 30 * this.scale;
	}

	var currWidth = Math.max(minWidth, arg.w);
	var currHeight = Math.max(minHeight, arg.h);

	arg.currWidth = currWidth;
	arg.currHeight = currHeight;
	arg.spinnerLayout = spinnerLayout;
	arg.spinnerStyle = spinnerStyle;
	arg.adjStyle = adjStyle;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.buttonLines.setAttribute('d', this.createPath(arg, 'buttonLines'));
	this.incButton.setAttribute('d', this.createPath(arg, 'incButton'));
	this.decButton.setAttribute('d', this.createPath(arg, 'decButton'));

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.buttonLines.setAttribute('stroke', strokeColor);
	this.buttonLines.setAttribute('fill', 'none');
	this.buttonLines.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.incButton.setAttribute('stroke', strokeColor);
	this.incButton.setAttribute('fill', strokeColor);
	this.incButton.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.decButton.setAttribute('stroke', strokeColor);
	this.decButton.setAttribute('fill', strokeColor);
	this.decButton.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);
	this.mainText.setAttribute('text-anchor', 'middle');
	var xCoord = this.bounds.x + currWidth * 0.5;
	var yCoord = this.bounds.y + currHeight * 0.5 + fontSize * 0.25 * this.scale;

	if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT)
	{
		xCoord = xCoord - 10;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
	{
		xCoord = xCoord + 10;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP)
	{
		yCoord = yCoord + 7.5;
	}
	else if (spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
	{
		yCoord = yCoord - 7.5;
	}

	this.mainText.setAttribute('x', xCoord);
	this.mainText.setAttribute('y', yCoord);

	if (typeof this.mainTextNode !== 'undefined' && this.mainTextNode !== 'null')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(spinnerText);
	this.mainText.appendChild(this.mainTextNode);

	this.oldSpinnerText = spinnerText;
	this.updateRotation();
};

mxShapeMockupSpinner.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var width = arg.currWidth;
	var height = arg.currHeight;

	if (shape === 'background')
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
	else if (shape === 'buttonLines' && arg.spinnerStyle === 'normal')
	{
		if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT)
		{
			path.moveTo(dx + width - 20 * this.scale, dy);
			path.lineTo(dx + width - 20 * this.scale, dy + height);
			path.moveTo(dx + width - 20 * this.scale, dy + height * 0.5);
			path.lineTo(dx + width, dy + height * 0.5);
			path.close();
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
		{
			path.moveTo(dx + 20 * this.scale, dy);
			path.lineTo(dx + 20 * this.scale, dy + height);
			path.moveTo(dx + 20 * this.scale, dy + height * 0.5);
			path.lineTo(dx, dy + height * 0.5);
			path.close();
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP)
		{
			path.moveTo(dx, dy + 15 * this.scale);
			path.lineTo(dx + width, dy + 15 * this.scale);
			path.moveTo(dx + width * 0.5, dy + 15 * this.scale);
			path.lineTo(dx + width * 0.5, dy);
			path.close();
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
		{
			path.moveTo(dx, dy + height - 15 * this.scale);
			path.lineTo(dx + width, dy + height - 15 * this.scale);
			path.moveTo(dx + width * 0.5, dy + height - 15 * this.scale);
			path.lineTo(dx + width * 0.5, dy + height);
			path.close();
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_VERTICAL)
		{
			path.moveTo(dx, dy + 15 * this.scale);
			path.lineTo(dx + width, dy + 15 * this.scale);
			path.moveTo(dx, dy + height - 15 * this.scale);
			path.lineTo(dx + width, dy + height - 15 * this.scale);
			path.close();
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_HORIZONTAL)
		{
			path.moveTo(dx + 20 * this.scale, dy);
			path.lineTo(dx + 20 * this.scale, dy + height);
			path.moveTo(dx + width - 20 * this.scale, dy);
			path.lineTo(dx + width - 20 * this.scale, dy + height);
			path.close();
		}
	}
	else if (shape === 'incButton')
	{
		if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.25 + 4.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.25 - 2.5 * this.scale);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.25 + 4.5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width - 10 * this.scale, dy + height * 0.25 - 4 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.25 + 4 * this.scale);
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.25);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.25);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.25 + 1.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.25 - 2.5 * this.scale);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.25 + 1.5 * this.scale);
				path.close();
				path.moveTo(dx + width - 10 * this.scale, dy + height * 0.25 + 4.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.25 - 2.5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.25 + 4.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.25 - 2.5 * this.scale);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.25 + 4.5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + 10 * this.scale, dy + height * 0.25 - 4 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.25 + 4 * this.scale);
				path.moveTo(dx + 14 * this.scale, dy + height * 0.25);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.25);
			}
			else if(arg.adjStyle === 'arrow')
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.25 + 1.5 * this.scale);
				path.lineTo(dx +10 * this.scale, dy + height * 0.25 - 2.5 * this.scale);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.25 + 1.5 * this.scale);
				path.close();
				path.moveTo(dx + 10 * this.scale, dy + height * 0.25 + 4.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.25 - 2.5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width * 0.75 + 4 * this.scale, dy + 12 * this.scale);
				path.lineTo(dx + width * 0.75, dy + 5 * this.scale);
				path.lineTo(dx + width * 0.75 - 4 * this.scale, dy + 12 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width * 0.75, dy + 3.5 * this.scale);
				path.lineTo(dx + width * 0.75, dy + 11.5 * this.scale);
				path.moveTo(dx + width * 0.75 + 4 * this.scale, dy + 7.5 * this.scale);
				path.lineTo(dx + width * 0.75 - 4 * this.scale, dy + 7.5 * this.scale);
			}
			else if(arg.adjStyle === 'arrow')
			{
				path.moveTo(dx + width * 0.75 + 4 * this.scale, dy + 9 * this.scale);
				path.lineTo(dx + width * 0.75, dy + 5 * this.scale);
				path.lineTo(dx + width * 0.75 - 4 * this.scale, dy + 9 * this.scale);
				path.close();
				path.moveTo(dx + width * 0.75, dy + 12 * this.scale);
				path.lineTo(dx + width * 0.75, dy + 5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width * 0.75 + 4 * this.scale, dy + height - 5 * this.scale);
				path.lineTo(dx + width * 0.75, dy + height - 12 * this.scale);
				path.lineTo(dx + width * 0.75 - 4 * this.scale, dy + height - 5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width * 0.75, dy + height - 3.5 * this.scale);
				path.lineTo(dx + width * 0.75, dy + height - 11.5 * this.scale);
				path.moveTo(dx + width * 0.75 + 4 * this.scale, dy + height - 7.5 * this.scale);
				path.lineTo(dx + width * 0.75 - 4 * this.scale, dy + height - 7.5 * this.scale);
			}
			else if(arg.adjStyle === 'arrow')
			{
				path.moveTo(dx + width * 0.75 + 4 * this.scale, dy + height - 6 * this.scale);
				path.lineTo(dx + width * 0.75, dy + height - 10 * this.scale);
				path.lineTo(dx + width * 0.75 - 4 * this.scale, dy + height - 6 * this.scale);
				path.close();
				path.moveTo(dx + width * 0.75, dy + height - 3 * this.scale);
				path.lineTo(dx + width * 0.75, dy + height - 10 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_VERTICAL)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width * 0.5 + 4 * this.scale, dy + 12 * this.scale);
				path.lineTo(dx + width * 0.5, dy + 5 * this.scale);
				path.lineTo(dx + width * 0.5 - 4 * this.scale, dy + 12 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width * 0.5, dy + 3.5 * this.scale);
				path.lineTo(dx + width * 0.5, dy + 11.5 * this.scale);
				path.moveTo(dx + width * 0.5 + 4 * this.scale, dy + 7.5 * this.scale);
				path.lineTo(dx + width * 0.5 - 4 * this.scale, dy + 7.5 * this.scale);
			}
			else if(arg.adjStyle === 'arrow')
			{
				path.moveTo(dx + width * 0.5 + 4 * this.scale, dy + 9 * this.scale);
				path.lineTo(dx + width * 0.5, dy + 5 * this.scale);
				path.lineTo(dx + width * 0.5 - 4 * this.scale, dy + 9 * this.scale);
				path.close();
				path.moveTo(dx + width * 0.5, dy + 12 * this.scale);
				path.lineTo(dx + width * 0.5, dy + 5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_HORIZONTAL)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width - 6 * this.scale, dy + height * 0.5 + 4.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.5 - 2.5 * this.scale );
				path.lineTo(dx + width - 14 * this.scale, dy + height * 0.5 + 4.5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width - 10 * this.scale, dy + height * 0.5 - 4 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.5 + 4 * this.scale);
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.5);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.5);
			}
			else if(arg.adjStyle === 'arrow')
			{
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.5 + 1.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.5 - 2.5 * this.scale);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.5 + 1.5 * this.scale);
				path.close();
				path.moveTo(dx + width - 10 * this.scale, dy + height * 0.5 + 4.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.5 - 2.5 * this.scale);
			}
		}
	}
	else if (shape === 'decButton')
	{
		if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_RIGHT)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.75 - 4.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.75 + 2.5 * this.scale);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.75 - 4.5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.75);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.75);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + width - 14 * this.scale, dy + height * 0.75 - 1.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.75 + 2.5 * this.scale);
				path.lineTo(dx + width - 6 * this.scale, dy + height * 0.75 - 1.5 * this.scale);
				path.close();
				path.moveTo(dx + width - 10 * this.scale, dy + height * 0.75 - 4.5 * this.scale);
				path.lineTo(dx + width - 10 * this.scale, dy + height * 0.75 + 2.5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_LEFT)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.75 - 4.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.75 + 2.5 * this.scale);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.75 - 4.5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.75);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.75);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.75 - 1.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.75 + 2.5 * this.scale);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.75 - 1.5 * this.scale);
				path.close();
				path.moveTo(dx + 10 * this.scale, dy + height * 0.75 - 4.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.75 + 2.5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_TOP)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width * 0.25 + 4 * this.scale, dy + 5 * this.scale);
				path.lineTo(dx + width * 0.25, dy + 12 * this.scale);
				path.lineTo(dx + width * 0.25 - 4 * this.scale, dy + 5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width * 0.25 + 4 * this.scale, dy + 7.5 * this.scale);
				path.lineTo(dx + width * 0.25 - 4 * this.scale, dy + 7.5 * this.scale);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + width * 0.25 + 4 * this.scale, dy + 6 * this.scale);
				path.lineTo(dx + width * 0.25, dy + 10 * this.scale);
				path.lineTo(dx + width * 0.25 - 4 * this.scale, dy + 6 * this.scale);
				path.close();
				path.moveTo(dx + width * 0.25, dy + 3 * this.scale);
				path.lineTo(dx + width * 0.25, dy + 10 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_BOTTOM)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width * 0.25 + 4 * this.scale, dy + height - 12 * this.scale);
				path.lineTo(dx + width * 0.25, dy + height - 5 * this.scale);
				path.lineTo(dx + width * 0.25 - 4 * this.scale, dy + height - 12 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width * 0.25 + 4 * this.scale, dy + height - 7.5 * this.scale);
				path.lineTo(dx + width * 0.25 - 4 * this.scale, dy + height - 7.5 * this.scale);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + width * 0.25 + 4 * this.scale, dy + height - 9 * this.scale);
				path.lineTo(dx + width * 0.25, dy + height - 5 * this.scale);
				path.lineTo(dx + width * 0.25 - 4 * this.scale, dy + height - 9 * this.scale);
				path.close();
				path.moveTo(dx + width * 0.25, dy + height - 12 * this.scale);
				path.lineTo(dx + width * 0.25, dy + height - 5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_VERTICAL)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx + width * 0.5 + 4 * this.scale, dy + height - 12 * this.scale);
				path.lineTo(dx + width * 0.5, dy + height - 5 * this.scale);
				path.lineTo(dx + width * 0.5 - 4 * this.scale, dy + height - 12 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + width * 0.5 + 4 * this.scale, dy + height - 7.5 * this.scale);
				path.lineTo(dx + width * 0.5 - 4 * this.scale, dy + height - 7.5 * this.scale);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + width * 0.5 + 4 * this.scale, dy + height - 9 * this.scale);
				path.lineTo(dx + width * 0.5, dy + height - 5 * this.scale);
				path.lineTo(dx + width * 0.5 - 4 * this.scale, dy + height - 9 * this.scale);
				path.close();
				path.moveTo(dx + width * 0.5, dy + height - 12 * this.scale);
				path.lineTo(dx + width * 0.5, dy + height - 5 * this.scale);
			}
		}
		else if (arg.spinnerLayout === mxShapeMockupSpinner.prototype.cst.LAYOUT_HORIZONTAL)
		{
			if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_TRIANGLE)
			{
				path.moveTo(dx +  6 * this.scale, dy + height * 0.5 - 4.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.5 + 2.5 * this.scale );
				path.lineTo(dx + 14 * this.scale, dy + height * 0.5 - 4.5 * this.scale);
				path.close();
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_PLUSMINUS)
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.5);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.5);
			}
			else if(arg.adjStyle === mxShapeMockupSpinner.prototype.cst.ADJ_ARROW)
			{
				path.moveTo(dx + 14 * this.scale, dy + height * 0.5 - 1.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.5 + 2.5 * this.scale);
				path.lineTo(dx + 6 * this.scale, dy + height * 0.5 - 1.5 * this.scale);
				path.close();
				path.moveTo(dx + 10 * this.scale, dy + height * 0.5 - 4.5 * this.scale);
				path.lineTo(dx + 10 * this.scale, dy + height * 0.5 + 2.5 * this.scale);
			}
		}
	}
};


//**********************************************************************************************************************************************************
//Horizontal Slider
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupHorSlider.prototype = new mxShapeMockup();
mxShapeMockupHorSlider.prototype.constructor = mxShapeMockupHorSlider;

mxShapeMockupHorSlider.prototype.origWidth = 200;
mxShapeMockupHorSlider.prototype.origHeight = 20;
mxShapeMockupHorSlider.prototype.origAspect = mxShapeMockupHorSlider.prototype.origWidth / mxShapeMockupHorSlider.prototype.origHeight;

mxShapeMockupHorSlider.prototype.cst = {
		SLIDER_BASIC : 'basic',
		SLIDER_FANCY : 'fancy',
		HANDLE_TRIANGLE : 'triangle',
		HANDLE_CIRCLE : 'circle',
		HANDLE_HANDLE : 'handle'
};

function mxShapeMockupHorSlider(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupHorSlider.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.leftSlider = document.createElement('v:shape');
	this.configureVmlShape(this.leftSlider);
	node.appendChild(this.leftSlider);

	this.sliderHandle = document.createElement('v:shape');
	this.configureVmlShape(this.sliderHandle);
	node.appendChild(this.sliderHandle);

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

mxShapeMockupHorSlider.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.leftSlider = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.leftSlider);
	this.sliderHandle = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.sliderHandle);
	return this.g;
};

mxShapeMockupHorSlider.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.leftSlider);
	this.updateVmlShape(this.sliderHandle);

	var sliderPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_POS, '70');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var leftColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LEFT_COLOR, '#00ff00');
	var handleColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HANDLE_COLOR, '#aaaaaa');
	arg.sliderStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_STYLE, mxShapeMockupHorSlider.prototype.cst.SLIDER_BASIC);
	arg.handleStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HANDLE_STYLE, mxShapeMockupHorSlider.prototype.cst.HANDLE_TRIANGLE);

	sliderPos = Math.max(0, sliderPos);
	sliderPos = Math.min(100, sliderPos);
	arg.sliderPos = sliderPos;

	this.background.path = this.createPath(arg, 'background');
	this.leftSlider.path = this.createPath(arg, 'leftSlider');
	this.sliderHandle.path = this.createPath(arg, 'sliderHandle');

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

	this.sliderHandle.fillcolor = handleColor;
	this.sliderHandle.strokecolor = strokeColor;
	this.sliderHandle.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupHorSlider.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var sliderPos = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_POS, '70');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var leftColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LEFT_COLOR, '#00ff00');
	var handleColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HANDLE_COLOR, '#aaaaaa');
	arg.sliderStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SLIDER_STYLE, mxShapeMockupHorSlider.prototype.cst.SLIDER_BASIC);
	arg.handleStyle = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HANDLE_STYLE, mxShapeMockupHorSlider.prototype.cst.HANDLE_TRIANGLE);

	sliderPos = Math.max(0, sliderPos);
	sliderPos = Math.min(100, sliderPos);
	arg.sliderPos = sliderPos;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.leftSlider.setAttribute('d', this.createPath(arg, 'leftSlider'));
	this.sliderHandle.setAttribute('d', this.createPath(arg, 'sliderHandle'));

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

	this.sliderHandle.setAttribute('fill', handleColor);
	this.sliderHandle.setAttribute('stroke', strokeColor);
	this.sliderHandle.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupHorSlider.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var h = Math.max(arg.h, 20 * this.scale);
	var w = Math.max(arg.w, 10 * this.scale);
	var centerH = h * 0.5;
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_BASIC)
		{
			path.moveTo(dx, dy + h * 0.5);
			path.lineTo(dx + w, dy + h * 0.5);
		}
		else if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_FANCY)
		{
			path.moveTo(dx, dy + centerH);
			path.arcTo(dx, dy + centerH, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + 5 * this.scale, dy + centerH - 5 * this.scale);
			path.lineTo(dx + w - 5 * this.scale, dy + centerH - 5 * this.scale);
			path.arcTo(dx + w - 5 * this.scale, dy + centerH - 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + w, dy + centerH);
			path.arcTo(dx + w, dy + centerH, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + w - 5 * this.scale, dy + centerH + 5 * this.scale);
			path.lineTo(dx + 5 * this.scale, dy + centerH + 5 * this.scale);
			path.arcTo(dx + 5 * this.scale, dy + centerH + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx, dy + centerH);
			path.close();
		}
	}
	if (shape === 'leftSlider')
	{

		if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_BASIC)
		{
			var barCenterPos = w * arg.sliderPos / 100;
			path.moveTo(dx, dy + h * 0.5);
			path.lineTo(dx + barCenterPos, dy + h * 0.5);
		}
		else if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_FANCY)
		{
			var barCenterPos = 10 * this.scale + (w - 10 * this.scale) * arg.sliderPos / 100;

			path.moveTo(dx, dy + centerH);
			path.arcTo(dx, dy + centerH, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + 5 * this.scale, dy + centerH - 5 * this.scale);
			path.lineTo(dx + barCenterPos - 5 * this.scale, dy + centerH - 5 * this.scale);
			path.arcTo(dx + barCenterPos - 5 * this.scale, dy + centerH - 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + barCenterPos, dy + centerH);
			path.arcTo(dx + barCenterPos, dy + centerH, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx + barCenterPos - 5 * this.scale, dy + centerH + 5 * this.scale);
			path.lineTo(dx + 5 * this.scale, dy + centerH + 5 * this.scale);
			path.arcTo(dx + 5 * this.scale, dy + centerH + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 1, dx, dy + centerH);
			path.close();
		}
	}
	else if (shape === 'sliderHandle')
	{
		var handleCenterPos = 5 * this.scale + (w - 10 * this.scale) * arg.sliderPos / 100;

		if (arg.handleStyle === mxShapeMockupHorSlider.prototype.cst.HANDLE_CIRCLE)
		{
			path.ellipse(dx + handleCenterPos - 10 * this.scale, dy + centerH - 10 * this.scale, 20 * this.scale, 20 * this.scale);
			path.close();
		}
		else if (arg.handleStyle === mxShapeMockupHorSlider.prototype.cst.HANDLE_TRIANGLE)
		{
			path.moveTo(dx + handleCenterPos - 10 * this.scale, dy + centerH + 10 * this.scale);
			path.lineTo(dx + handleCenterPos, dy + centerH - 10 * this.scale);
			path.lineTo(dx + handleCenterPos + 10 * this.scale, dy + centerH + 10 * this.scale);
			path.close();
		}
		else if (arg.handleStyle === mxShapeMockupHorSlider.prototype.cst.HANDLE_HANDLE)
		{
			path.moveTo(dx + handleCenterPos - 7 * this.scale, dy + centerH + 10 * this.scale);
			path.lineTo(dx + handleCenterPos - 7 * this.scale, dy + centerH);
			path.lineTo(dx + handleCenterPos, dy + centerH - 10 * this.scale);
			path.lineTo(dx + handleCenterPos + 7 * this.scale, dy + centerH);
			path.lineTo(dx + handleCenterPos + 7 * this.scale, dy + centerH + 10 * this.scale);
			path.close();
		}
	}
};

//**********************************************************************************************************************************************************
//Vertical Slider
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupVerSlider.prototype = new mxShapeMockupHorSlider();
mxShapeMockupVerSlider.prototype.constructor = mxShapeMockupVerSlider;

mxShapeMockupVerSlider.prototype.origWidth = 20;
mxShapeMockupVerSlider.prototype.origHeight = 200;
mxShapeMockupVerSlider.prototype.origAspect = mxShapeMockupVerSlider.prototype.origWidth / mxShapeMockupVerSlider.prototype.origHeight;

function mxShapeMockupVerSlider(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerSlider.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var h = Math.max(arg.h, 10 * this.scale);
	var w = Math.max(arg.w, 20 * this.scale);
	var centerW = w * 0.5;
	var dx = arg.dx;
	var dy = arg.dy;

	if (shape === 'background')
	{
		if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_BASIC)
		{
			path.moveTo(dx + centerW, dy);
			path.lineTo(dx + centerW, dy + h);
		}
		else if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_FANCY)
		{
			path.moveTo(dx + centerW, dy);
			path.arcTo(dx + centerW, dy, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW - 5 * this.scale, dy + 5 * this.scale);
			path.lineTo(dx + centerW - 5 * this.scale, dy + h - 5 * this.scale);
			path.arcTo(dx + centerW - 5 * this.scale, dy + h - 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW, dy + h);
			path.arcTo(dx + centerW, dy + h, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW + 5 * this.scale, dy + h - 5 * this.scale);
			path.lineTo(dx + centerW + 5 * this.scale, dy + 5 * this.scale);
			path.arcTo(dx + centerW + 5 * this.scale, dy + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW, dy);
			path.close();
		}
	}
	if (shape === 'leftSlider')
	{

		if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_BASIC)
		{
			var barCenterPos = h * arg.sliderPos / 100;
			path.moveTo(dx + centerW, dy);
			path.lineTo(dx + centerW, dy + barCenterPos);
		}
		else if (arg.sliderStyle === mxShapeMockupHorSlider.prototype.cst.SLIDER_FANCY)
		{
			var barCenterPos = 10 * this.scale + (h - 10 * this.scale) * arg.sliderPos / 100;

			path.moveTo(dx + centerW, dy);
			path.arcTo(dx + centerW, dy, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW - 5 * this.scale, dy + 5 * this.scale);
			path.lineTo(dx + centerW - 5 * this.scale, dy + barCenterPos - 5 * this.scale);
			path.arcTo(dx + centerW - 5 * this.scale, dy + barCenterPos - 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW, dy + barCenterPos);
			path.arcTo(dx + centerW, dy + barCenterPos, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW + 5 * this.scale, dy + barCenterPos - 5 * this.scale);
			path.lineTo(dx + centerW + 5 * this.scale, dy + 5 * this.scale);
			path.arcTo(dx + centerW + 5 * this.scale, dy + 5 * this.scale, 5 * this.scale, 5 * this.scale, 0, 0, 0, dx + centerW, dy);
			path.close();
		}
	}
	else if (shape === 'sliderHandle')
	{
		var handleCenterPos = 5 * this.scale + (h - 10 * this.scale) * arg.sliderPos / 100;

		if (arg.handleStyle === mxShapeMockupHorSlider.prototype.cst.HANDLE_CIRCLE)
		{
			path.ellipse(dx + centerW - 10 * this.scale, dy + handleCenterPos - 10 * this.scale, 20 * this.scale, 20 * this.scale);
			path.close();
		}
		else if (arg.handleStyle === mxShapeMockupHorSlider.prototype.cst.HANDLE_TRIANGLE)
		{
			path.moveTo(dx + centerW + 10 * this.scale, dy + handleCenterPos - 10 * this.scale);
			path.lineTo(dx + centerW - 10 * this.scale, dy + handleCenterPos);
			path.lineTo(dx + centerW + 10 * this.scale, dy + handleCenterPos + 10 * this.scale);
			path.close();
		}
		else if (arg.handleStyle === mxShapeMockupHorSlider.prototype.cst.HANDLE_CIRCLE)
		{
			path.moveTo(dx + centerW + 10 * this.scale, dy + handleCenterPos - 7 * this.scale);
			path.lineTo(dx + centerW, dy + handleCenterPos - 7 * this.scale);
			path.lineTo(dx + centerW - 10 * this.scale, dy + handleCenterPos);
			path.lineTo(dx + centerW, dy + handleCenterPos + 7 * this.scale);
			path.lineTo(dx + centerW + 10 * this.scale, dy + handleCenterPos + 7 * this.scale);
			path.close();
		}
	}
};


//**********************************************************************************************************************************************************
//List Box
//**********************************************************************************************************************************************************
/**
 * Extends mxShapeMockup.
 */
mxShapeMockupListBox.prototype = new mxShapeMockup();
mxShapeMockupListBox.prototype.constructor = mxShapeMockupListBox;

mxShapeMockupListBox.prototype.origWidth = 100;
mxShapeMockupListBox.prototype.origHeight = 150;
mxShapeMockupListBox.prototype.origAspect = mxShapeMockupListBox.prototype.origWidth / mxShapeMockupListBox.prototype.origHeight;

function mxShapeMockupListBox(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupListBox.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');

	this.buttonNum = listEntry.length;
	this.currentPath = new Array();
	this.fillElem = new Array();
	this.strokeElem = new Array();
	this.pathElem = new Array();
	this.tpElem = new Array();
	this.oldButtonNames = new Array();
	this.buttonWidths = new Array();

	this.headerShape = document.createElement('v:shape');
	this.configureVmlShape(this.headerShape);
	node.appendChild(this.headerShape);

	for (var i = 0; i < listEntry.length; i++)
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

mxShapeMockupListBox.prototype.createSvg = function()
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

mxShapeMockupListBox.prototype.redrawVml = function()
{
	var arg = this.calcArgs();

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.headerShape);

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');
	arg.hasHeader = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HAS_HEADER, 'true').toString();
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

mxShapeMockupListBox.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();

	var listEntry = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.LIST, 'Line1').toString().split(',');
	arg.hasHeader = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.HAS_HEADER, 'true').toString();
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

mxShapeMockupListBox.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
		if (arg.hasHeader === 'true')
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
//Password Field
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupPwField.prototype = new mxShapeMockup();
mxShapeMockupPwField.prototype.constructor = mxShapeMockupPwField;

mxShapeMockupPwField.prototype.origWidth = 150;
mxShapeMockupPwField.prototype.origHeight = 30;
mxShapeMockupPwField.prototype.origAspect = mxShapeMockupPwField.prototype.origWidth / mxShapeMockupPwField.prototype.origHeight;

mxShapeMockupPwField.prototype.cst = {
		PW_TEXT : 'text',
		PW_DOTS : 'dots'
};

function mxShapeMockupPwField(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupPwField.prototype.createVml = function()
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

mxShapeMockupPwField.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupPwField.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var pwStyle  = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.PW_STYLE, mxShapeMockupPwField.prototype.cst.PW_TEXT);
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
	var yPos = Math.round(Math.max(arg.dy + arg.h * 0.5, fontSize * 0.75 * this.scale));
	var xPos = Math.round(arg.dx + 10 * this.scale);
	this.mainTextPath.to = (xPos + 1) + ' ' + yPos;
	this.mainTextPath.from = xPos + ' ' + yPos;
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';

	if (pwStyle === mxShapeMockupPwField.prototype.cst.PW_TEXT)
	{
		this.mainTextTpElem.string = pwString;
	}
	else if (pwStyle === mxShapeMockupPwField.prototype.cst.PW_DOTS)
	{
		this.mainTextTpElem.string = '';

		for (var i=0; i < pwString.length; i++)
		{
			this.mainTextTpElem.string = this.mainTextTpElem.string + String.fromCharCode(8226);
		}
	}

	this.updateRotation();
};

mxShapeMockupPwField.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var pwStyle  = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.PW_STYLE, mxShapeMockupPwField.prototype.cst.PW_TEXT);
	var pwString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.PW_STRING, 'Main text');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);
	this.mainText.setAttribute('text-anchor', 'start');
	this.mainText.setAttribute('x', this.bounds.x + 10 * this.scale);
	this.mainText.setAttribute('y', Math.max(this.bounds.y + arg.h * 0.5 + fontSize * 0.5 * this.scale, fontSize * 1.25 * this.scale));

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	var finalString = '';
	if (pwStyle === mxShapeMockupPwField.prototype.cst.PW_TEXT)
	{
		finalString = pwString;
	}
	else if (pwStyle === mxShapeMockupPwField.prototype.cst.PW_DOTS)
	{
		for (var i=0; i < pwString.length; i++)
		{
			finalString = finalString + String.fromCharCode(8226);
		}
	}

	this.mainTextNode = document.createTextNode(finalString);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupPwField.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
//Horizontal Splitter
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorSplitter.prototype = new mxShapeMockup();
mxShapeMockupHorSplitter.prototype.constructor = mxShapeMockupHorSplitter;

mxShapeMockupHorSplitter.prototype.origWidth = 350;
mxShapeMockupHorSplitter.prototype.origHeight = 10;
mxShapeMockupHorSplitter.prototype.origAspect = mxShapeMockupHorSplitter.prototype.origWidth / mxShapeMockupHorSplitter.prototype.origHeight;


function mxShapeMockupHorSplitter(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupHorSplitter.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.splitterLines = document.createElement('v:shape');
	this.configureVmlShape(this.splitterLines);
	node.appendChild(this.splitterLines);

	this.splitterDots = document.createElement('v:shape');
	this.configureVmlShape(this.splitterDots);
	node.appendChild(this.splitterDots);

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

mxShapeMockupHorSplitter.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.splitterLines = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.splitterLines);
	this.splitterDots = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.splitterDots);
	return this.g;
};

mxShapeMockupHorSplitter.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');

	var currWidth = Math.max(50 * this.scale, arg.w);

	arg.currWidth = currWidth;

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.splitterLines);
	this.updateVmlShape(this.splitterDots);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.splitterLines.path = this.createPath(arg, 'splitterLines');
	this.splitterDots.path = this.createPath(arg, 'splitterDots');

	this.background.strokecolor = 'none';

	this.splitterLines.strokecolor = strokeColor;
	this.splitterLines.fillcolor = 'none';
	this.splitterLines.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.splitterDots.strokecolor = 'none';
	this.splitterDots.fillcolor = strokeColor;
	this.splitterDots.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.updateRotation();
};

mxShapeMockupHorSplitter.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, 'none');

	var currWidth = Math.max(50 * this.scale, arg.w);

	arg.currWidth = currWidth;

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.splitterLines.setAttribute('d', this.createPath(arg, 'splitterLines'));
	this.splitterDots.setAttribute('d', this.createPath(arg, 'splitterDots'));

	this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	this.innerNode.setAttribute('stroke', 'none');

	this.splitterLines.setAttribute('stroke', strokeColor);
	this.splitterLines.setAttribute('fill', 'none');
	this.splitterLines.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.splitterDots.setAttribute('stroke', 'none');
	this.splitterDots.setAttribute('fill', strokeColor);
	this.splitterDots.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.updateRotation();
};

mxShapeMockupHorSplitter.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var width = arg.currWidth;
	var centerY = arg.h * 0.5;
	var five = 5 * this.scale;

	if (shape === 'background')
	{
		path.moveTo(dx, dy + centerY - five);
		path.lineTo(dx + width, dy + centerY - five);
		path.lineTo(dx + width, dy + centerY + five);
		path.lineTo(dx, dy + centerY + five);
		path.close();
	}
	else if (shape === 'splitterLines')
	{
		path.moveTo(dx, dy + centerY - five);
		path.lineTo(dx + width, dy + centerY - five);
		path.moveTo(dx + width, dy + centerY + five);
		path.lineTo(dx, dy + centerY + five);
	}
	else if (shape === 'splitterDots')
	{
		path.ellipse(dx + width * 0.5 - 17, dy + centerY - 2 * this.scale, 4 * this.scale, 4 * this.scale);
		path.ellipse(dx + width * 0.5 - 2, dy + centerY - 2 * this.scale, 4 * this.scale, 4 * this.scale);
		path.ellipse(dx + width * 0.5 + 13, dy + centerY - 2 * this.scale, 4 * this.scale, 4 * this.scale);
	}
};


//**********************************************************************************************************************************************************
//Vertical Splitter
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupVerSplitter.prototype = new mxShapeMockupHorSplitter();
mxShapeMockupVerSplitter.prototype.constructor = mxShapeMockupVerSplitter;

mxShapeMockupVerSplitter.prototype.origWidth = 10;
mxShapeMockupVerSplitter.prototype.origHeight = 350;
mxShapeMockupVerSplitter.prototype.origAspect = mxShapeMockupVerSplitter.prototype.origWidth / mxShapeMockupVerSplitter.prototype.origHeight;

function mxShapeMockupVerSplitter(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupVerSplitter.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var dx = arg.dx;
	var dy = arg.dy;
	var height = Math.max(50 * this.scale, arg.h);
	var centerX = arg.w * 0.5;
	var five = 5 * this.scale;

	if (shape === 'background')
	{
		path.moveTo(dx + centerX - five, dy);
		path.lineTo(dx + centerX - five, dy + height);
		path.lineTo(dx + centerX + five, dy + height);
		path.lineTo(dx + centerX + five, dy);
		path.close();
	}
	else if (shape === 'splitterLines')
	{
		path.moveTo(dx + centerX - five, dy);
		path.lineTo(dx + centerX - five, dy + height);
		path.moveTo(dx + centerX + five, dy + height);
		path.lineTo(dx + centerX + five, dy);
	}
	else if (shape === 'splitterDots')
	{
		path.ellipse(dx + centerX - 2 * this.scale, dy + height * 0.5 - 17, 4 * this.scale, 4 * this.scale);
		path.ellipse(dx + centerX - 2 * this.scale, dy + height * 0.5 - 2, 4 * this.scale, 4 * this.scale);
		path.ellipse(dx + centerX - 2 * this.scale, dy + height * 0.5 + 13, 4 * this.scale, 4 * this.scale);
	}
};

//**********************************************************************************************************************************************************
//Horizontal Wedge Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupHorWedgeBar.prototype = new mxShapeMockupHorTabBar();
mxShapeMockupHorWedgeBar.prototype.constructor = mxShapeMockupHorWedgeBar;

mxShapeMockupHorWedgeBar.prototype.origWidth = 400;
mxShapeMockupHorWedgeBar.prototype.origHeight = 30;
mxShapeMockupHorWedgeBar.prototype.origAspect = mxShapeMockupHorWedgeBar.prototype.origWidth / mxShapeMockupHorWedgeBar.prototype.origHeight;

function mxShapeMockupHorWedgeBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupHorWedgeBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var w = arg.w;
	var dx = arg.dx;
	var dy = arg.dy;
	if (shape === 'background')
	{
	}
	else if (shape === 'tab')
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
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx, dy + arg.tabHeight);
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
			path.lineTo(dx + Math.max(w, this.minWidth), dy +arg.tabHeight);
			path.lineTo(dx, dy + arg.tabHeight);
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
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx, dy + arg.tabHeight);
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
			path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
			path.lineTo(dx, dy + arg.tabHeight);
			path.lineTo(dx, dy + arg.tabHeight);
			path.close();
		}
	}
	else if (shape === 'noTabWindow')
	{
		path.moveTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
		path.lineTo(dx + Math.max(w, this.minWidth), dy + arg.tabHeight);
		path.lineTo(dx, dy + arg.tabHeight);
		path.lineTo(dx, dy + arg.tabHeight);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Search Box
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
mxShapeMockupSearchBox.prototype = new mxShapeMockup();
mxShapeMockupSearchBox.prototype.constructor = mxShapeMockupSearchBox;

mxShapeMockupSearchBox.prototype.origWidth = 150;
mxShapeMockupSearchBox.prototype.origHeight = 30;
mxShapeMockupSearchBox.prototype.origAspect = mxShapeMockupSearchBox.prototype.origWidth / mxShapeMockupSearchBox.prototype.origHeight;

function mxShapeMockupSearchBox(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxShapeMockupSearchBox.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.lookingGlass = document.createElement('v:shape');
	this.configureVmlShape(this.lookingGlass);
	node.appendChild(this.lookingGlass);

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

mxShapeMockupSearchBox.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.lookingGlass = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.lookingGlass);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupSearchBox.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var searchString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEARCH_STRING, 'Search');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.lookingGlass);
	this.updateVmlShape(this.mainTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.lookingGlass.path = this.createPath(arg, 'lookingGlass');

	this.lookingGlass.strokecolor = strokeColor;
	this.lookingGlass.fillcolor = 'none';
	this.lookingGlass.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.font = 'italic normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	var yPos = Math.round(Math.max(arg.dy + arg.h * 0.5, fontSize * 0.75 * this.scale));
	var xPos = Math.round(arg.dx + 10 * this.scale);
	this.mainTextPath.to = (xPos + 1) + ' ' + yPos;
	this.mainTextPath.from = xPos + ' ' + yPos;
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';

	this.mainTextTpElem.string = searchString;

	this.updateRotation();
};

mxShapeMockupSearchBox.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var searchString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.SEARCH_STRING, 'Main text');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.lookingGlass.setAttribute('d', this.createPath(arg, 'lookingGlass'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.lookingGlass.setAttribute('stroke', strokeColor);
	this.lookingGlass.setAttribute('fill', 'none');
	this.lookingGlass.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);
	this.mainText.setAttribute('font-style', 'italic');
	this.mainText.setAttribute('text-anchor', 'start');
	this.mainText.setAttribute('x', this.bounds.x + 10 * this.scale);
	this.mainText.setAttribute('y', Math.max(this.bounds.y + arg.h * 0.5 + fontSize * 0.5 * this.scale, fontSize * 1.25 * this.scale));

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(searchString);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupSearchBox.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'lookingGlass')
	{
		path.ellipse(dx + w - 15 * this.scale, dy + h * 0.5 - 8 * this.scale, 10 * this.scale, 10 * this.scale);
		path.close();
		path.moveTo(dx + w - 19 * this.scale, dy + h * 0.5 + 9 * this.scale);
		path.lineTo(dx + w - 13 * this.scale, dy + h * 0.5 + 1 * this.scale);
	}
};

//**********************************************************************************************************************************************************
//Combo box
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupComboBox.prototype = new mxShapeMockup();
mxShapeMockupComboBox.prototype.constructor = mxShapeMockupComboBox;

mxShapeMockupComboBox.prototype.origWidth = 150;
mxShapeMockupComboBox.prototype.origHeight = 30;
mxShapeMockupComboBox.prototype.origAspect = mxShapeMockupComboBox.prototype.origWidth / mxShapeMockupComboBox.prototype.origHeight;

function mxShapeMockupComboBox(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupComboBox.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.triangle = document.createElement('v:shape');
	this.configureVmlShape(this.triangle);
	node.appendChild(this.triangle);

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

mxShapeMockupComboBox.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	this.mainText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.mainText);
	this.triangle = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.triangle);
	this.mainTextNode = document.createTextNode(' ');
	this.mainText.appendChild(this.mainTextNode);

	return this.g;
};

mxShapeMockupComboBox.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var searchString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.COMBO_STRING, 'Item');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.triangle);
	this.updateVmlShape(this.mainTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.triangle.path = this.createPath(arg, 'triangle');

	this.triangle.strokecolor = strokeColor;
	this.triangle.fillcolor = strokeColor;
	this.triangle.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';
	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.mainTextFillElem.color = fontColor;
	this.mainTextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';
	var yPos = Math.round(Math.max(arg.dy + arg.h * 0.5, fontSize * 0.75 * this.scale));
	var xPos = Math.round(arg.dx + 10 * this.scale);
	this.mainTextPath.to = (xPos + 1) + ' ' + yPos;
	this.mainTextPath.from = xPos + ' ' + yPos;
	this.mainTextPath.style.width = '1px';
	this.mainTextPath.style.height = '1px';

	this.mainTextTpElem.string = searchString;

	this.updateRotation();
};

mxShapeMockupComboBox.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var searchString = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.COMBO_STRING, 'Item');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.triangle.setAttribute('d', this.createPath(arg, 'triangle'));
	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.triangle.setAttribute('stroke', strokeColor);
	this.triangle.setAttribute('fill', strokeColor);
	this.triangle.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.mainText.setAttribute('fill', fontColor);
	this.mainText.setAttribute('font-size', fontSize * this.scale);
//	this.mainText.setAttribute('font-style', 'italic');
	this.mainText.setAttribute('text-anchor', 'start');
	this.mainText.setAttribute('x', this.bounds.x + 10 * this.scale);
	this.mainText.setAttribute('y', Math.max(this.bounds.y + arg.h * 0.5 + fontSize * 0.5 * this.scale, fontSize * 1.25 * this.scale));

	if (this.mainTextNode !== null || typeof this.mainTextNode !== 'undefined')
	{
		this.mainText.removeChild(this.mainTextNode);
	}

	this.mainTextNode = document.createTextNode(searchString);
	this.mainText.appendChild(this.mainTextNode);

	this.updateRotation();
};

mxShapeMockupComboBox.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'triangle')
	{
		path.moveTo(dx + w - 30 * this.scale, dy);
		path.lineTo(dx + w - 30 * this.scale, dy + h);
		path.close();
		path.moveTo(dx + w - 20 * this.scale, dy + h * 0.5 - 5 * this.scale);
		path.lineTo(dx + w - 10 * this.scale, dy + h * 0.5 - 5 * this.scale);
		path.lineTo(dx + w - 15 * this.scale, dy + h * 0.5 + 5 * this.scale);
		path.close();
	}
};


//**********************************************************************************************************************************************************
//Link Bar
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupMenuBar.prototype = new mxShapeMockupHorButtonBar();
mxShapeMockupMenuBar.prototype.constructor = mxShapeMockupMenuBar;

mxShapeMockupMenuBar.prototype.origWidth = 300;
mxShapeMockupMenuBar.prototype.origHeight = 30;
mxShapeMockupMenuBar.prototype.origAspect = mxShapeMockupMenuBar.prototype.origWidth / mxShapeMockupMenuBar.prototype.origHeight;

function mxShapeMockupMenuBar(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

mxShapeMockupMenuBar.prototype.redrawVml = function()
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
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');

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

	var labelOffset = 5 * this.scale;
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

mxShapeMockupMenuBar.prototype.redrawSvg = function()
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
	var textColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '20');
	var fontStyle = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, '0'));

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

	var labelOffset = 5 * this.scale;
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

mxShapeMockupMenuBar.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
};

//**********************************************************************************************************************************************************
//Sign In
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupSignIn.prototype = new mxShapeMockup();
mxShapeMockupSignIn.prototype.constructor = mxShapeMockupSignIn;

mxShapeMockupSignIn.prototype.origWidth = 200;
mxShapeMockupSignIn.prototype.origHeight = 300;
mxShapeMockupSignIn.prototype.origAspect = mxShapeMockupSignIn.prototype.origWidth / mxShapeMockupSignIn.prototype.origHeight;

function mxShapeMockupSignIn(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupSignIn.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.lineShapes = document.createElement('v:shape');
	this.configureVmlShape(this.lineShapes);
	node.appendChild(this.lineShapes);

	this.buttonShapes = document.createElement('v:shape');
	this.configureVmlShape(this.buttonShapes);
	node.appendChild(this.buttonShapes);

	this.fieldShapes = document.createElement('v:shape');
	this.configureVmlShape(this.fieldShapes);
	node.appendChild(this.fieldShapes);

	//new text
	this.signInTextPath = document.createElement('v:line');
	this.signInTextPath.style.position = 'absolute';
	this.signInTextPath.style.width = '1px';
	this.signInTextPath.style.height = '1px';
	this.signInTextPath.to = '1 0';
	this.signInTextPath.from = '0 0';

	this.signInTextFillElem = document.createElement('v:fill');
	this.signInTextFillElem.on = 'true';
	this.signInTextPath.appendChild(this.signInTextFillElem);

	this.signInTextStrokeElem = document.createElement('v:stroke');
	this.signInTextStrokeElem.on = 'false';
	this.signInTextPath.appendChild(this.signInTextStrokeElem);

	this.signInTextPathElem = document.createElement('v:path');
	this.signInTextPathElem.textpathok = 'true';
	this.signInTextPath.appendChild(this.signInTextPathElem);

	this.signInTextTpElem = document.createElement('v:textpath');
	this.signInTextTpElem.style.cssText = 'v-text-align: left';
	this.signInTextTpElem.on = 'true';
	this.signInTextPath.appendChild(this.signInTextTpElem);

	node.appendChild(this.signInTextPath);

	//new text
	this.userNameTextPath = document.createElement('v:line');
	this.userNameTextPath.style.position = 'absolute';
	this.userNameTextPath.style.width = '1px';
	this.userNameTextPath.style.height = '1px';
	this.userNameTextPath.to = '1 0';
	this.userNameTextPath.from = '0 0';

	this.userNameTextFillElem = document.createElement('v:fill');
	this.userNameTextFillElem.on = 'true';
	this.userNameTextPath.appendChild(this.userNameTextFillElem);

	this.userNameTextStrokeElem = document.createElement('v:stroke');
	this.userNameTextStrokeElem.on = 'false';
	this.userNameTextPath.appendChild(this.userNameTextStrokeElem);

	this.userNameTextPathElem = document.createElement('v:path');
	this.userNameTextPathElem.textpathok = 'true';
	this.userNameTextPath.appendChild(this.userNameTextPathElem);

	this.userNameTextTpElem = document.createElement('v:textpath');
	this.userNameTextTpElem.style.cssText = 'v-text-align: left';
	this.userNameTextTpElem.on = 'true';
	this.userNameTextPath.appendChild(this.userNameTextTpElem);

	node.appendChild(this.userNameTextPath);

	//new text
	this.userContentTextPath = document.createElement('v:line');
	this.userContentTextPath.style.position = 'absolute';
	this.userContentTextPath.style.width = '1px';
	this.userContentTextPath.style.height = '1px';
	this.userContentTextPath.to = '1 0';
	this.userContentTextPath.from = '0 0';

	this.userContentTextFillElem = document.createElement('v:fill');
	this.userContentTextFillElem.on = 'true';
	this.userContentTextPath.appendChild(this.userContentTextFillElem);

	this.userContentTextStrokeElem = document.createElement('v:stroke');
	this.userContentTextStrokeElem.on = 'false';
	this.userContentTextPath.appendChild(this.userContentTextStrokeElem);

	this.userContentTextPathElem = document.createElement('v:path');
	this.userContentTextPathElem.textpathok = 'true';
	this.userContentTextPath.appendChild(this.userContentTextPathElem);

	this.userContentTextTpElem = document.createElement('v:textpath');
	this.userContentTextTpElem.style.cssText = 'v-text-align: left';
	this.userContentTextTpElem.on = 'true';
	this.userContentTextPath.appendChild(this.userContentTextTpElem);

	node.appendChild(this.userContentTextPath);

	//new text
	this.pwTextPath = document.createElement('v:line');
	this.pwTextPath.style.position = 'absolute';
	this.pwTextPath.style.width = '1px';
	this.pwTextPath.style.height = '1px';
	this.pwTextPath.to = '1 0';
	this.pwTextPath.from = '0 0';

	this.pwTextFillElem = document.createElement('v:fill');
	this.pwTextFillElem.on = 'true';
	this.pwTextPath.appendChild(this.pwTextFillElem);

	this.pwTextStrokeElem = document.createElement('v:stroke');
	this.pwTextStrokeElem.on = 'false';
	this.pwTextPath.appendChild(this.pwTextStrokeElem);

	this.pwTextPathElem = document.createElement('v:path');
	this.pwTextPathElem.textpathok = 'true';
	this.pwTextPath.appendChild(this.pwTextPathElem);

	this.pwTextTpElem = document.createElement('v:textpath');
	this.pwTextTpElem.style.cssText = 'v-text-align: left';
	this.pwTextTpElem.on = 'true';
	this.pwTextPath.appendChild(this.pwTextTpElem);

	node.appendChild(this.pwTextPath);

	//new text
	this.pwContentTextPath = document.createElement('v:line');
	this.pwContentTextPath.style.position = 'absolute';
	this.pwContentTextPath.style.width = '1px';
	this.pwContentTextPath.style.height = '1px';
	this.pwContentTextPath.to = '1 0';
	this.pwContentTextPath.from = '0 0';

	this.pwContentTextFillElem = document.createElement('v:fill');
	this.pwContentTextFillElem.on = 'true';
	this.pwContentTextPath.appendChild(this.pwContentTextFillElem);

	this.pwContentTextStrokeElem = document.createElement('v:stroke');
	this.pwContentTextStrokeElem.on = 'false';
	this.pwContentTextPath.appendChild(this.pwContentTextStrokeElem);

	this.pwContentTextPathElem = document.createElement('v:path');
	this.pwContentTextPathElem.textpathok = 'true';
	this.pwContentTextPath.appendChild(this.pwContentTextPathElem);

	this.pwContentTextTpElem = document.createElement('v:textpath');
	this.pwContentTextTpElem.style.cssText = 'v-text-align: left';
	this.pwContentTextTpElem.on = 'true';
	this.pwContentTextPath.appendChild(this.pwContentTextTpElem);

	node.appendChild(this.pwContentTextPath);

	//new text
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

	//new text
	this.forgotTextPath = document.createElement('v:line');
	this.forgotTextPath.style.position = 'absolute';
	this.forgotTextPath.style.width = '1px';
	this.forgotTextPath.style.height = '1px';
	this.forgotTextPath.to = '1 0';
	this.forgotTextPath.from = '0 0';

	this.forgotTextFillElem = document.createElement('v:fill');
	this.forgotTextFillElem.on = 'true';
	this.forgotTextPath.appendChild(this.forgotTextFillElem);

	this.forgotTextStrokeElem = document.createElement('v:stroke');
	this.forgotTextStrokeElem.on = 'false';
	this.forgotTextPath.appendChild(this.forgotTextStrokeElem);

	this.forgotTextPathElem = document.createElement('v:path');
	this.forgotTextPathElem.textpathok = 'true';
	this.forgotTextPath.appendChild(this.forgotTextPathElem);

	this.forgotTextTpElem = document.createElement('v:textpath');
	this.forgotTextTpElem.style.cssText = 'v-text-align: left';
	this.forgotTextTpElem.on = 'true';
	this.forgotTextPath.appendChild(this.forgotTextTpElem);

	node.appendChild(this.forgotTextPath);

	//new text
	this.newUserTextPath = document.createElement('v:line');
	this.newUserTextPath.style.position = 'absolute';
	this.newUserTextPath.style.width = '1px';
	this.newUserTextPath.style.height = '1px';
	this.newUserTextPath.to = '1 0';
	this.newUserTextPath.from = '0 0';

	this.newUserTextFillElem = document.createElement('v:fill');
	this.newUserTextFillElem.on = 'true';
	this.newUserTextPath.appendChild(this.newUserTextFillElem);

	this.newUserTextStrokeElem = document.createElement('v:stroke');
	this.newUserTextStrokeElem.on = 'false';
	this.newUserTextPath.appendChild(this.newUserTextStrokeElem);

	this.newUserTextPathElem = document.createElement('v:path');
	this.newUserTextPathElem.textpathok = 'true';
	this.newUserTextPath.appendChild(this.newUserTextPathElem);

	this.newUserTextTpElem = document.createElement('v:textpath');
	this.newUserTextTpElem.style.cssText = 'v-text-align: left';
	this.newUserTextTpElem.on = 'true';
	this.newUserTextPath.appendChild(this.newUserTextTpElem);

	node.appendChild(this.newUserTextPath);

	//new text
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

mxShapeMockupSignIn.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.lineShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.lineShapes);
	this.buttonShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttonShapes);
	this.fieldShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.fieldShapes);

	this.signInText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.signInText);
	this.signInTextNode = document.createTextNode(' ');
	this.signInText.appendChild(this.signInTextNode);

	this.userNameText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.userNameText);
	this.userNameTextNode = document.createTextNode(' ');
	this.userNameText.appendChild(this.userNameTextNode);

	this.userContentText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.userContentText);
	this.userContentTextNode = document.createTextNode(' ');
	this.userContentText.appendChild(this.userContentTextNode);

	this.pwText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.pwText);
	this.pwTextNode = document.createTextNode(' ');
	this.pwText.appendChild(this.pwTextNode);

	this.pwContentText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.pwContentText);
	this.pwContentTextNode = document.createTextNode(' ');
	this.pwContentText.appendChild(this.pwContentTextNode);

	this.button1Text = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.button1Text);
	this.button1TextNode = document.createTextNode(' ');
	this.button1Text.appendChild(this.button1TextNode);

	this.forgotText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.forgotText);
	this.forgotTextNode = document.createTextNode(' ');
	this.forgotText.appendChild(this.forgotTextNode);

	this.newUserText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.newUserText);
	this.newUserTextNode = document.createTextNode(' ');
	this.newUserText.appendChild(this.newUserTextNode);

	this.button2Text = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.button2Text);
	this.button2TextNode = document.createTextNode(' ');
	this.button2Text.appendChild(this.button2TextNode);

	return this.g;
};

mxShapeMockupSignIn.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var buttonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_COLOR, '#444444');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.lineShapes);
	this.updateVmlShape(this.buttonShapes);
	this.updateVmlShape(this.fieldShapes);
	this.updateVmlShape(this.signInTextPath);
	this.updateVmlShape(this.userNameTextPath);
	this.updateVmlShape(this.userContentTextPath);
	this.updateVmlShape(this.pwTextPath);
	this.updateVmlShape(this.pwContentTextPath);
	this.updateVmlShape(this.button1TextPath);
	this.updateVmlShape(this.forgotTextPath);
	this.updateVmlShape(this.newUserTextPath);
	this.updateVmlShape(this.button2TextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.lineShapes.path = this.createPath(arg, 'lineShapes');
	this.buttonShapes.path = this.createPath(arg, 'buttonShapes');
	this.fieldShapes.path = this.createPath(arg, 'fieldShapes');

	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.lineShapes.strokecolor = strokeColor;
	this.lineShapes.fillcolor = 'none';
	this.lineShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.buttonShapes.strokecolor = strokeColor;
	this.buttonShapes.fillcolor = buttonColor;
	this.buttonShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.fieldShapes.strokecolor = strokeColor;
	this.fieldShapes.fillcolor = '#ffffff';
	this.fieldShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	//new text block
	this.signInTextFillElem.color = fontColor;
	this.signInTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	var yPos = Math.round(arg.dy + arg.h * 0.09);
	var xPos = Math.round(arg.dx + arg.w * 0.05);
	this.signInTextPath.to = (xPos + 1) + ' ' + yPos;
	this.signInTextPath.from = xPos + ' ' + yPos;
	this.signInTextPath.style.width = '1px';
	this.signInTextPath.style.height = '1px';

	this.signInTextTpElem.string = 'Sign In';

	//new text block
	this.userNameTextFillElem.color = fontColor;
	this.userNameTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.19);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.userNameTextPath.to = (xPos + 1) + ' ' + yPos;
	this.userNameTextPath.from = xPos + ' ' + yPos;
	this.userNameTextPath.style.width = '1px';
	this.userNameTextPath.style.height = '1px';

	this.userNameTextTpElem.string = 'User Name:';

	//new text block
	this.userContentTextFillElem.color = fontColor;
	this.userContentTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.26);
	xPos = Math.round(arg.dx + arg.w * 0.075);
	this.userContentTextPath.to = (xPos + 1) + ' ' + yPos;
	this.userContentTextPath.from = xPos + ' ' + yPos;
	this.userContentTextPath.style.width = '1px';
	this.userContentTextPath.style.height = '1px';

	this.userContentTextTpElem.string = 'johndoe';

	//new text block
	this.pwTextFillElem.color = fontColor;
	this.pwTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.37);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.pwTextPath.to = (xPos + 1) + ' ' + yPos;
	this.pwTextPath.from = xPos + ' ' + yPos;
	this.pwTextPath.style.width = '1px';
	this.pwTextPath.style.height = '1px';

	this.pwTextTpElem.string = 'Password:';

	//new text block
	this.pwContentTextFillElem.color = fontColor;
	this.pwContentTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.46);
	xPos = Math.round(arg.dx + arg.w * 0.075);
	this.pwContentTextPath.to = (xPos + 1) + ' ' + yPos;
	this.pwContentTextPath.from = xPos + ' ' + yPos;
	this.pwContentTextPath.style.width = '1px';
	this.pwContentTextPath.style.height = '1px';

	this.pwContentTextTpElem.string = '********';

	//new text block
	this.button1TextFillElem.color = '#ffffff';
	this.button1TextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	this.button1TextTpElem.style.fontWeight = 'bold';
	yPos = Math.round(arg.dy + arg.h * 0.57);
	xPos = Math.round(arg.dx + arg.w * 0.25);
	this.button1TextPath.to = (xPos + 1) + ' ' + yPos;
	this.button1TextPath.from = xPos + ' ' + yPos;
	this.button1TextPath.style.width = '1px';
	this.button1TextPath.style.height = '1px';

	this.button1TextTpElem.string = 'SIGN IN';

	//new text block
	this.forgotTextFillElem.color = fontColor;
	this.forgotTextTpElem.style.font = 'italic normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.67);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.forgotTextPath.to = (xPos + 1) + ' ' + yPos;
	this.forgotTextPath.from = xPos + ' ' + yPos;
	this.forgotTextPath.style.width = '1px';
	this.forgotTextPath.style.height = '1px';

	this.forgotTextTpElem.string = 'Forgot password?';

	//new text block
	this.newUserTextFillElem.color = fontColor;
	this.newUserTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.79);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.newUserTextPath.to = (xPos + 1) + ' ' + yPos;
	this.newUserTextPath.from = xPos + ' ' + yPos;
	this.newUserTextPath.style.width = '1px';
	this.newUserTextPath.style.height = '1px';

	this.newUserTextTpElem.string = 'New User';

	//new text block
	this.button2TextFillElem.color = '#ffffff';

	this.button2TextTpElem.style.fontSize = Math.round(fontSize * this.scale) + 'px';
	this.button2TextTpElem.style.fontWeight = 'bold';
	yPos = Math.round(arg.dy + arg.h * 0.89);
	xPos = Math.round(arg.dx + arg.w * 0.25);
	this.button2TextPath.to = (xPos + 1) + ' ' + yPos;
	this.button2TextPath.from = xPos + ' ' + yPos;
	this.button2TextPath.style.width = '1px';
	this.button2TextPath.style.height = '1px';

	this.button2TextTpElem.string = 'SIGN UP';

	this.updateRotation();
};

mxShapeMockupSignIn.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var buttonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_COLOR, '#444444');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.lineShapes.setAttribute('d', this.createPath(arg, 'lineShapes'));
	this.buttonShapes.setAttribute('d', this.createPath(arg, 'buttonShapes'));
	this.fieldShapes.setAttribute('d', this.createPath(arg, 'fieldShapes'));

	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.lineShapes.setAttribute('stroke', strokeColor);
	this.lineShapes.setAttribute('fill', 'none');
	this.lineShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.buttonShapes.setAttribute('stroke', strokeColor);
	this.buttonShapes.setAttribute('fill', buttonColor);
	this.buttonShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.fieldShapes.setAttribute('stroke', strokeColor);
	this.fieldShapes.setAttribute('fill', '#ffffff');
	this.fieldShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	// new text block
	this.signInText.setAttribute('fill', fontColor);
	this.signInText.setAttribute('font-size', fontSize * this.scale);
	this.signInText.setAttribute('text-anchor', 'start');
	this.signInText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.signInText.setAttribute('y', this.bounds.y + arg.h * 0.1);

	if (this.signInTextNode !== null || typeof this.signInTextNode !== 'undefined')
	{
		this.signInText.removeChild(this.signInTextNode);
	}

	this.signInTextNode = document.createTextNode('Sign In');
	this.signInText.appendChild(this.signInTextNode);

	// new text block
	this.userNameText.setAttribute('fill', fontColor);
	this.userNameText.setAttribute('font-size', fontSize * this.scale);
	this.userNameText.setAttribute('text-anchor', 'start');
	this.userNameText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.userNameText.setAttribute('y', this.bounds.y + arg.h * 0.2);

	if (this.userNameTextNode !== null || typeof this.userNameTextNode !== 'undefined')
	{
		this.userNameText.removeChild(this.userNameTextNode);
	}

	this.userNameTextNode = document.createTextNode('User Name:');
	this.userNameText.appendChild(this.userNameTextNode);

	// new text block
	this.userContentText.setAttribute('fill', fontColor);
	this.userContentText.setAttribute('font-size', fontSize * this.scale);
	this.userContentText.setAttribute('text-anchor', 'start');
	this.userContentText.setAttribute('x', this.bounds.x + arg.w * 0.075);
	this.userContentText.setAttribute('y', this.bounds.y + arg.h * 0.27);

	if (this.userContentTextNode !== null || typeof this.userContentTextNode !== 'undefined')
	{
		this.userContentText.removeChild(this.userContentTextNode);
	}

	this.userContentTextNode = document.createTextNode('johndoe');
	this.userContentText.appendChild(this.userContentTextNode);

	// new text block
	this.pwText.setAttribute('fill', fontColor);
	this.pwText.setAttribute('font-size', fontSize * this.scale);
	this.pwText.setAttribute('text-anchor', 'start');
	this.pwText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.pwText.setAttribute('y', this.bounds.y + arg.h * 0.38);

	if (this.pwTextNode !== null || typeof this.pwTextNode !== 'undefined')
	{
		this.pwText.removeChild(this.pwTextNode);
	}

	this.pwTextNode = document.createTextNode('Password:');
	this.pwText.appendChild(this.pwTextNode);

	// new text block
	this.pwContentText.setAttribute('fill', fontColor);
	this.pwContentText.setAttribute('font-size', fontSize * this.scale);
	this.pwContentText.setAttribute('text-anchor', 'start');
	this.pwContentText.setAttribute('x', this.bounds.x + arg.w * 0.075);
	this.pwContentText.setAttribute('y', this.bounds.y + arg.h * 0.47);

	if (this.pwContentTextNode !== null || typeof this.pwContentTextNode !== 'undefined')
	{
		this.pwContentText.removeChild(this.pwContentTextNode);
	}

	this.pwContentTextNode = document.createTextNode('********');
	this.pwContentText.appendChild(this.pwContentTextNode);

	// new text block
	this.button1Text.setAttribute('fill', '#ffffff');
	this.button1Text.setAttribute('font-size', fontSize * this.scale * 1.2);
	this.button1Text.setAttribute('font-weight', 'bold');
	this.button1Text.setAttribute('text-anchor', 'middle');
	this.button1Text.setAttribute('x', this.bounds.x + arg.w * 0.25);
	this.button1Text.setAttribute('y', this.bounds.y + arg.h * 0.58);

	if (this.button1TextNode !== null || typeof this.button1TextNode !== 'undefined')
	{
		this.button1Text.removeChild(this.button1TextNode);
	}

	this.button1TextNode = document.createTextNode('SIGN IN');
	this.button1Text.appendChild(this.button1TextNode);

	// new text block
	this.forgotText.setAttribute('fill', fontColor);
	this.forgotText.setAttribute('font-size', fontSize * this.scale);
	this.forgotText.setAttribute('font-style', 'italic');
	this.forgotText.setAttribute('text-decoration', 'underline');
	this.forgotText.setAttribute('text-anchor', 'start');
	this.forgotText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.forgotText.setAttribute('y', this.bounds.y + arg.h * 0.68);

	if (this.forgotTextNode !== null || typeof this.forgotTextNode !== 'undefined')
	{
		this.forgotText.removeChild(this.forgotTextNode);
	}

	this.forgotTextNode = document.createTextNode('Forgot password?');
	this.forgotText.appendChild(this.forgotTextNode);

	// new text block
	this.newUserText.setAttribute('fill', fontColor);
	this.newUserText.setAttribute('font-size', fontSize * this.scale);
	this.newUserText.setAttribute('text-anchor', 'start');
	this.newUserText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.newUserText.setAttribute('y', this.bounds.y + arg.h * 0.8);

	if (this.newUserTextNode !== null || typeof this.newUserTextNode !== 'undefined')
	{
		this.newUserText.removeChild(this.newUserTextNode);
	}

	this.newUserTextNode = document.createTextNode('New User');
	this.newUserText.appendChild(this.newUserTextNode);

	// new text block
	this.button2Text.setAttribute('fill', '#ffffff');
	this.button2Text.setAttribute('font-size', fontSize * this.scale * 1.2);
	this.button2Text.setAttribute('font-weight', 'bold');
	this.button2Text.setAttribute('text-anchor', 'middle');
	this.button2Text.setAttribute('x', this.bounds.x + arg.w * 0.25);
	this.button2Text.setAttribute('y', this.bounds.y + arg.h * 0.9);

	if (this.button2TextNode !== null || typeof this.button2TextNode !== 'undefined')
	{
		this.button2Text.removeChild(this.button2TextNode);
	}

	this.button2TextNode = document.createTextNode('SIGN UP');
	this.button2Text.appendChild(this.button2TextNode);

	this.updateRotation();
};

mxShapeMockupSignIn.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'lineShapes')
	{
		path.moveTo(dx + w * 0.05, dy + h * 0.12);
		path.lineTo(dx + w * 0.95, dy + h * 0.12);
		path.moveTo(dx + w * 0.05, dy + h * 0.72);
		path.lineTo(dx + w * 0.95, dy + h * 0.72);
	}
	else if (shape === 'buttonShapes')
	{
		path.moveTo(dx + w * 0.09, dy + h * 0.52);
		path.lineTo(dx + w * 0.45, dy + h * 0.52);
		path.lineTo(dx + w * 0.45, dy + h * 0.61);
		path.lineTo(dx + w * 0.09, dy + h * 0.61);
		path.close();
		path.moveTo(dx + w * 0.09, dy + h * 0.84);
		path.lineTo(dx + w * 0.45, dy + h * 0.84);
		path.lineTo(dx + w * 0.45, dy + h * 0.93);
		path.lineTo(dx + w * 0.09, dy + h * 0.93);
		path.close();
	}
	else if (shape === 'fieldShapes')
	{
		path.moveTo(dx + w * 0.05, dy + h * 0.22);
		path.lineTo(dx + w * 0.8, dy + h * 0.22);
		path.lineTo(dx + w * 0.8, dy + h * 0.3);
		path.lineTo(dx + w * 0.05, dy + h * 0.3);
		path.close();
		path.moveTo(dx + w * 0.05, dy + h * 0.4);
		path.lineTo(dx + w * 0.8, dy + h * 0.4);
		path.lineTo(dx + w * 0.8, dy + h * 0.48);
		path.lineTo(dx + w * 0.05, dy + h * 0.48);
		path.close();
	}
};

//**********************************************************************************************************************************************************
//Sign Up
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
mxShapeMockupSignUp.prototype = new mxShapeMockup();
mxShapeMockupSignUp.prototype.constructor = mxShapeMockupSignUp;

mxShapeMockupSignUp.prototype.origWidth = 400;
mxShapeMockupSignUp.prototype.origHeight = 270;
mxShapeMockupSignUp.prototype.origAspect = mxShapeMockupSignUp.prototype.origWidth / mxShapeMockupSignUp.prototype.origHeight;

function mxShapeMockupSignUp(bounds, fill, stroke, strokewidth)
{
	mxShapeMockup.call(bounds, fill, stroke, strokewidth);
};

/**
* Function: createVml
*
* Creates and returns the VML node to represent this shape.
*/
mxShapeMockupSignUp.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);

	this.lineShapes = document.createElement('v:shape');
	this.configureVmlShape(this.lineShapes);
	node.appendChild(this.lineShapes);

	this.buttonShapes = document.createElement('v:shape');
	this.configureVmlShape(this.buttonShapes);
	node.appendChild(this.buttonShapes);

	this.fieldShapes = document.createElement('v:shape');
	this.configureVmlShape(this.fieldShapes);
	node.appendChild(this.fieldShapes);

	//new text
	this.signUpTextPath = document.createElement('v:line');
	this.signUpTextPath.style.position = 'absolute';
	this.signUpTextPath.style.width = '1px';
	this.signUpTextPath.style.height = '1px';
	this.signUpTextPath.to = '1 0';
	this.signUpTextPath.from = '0 0';

	this.signUpTextFillElem = document.createElement('v:fill');
	this.signUpTextFillElem.on = 'true';
	this.signUpTextPath.appendChild(this.signUpTextFillElem);

	this.signUpTextStrokeElem = document.createElement('v:stroke');
	this.signUpTextStrokeElem.on = 'false';
	this.signUpTextPath.appendChild(this.signUpTextStrokeElem);

	this.signUpTextPathElem = document.createElement('v:path');
	this.signUpTextPathElem.textpathok = 'true';
	this.signUpTextPath.appendChild(this.signUpTextPathElem);

	this.signUpTextTpElem = document.createElement('v:textpath');
	this.signUpTextTpElem.style.cssText = 'v-text-align: left';
	this.signUpTextTpElem.on = 'true';
	this.signUpTextPath.appendChild(this.signUpTextTpElem);

	node.appendChild(this.signUpTextPath);

	//new text
	this.loginNameTextPath = document.createElement('v:line');
	this.loginNameTextPath.style.position = 'absolute';
	this.loginNameTextPath.style.width = '1px';
	this.loginNameTextPath.style.height = '1px';
	this.loginNameTextPath.to = '1 0';
	this.loginNameTextPath.from = '0 0';

	this.loginNameTextFillElem = document.createElement('v:fill');
	this.loginNameTextFillElem.on = 'true';
	this.loginNameTextPath.appendChild(this.loginNameTextFillElem);

	this.loginNameTextStrokeElem = document.createElement('v:stroke');
	this.loginNameTextStrokeElem.on = 'false';
	this.loginNameTextPath.appendChild(this.loginNameTextStrokeElem);

	this.loginNameTextPathElem = document.createElement('v:path');
	this.loginNameTextPathElem.textpathok = 'true';
	this.loginNameTextPath.appendChild(this.loginNameTextPathElem);

	this.loginNameTextTpElem = document.createElement('v:textpath');
	this.loginNameTextTpElem.style.cssText = 'v-text-align: left';
	this.loginNameTextTpElem.on = 'true';
	this.loginNameTextPath.appendChild(this.loginNameTextTpElem);

	node.appendChild(this.loginNameTextPath);

	//new text
	this.loginContentTextPath = document.createElement('v:line');
	this.loginContentTextPath.style.position = 'absolute';
	this.loginContentTextPath.style.width = '1px';
	this.loginContentTextPath.style.height = '1px';
	this.loginContentTextPath.to = '1 0';
	this.loginContentTextPath.from = '0 0';

	this.loginContentTextFillElem = document.createElement('v:fill');
	this.loginContentTextFillElem.on = 'true';
	this.loginContentTextPath.appendChild(this.loginContentTextFillElem);

	this.loginContentTextStrokeElem = document.createElement('v:stroke');
	this.loginContentTextStrokeElem.on = 'false';
	this.loginContentTextPath.appendChild(this.loginContentTextStrokeElem);

	this.loginContentTextPathElem = document.createElement('v:path');
	this.loginContentTextPathElem.textpathok = 'true';
	this.loginContentTextPath.appendChild(this.loginContentTextPathElem);

	this.loginContentTextTpElem = document.createElement('v:textpath');
	this.loginContentTextTpElem.style.cssText = 'v-text-align: left';
	this.loginContentTextTpElem.on = 'true';
	this.loginContentTextPath.appendChild(this.loginContentTextTpElem);

	node.appendChild(this.loginContentTextPath);

	//new text
	this.emailTextPath = document.createElement('v:line');
	this.emailTextPath.style.position = 'absolute';
	this.emailTextPath.style.width = '1px';
	this.emailTextPath.style.height = '1px';
	this.emailTextPath.to = '1 0';
	this.emailTextPath.from = '0 0';

	this.emailTextFillElem = document.createElement('v:fill');
	this.emailTextFillElem.on = 'true';
	this.emailTextPath.appendChild(this.emailTextFillElem);

	this.emailTextStrokeElem = document.createElement('v:stroke');
	this.emailTextStrokeElem.on = 'false';
	this.emailTextPath.appendChild(this.emailTextStrokeElem);

	this.emailTextPathElem = document.createElement('v:path');
	this.emailTextPathElem.textpathok = 'true';
	this.emailTextPath.appendChild(this.emailTextPathElem);

	this.emailTextTpElem = document.createElement('v:textpath');
	this.emailTextTpElem.style.cssText = 'v-text-align: left';
	this.emailTextTpElem.on = 'true';
	this.emailTextPath.appendChild(this.emailTextTpElem);

	node.appendChild(this.emailTextPath);

	//new text
	this.emailContentTextPath = document.createElement('v:line');
	this.emailContentTextPath.style.position = 'absolute';
	this.emailContentTextPath.style.width = '1px';
	this.emailContentTextPath.style.height = '1px';
	this.emailContentTextPath.to = '1 0';
	this.emailContentTextPath.from = '0 0';

	this.emailContentTextFillElem = document.createElement('v:fill');
	this.emailContentTextFillElem.on = 'true';
	this.emailContentTextPath.appendChild(this.emailContentTextFillElem);

	this.emailContentTextStrokeElem = document.createElement('v:stroke');
	this.emailContentTextStrokeElem.on = 'false';
	this.emailContentTextPath.appendChild(this.emailContentTextStrokeElem);

	this.emailContentTextPathElem = document.createElement('v:path');
	this.emailContentTextPathElem.textpathok = 'true';
	this.emailContentTextPath.appendChild(this.emailContentTextPathElem);

	this.emailContentTextTpElem = document.createElement('v:textpath');
	this.emailContentTextTpElem.style.cssText = 'v-text-align: left';
	this.emailContentTextTpElem.on = 'true';
	this.emailContentTextPath.appendChild(this.emailContentTextTpElem);

	node.appendChild(this.emailContentTextPath);

	//new text
	this.pwTextPath = document.createElement('v:line');
	this.pwTextPath.style.position = 'absolute';
	this.pwTextPath.style.width = '1px';
	this.pwTextPath.style.height = '1px';
	this.pwTextPath.to = '1 0';
	this.pwTextPath.from = '0 0';

	this.pwTextFillElem = document.createElement('v:fill');
	this.pwTextFillElem.on = 'true';
	this.pwTextPath.appendChild(this.pwTextFillElem);

	this.pwTextStrokeElem = document.createElement('v:stroke');
	this.pwTextStrokeElem.on = 'false';
	this.pwTextPath.appendChild(this.pwTextStrokeElem);

	this.pwTextPathElem = document.createElement('v:path');
	this.pwTextPathElem.textpathok = 'true';
	this.pwTextPath.appendChild(this.pwTextPathElem);

	this.pwTextTpElem = document.createElement('v:textpath');
	this.pwTextTpElem.style.cssText = 'v-text-align: left';
	this.pwTextTpElem.on = 'true';
	this.pwTextPath.appendChild(this.pwTextTpElem);

	node.appendChild(this.pwTextPath);

	//new text
	this.pwContentTextPath = document.createElement('v:line');
	this.pwContentTextPath.style.position = 'absolute';
	this.pwContentTextPath.style.width = '1px';
	this.pwContentTextPath.style.height = '1px';
	this.pwContentTextPath.to = '1 0';
	this.pwContentTextPath.from = '0 0';

	this.pwContentTextFillElem = document.createElement('v:fill');
	this.pwContentTextFillElem.on = 'true';
	this.pwContentTextPath.appendChild(this.pwContentTextFillElem);

	this.pwContentTextStrokeElem = document.createElement('v:stroke');
	this.pwContentTextStrokeElem.on = 'false';
	this.pwContentTextPath.appendChild(this.pwContentTextStrokeElem);

	this.pwContentTextPathElem = document.createElement('v:path');
	this.pwContentTextPathElem.textpathok = 'true';
	this.pwContentTextPath.appendChild(this.pwContentTextPathElem);

	this.pwContentTextTpElem = document.createElement('v:textpath');
	this.pwContentTextTpElem.style.cssText = 'v-text-align: left';
	this.pwContentTextTpElem.on = 'true';
	this.pwContentTextPath.appendChild(this.pwContentTextTpElem);

	node.appendChild(this.pwContentTextPath);

	//new text
	this.confPwTextPath = document.createElement('v:line');
	this.confPwTextPath.style.position = 'absolute';
	this.confPwTextPath.style.width = '1px';
	this.confPwTextPath.style.height = '1px';
	this.confPwTextPath.to = '1 0';
	this.confPwTextPath.from = '0 0';

	this.confPwTextFillElem = document.createElement('v:fill');
	this.confPwTextFillElem.on = 'true';
	this.confPwTextPath.appendChild(this.confPwTextFillElem);

	this.confPwTextStrokeElem = document.createElement('v:stroke');
	this.confPwTextStrokeElem.on = 'false';
	this.confPwTextPath.appendChild(this.confPwTextStrokeElem);

	this.confPwTextPathElem = document.createElement('v:path');
	this.confPwTextPathElem.textpathok = 'true';
	this.confPwTextPath.appendChild(this.confPwTextPathElem);

	this.confPwTextTpElem = document.createElement('v:textpath');
	this.confPwTextTpElem.style.cssText = 'v-text-align: left';
	this.confPwTextTpElem.on = 'true';
	this.confPwTextPath.appendChild(this.confPwTextTpElem);

	node.appendChild(this.confPwTextPath);

	//new text
	this.confPwContentTextPath = document.createElement('v:line');
	this.confPwContentTextPath.style.position = 'absolute';
	this.confPwContentTextPath.style.width = '1px';
	this.confPwContentTextPath.style.height = '1px';
	this.confPwContentTextPath.to = '1 0';
	this.confPwContentTextPath.from = '0 0';

	this.confPwContentTextFillElem = document.createElement('v:fill');
	this.confPwContentTextFillElem.on = 'true';
	this.confPwContentTextPath.appendChild(this.confPwContentTextFillElem);

	this.confPwContentTextStrokeElem = document.createElement('v:stroke');
	this.confPwContentTextStrokeElem.on = 'false';
	this.confPwContentTextPath.appendChild(this.confPwContentTextStrokeElem);

	this.confPwContentTextPathElem = document.createElement('v:path');
	this.confPwContentTextPathElem.textpathok = 'true';
	this.confPwContentTextPath.appendChild(this.confPwContentTextPathElem);

	this.confPwContentTextTpElem = document.createElement('v:textpath');
	this.confPwContentTextTpElem.style.cssText = 'v-text-align: left';
	this.confPwContentTextTpElem.on = 'true';
	this.confPwContentTextPath.appendChild(this.confPwContentTextTpElem);

	node.appendChild(this.confPwContentTextPath);

	//new text
	this.rememberTextPath = document.createElement('v:line');
	this.rememberTextPath.style.position = 'absolute';
	this.rememberTextPath.style.width = '1px';
	this.rememberTextPath.style.height = '1px';
	this.rememberTextPath.to = '1 0';
	this.rememberTextPath.from = '0 0';

	this.rememberTextFillElem = document.createElement('v:fill');
	this.rememberTextFillElem.on = 'true';
	this.rememberTextPath.appendChild(this.rememberTextFillElem);

	this.rememberTextStrokeElem = document.createElement('v:stroke');
	this.rememberTextStrokeElem.on = 'false';
	this.rememberTextPath.appendChild(this.rememberTextStrokeElem);

	this.rememberTextPathElem = document.createElement('v:path');
	this.rememberTextPathElem.textpathok = 'true';
	this.rememberTextPath.appendChild(this.rememberTextPathElem);

	this.rememberTextTpElem = document.createElement('v:textpath');
	this.rememberTextTpElem.style.cssText = 'v-text-align: left';
	this.rememberTextTpElem.on = 'true';
	this.rememberTextPath.appendChild(this.rememberTextTpElem);

	node.appendChild(this.rememberTextPath);

	//new text
	this.buttonTextPath = document.createElement('v:line');
	this.buttonTextPath.style.position = 'absolute';
	this.buttonTextPath.style.width = '1px';
	this.buttonTextPath.style.height = '1px';
	this.buttonTextPath.to = '1 0';
	this.buttonTextPath.from = '0 0';

	this.buttonTextFillElem = document.createElement('v:fill');
	this.buttonTextFillElem.on = 'true';
	this.buttonTextPath.appendChild(this.buttonTextFillElem);

	this.buttonTextStrokeElem = document.createElement('v:stroke');
	this.buttonTextStrokeElem.on = 'false';
	this.buttonTextPath.appendChild(this.buttonTextStrokeElem);

	this.buttonTextPathElem = document.createElement('v:path');
	this.buttonTextPathElem.textpathok = 'true';
	this.buttonTextPath.appendChild(this.buttonTextPathElem);

	this.buttonTextTpElem = document.createElement('v:textpath');
	this.buttonTextTpElem.style.cssText = 'v-text-align: center';
	this.buttonTextTpElem.on = 'true';
	this.buttonTextPath.appendChild(this.buttonTextTpElem);

	node.appendChild(this.buttonTextPath);

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

mxShapeMockupSignUp.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');
	this.lineShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.lineShapes);
	this.buttonShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.buttonShapes);
	this.fieldShapes = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.fieldShapes);

	this.signUpText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.signUpText);
	this.signUpTextNode = document.createTextNode(' ');
	this.signUpText.appendChild(this.signUpTextNode);

	this.loginNameText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.loginNameText);
	this.loginNameTextNode = document.createTextNode(' ');
	this.loginNameText.appendChild(this.loginNameTextNode);

	this.loginContentText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.loginContentText);
	this.loginContentTextNode = document.createTextNode(' ');
	this.loginContentText.appendChild(this.loginContentTextNode);

	this.emailText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.emailText);
	this.emailTextNode = document.createTextNode(' ');
	this.emailText.appendChild(this.emailTextNode);

	this.emailContentText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.emailContentText);
	this.emailContentTextNode = document.createTextNode(' ');
	this.emailContentText.appendChild(this.emailContentTextNode);

	this.pwText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.pwText);
	this.pwTextNode = document.createTextNode(' ');
	this.pwText.appendChild(this.pwTextNode);

	this.pwContentText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.pwContentText);
	this.pwContentTextNode = document.createTextNode(' ');
	this.pwContentText.appendChild(this.pwContentTextNode);

	this.confPwText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.confPwText);
	this.confPwTextNode = document.createTextNode(' ');
	this.confPwText.appendChild(this.confPwTextNode);

	this.confPwContentText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.confPwContentText);
	this.confPwContentTextNode = document.createTextNode(' ');
	this.confPwContentText.appendChild(this.confPwContentTextNode);

	this.rememberText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.rememberText);
	this.rememberTextNode = document.createTextNode(' ');
	this.rememberText.appendChild(this.rememberTextNode);

	this.buttonText = document.createElementNS(mxConstants.NS_SVG, 'text');
	this.g.appendChild(this.buttonText);
	this.buttonTextNode = document.createTextNode(' ');
	this.buttonText.appendChild(this.buttonTextNode);
	return this.g;
};

mxShapeMockupSignUp.prototype.redrawVml = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var buttonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_COLOR, '#444444');
	this.strokewidth = mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1');

	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.lineShapes);
	this.updateVmlShape(this.buttonShapes);
	this.updateVmlShape(this.fieldShapes);
	this.updateVmlShape(this.signUpTextPath);
	this.updateVmlShape(this.loginNameTextPath);
	this.updateVmlShape(this.loginContentTextPath);
	this.updateVmlShape(this.emailTextPath);
	this.updateVmlShape(this.emailContentTextPath);
	this.updateVmlShape(this.pwTextPath);
	this.updateVmlShape(this.pwContentTextPath);
	this.updateVmlShape(this.confPwTextPath);
	this.updateVmlShape(this.confPwContentTextPath);
	this.updateVmlShape(this.rememberTextPath);
	this.updateVmlShape(this.buttonTextPath);

	this.shadowNode = null;
	this.background.path = this.createPath(arg, 'background');
	this.lineShapes.path = this.createPath(arg, 'lineShapes');
	this.buttonShapes.path = this.createPath(arg, 'buttonShapes');
	this.fieldShapes.path = this.createPath(arg, 'fieldShapes');

	this.background.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.lineShapes.strokecolor = strokeColor;
	this.lineShapes.fillcolor = 'none';
	this.lineShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.buttonShapes.strokecolor = strokeColor;
	this.buttonShapes.fillcolor = buttonColor;
	this.buttonShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	this.fieldShapes.strokecolor = strokeColor;
	this.fieldShapes.fillcolor = '#ffffff';
	this.fieldShapes.strokeweight = Math.round(this.strokewidth * this.scale) + 'px';

	//new text block
	this.signUpTextFillElem.color = fontColor;
	this.signUpTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	var yPos = Math.round(arg.dy + arg.h * 0.09);
	var xPos = Math.round(arg.dx + arg.w * 0.05);
	this.signUpTextPath.to = (xPos + 1) + ' ' + yPos;
	this.signUpTextPath.from = xPos + ' ' + yPos;
	this.signUpTextPath.style.width = '1px';
	this.signUpTextPath.style.height = '1px';

	this.signUpTextTpElem.string = 'Sign In';

	//new text block
	this.loginNameTextFillElem.color = fontColor;
	this.loginNameTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.19);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.loginNameTextPath.to = (xPos + 1) + ' ' + yPos;
	this.loginNameTextPath.from = xPos + ' ' + yPos;
	this.loginNameTextPath.style.width = '1px';
	this.loginNameTextPath.style.height = '1px';

	this.loginNameTextTpElem.string = 'User Name:';

	//new text block
	this.loginContentTextFillElem.color = fontColor;
	this.loginContentTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.26);
	xPos = Math.round(arg.dx + arg.w * 0.075);
	this.loginContentTextPath.to = (xPos + 1) + ' ' + yPos;
	this.loginContentTextPath.from = xPos + ' ' + yPos;
	this.loginContentTextPath.style.width = '1px';
	this.loginContentTextPath.style.height = '1px';

	this.loginContentTextTpElem.string = 'johndoe';

	//new text block
	this.emailTextFillElem.color = fontColor;
	this.emailTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.19);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.emailTextPath.to = (xPos + 1) + ' ' + yPos;
	this.emailTextPath.from = xPos + ' ' + yPos;
	this.emailTextPath.style.width = '1px';
	this.emailTextPath.style.height = '1px';

	this.emailTextTpElem.string = 'User Name:';

	//new text block
	this.emailContentTextFillElem.color = fontColor;
	this.emailContentTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.26);
	xPos = Math.round(arg.dx + arg.w * 0.075);
	this.emailContentTextPath.to = (xPos + 1) + ' ' + yPos;
	this.emailContentTextPath.from = xPos + ' ' + yPos;
	this.emailContentTextPath.style.width = '1px';
	this.emailContentTextPath.style.height = '1px';

	this.emailContentTextTpElem.string = 'johndoe';

	//new text block
	this.pwTextFillElem.color = fontColor;
	this.pwTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.37);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.pwTextPath.to = (xPos + 1) + ' ' + yPos;
	this.pwTextPath.from = xPos + ' ' + yPos;
	this.pwTextPath.style.width = '1px';
	this.pwTextPath.style.height = '1px';

	this.pwTextTpElem.string = 'Password:';

	//new text block
	this.pwContentTextFillElem.color = fontColor;
	this.pwContentTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.46);
	xPos = Math.round(arg.dx + arg.w * 0.075);
	this.pwContentTextPath.to = (xPos + 1) + ' ' + yPos;
	this.pwContentTextPath.from = xPos + ' ' + yPos;
	this.pwContentTextPath.style.width = '1px';
	this.pwContentTextPath.style.height = '1px';

	this.pwContentTextTpElem.string = '********';

	//new text block
	this.confPwTextFillElem.color = fontColor;
	this.confPwTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.37);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.confPwTextPath.to = (xPos + 1) + ' ' + yPos;
	this.confPwTextPath.from = xPos + ' ' + yPos;
	this.confPwTextPath.style.width = '1px';
	this.confPwTextPath.style.height = '1px';

	this.confPwTextTpElem.string = 'Password:';

	//new text block
	this.confPwContentTextFillElem.color = fontColor;
	this.confPwContentTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.46);
	xPos = Math.round(arg.dx + arg.w * 0.075);
	this.confPwContentTextPath.to = (xPos + 1) + ' ' + yPos;
	this.confPwContentTextPath.from = xPos + ' ' + yPos;
	this.confPwContentTextPath.style.width = '1px';
	this.confPwContentTextPath.style.height = '1px';

	this.confPwContentTextTpElem.string = '********';

	//new text block
	this.rememberTextFillElem.color = fontColor;
	this.rememberTextTpElem.style.font = 'italic normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	yPos = Math.round(arg.dy + arg.h * 0.67);
	xPos = Math.round(arg.dx + arg.w * 0.05);
	this.rememberTextPath.to = (xPos + 1) + ' ' + yPos;
	this.rememberTextPath.from = xPos + ' ' + yPos;
	this.rememberTextPath.style.width = '1px';
	this.rememberTextPath.style.height = '1px';

	this.rememberTextTpElem.string = 'Forgot password?';

	//new text block
	this.buttonTextFillElem.color = '#ffffff';
	this.buttonTextTpElem.style.font = 'normal normal normal ' + Math.round(fontSize * this.scale) + 'px Arial';
	this.buttonTextTpElem.style.fontWeight = 'bold';
	yPos = Math.round(arg.dy + arg.h * 0.57);
	xPos = Math.round(arg.dx + arg.w * 0.25);
	this.buttonTextPath.to = (xPos + 1) + ' ' + yPos;
	this.buttonTextPath.from = xPos + ' ' + yPos;
	this.buttonTextPath.style.width = '1px';
	this.buttonTextPath.style.height = '1px';

	this.buttonTextTpElem.string = 'SIGN IN';

	this.updateRotation();
};

mxShapeMockupSignUp.prototype.redrawSvg = function()
{
	var arg = this.calcArgs();
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '30');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var buttonColor = mxUtils.getValue(this.style, mxShapeMockup.prototype.cst.BUTTON_COLOR, '#444444');
	this.strokewidth = mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1');

	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));
	this.lineShapes.setAttribute('d', this.createPath(arg, 'lineShapes'));
	this.buttonShapes.setAttribute('d', this.createPath(arg, 'buttonShapes'));
	this.fieldShapes.setAttribute('d', this.createPath(arg, 'fieldShapes'));

	this.innerNode.setAttribute('stroke-width', this.strokewidth * this.scale);

	this.lineShapes.setAttribute('stroke', strokeColor);
	this.lineShapes.setAttribute('fill', 'none');
	this.lineShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.buttonShapes.setAttribute('stroke', strokeColor);
	this.buttonShapes.setAttribute('fill', buttonColor);
	this.buttonShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	this.fieldShapes.setAttribute('stroke', strokeColor);
	this.fieldShapes.setAttribute('fill', '#ffffff');
	this.fieldShapes.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));

	// new text block
	this.signUpText.setAttribute('fill', fontColor);
	this.signUpText.setAttribute('font-size', fontSize * this.scale);
	this.signUpText.setAttribute('text-anchor', 'start');
	this.signUpText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.signUpText.setAttribute('y', this.bounds.y + arg.h * 0.1);

	if (this.signUpTextNode !== null || typeof this.signUpTextNode !== 'undefined')
	{
		this.signUpText.removeChild(this.signUpTextNode);
	}

	this.signUpTextNode = document.createTextNode('Sign In');
	this.signUpText.appendChild(this.signUpTextNode);

	// new text block
	this.loginNameText.setAttribute('fill', fontColor);
	this.loginNameText.setAttribute('font-size', fontSize * this.scale);
	this.loginNameText.setAttribute('text-anchor', 'start');
	this.loginNameText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.loginNameText.setAttribute('y', this.bounds.y + arg.h * 0.2);

	if (this.loginNameTextNode !== null || typeof this.loginNameTextNode !== 'undefined')
	{
		this.loginNameText.removeChild(this.loginNameTextNode);
	}

	this.loginNameTextNode = document.createTextNode('User Name:');
	this.loginNameText.appendChild(this.loginNameTextNode);

	// new text block
	this.loginContentText.setAttribute('fill', fontColor);
	this.loginContentText.setAttribute('font-size', fontSize * this.scale);
	this.loginContentText.setAttribute('text-anchor', 'start');
	this.loginContentText.setAttribute('x', this.bounds.x + arg.w * 0.075);
	this.loginContentText.setAttribute('y', this.bounds.y + arg.h * 0.27);

	if (this.loginContentTextNode !== null || typeof this.loginContentTextNode !== 'undefined')
	{
		this.loginContentText.removeChild(this.loginContentTextNode);
	}

	this.loginContentTextNode = document.createTextNode('johndoe');
	this.loginContentText.appendChild(this.loginContentTextNode);

	// new text block
	this.emailText.setAttribute('fill', fontColor);
	this.emailText.setAttribute('font-size', fontSize * this.scale);
	this.emailText.setAttribute('text-anchor', 'start');
	this.emailText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.emailText.setAttribute('y', this.bounds.y + arg.h * 0.2);

	if (this.emailTextNode !== null || typeof this.emailTextNode !== 'undefined')
	{
		this.emailText.removeChild(this.emailTextNode);
	}

	this.emailTextNode = document.createTextNode('User Name:');
	this.emailText.appendChild(this.emailTextNode);

	// new text block
	this.emailContentText.setAttribute('fill', fontColor);
	this.emailContentText.setAttribute('font-size', fontSize * this.scale);
	this.emailContentText.setAttribute('text-anchor', 'start');
	this.emailContentText.setAttribute('x', this.bounds.x + arg.w * 0.075);
	this.emailContentText.setAttribute('y', this.bounds.y + arg.h * 0.27);

	if (this.emailContentTextNode !== null || typeof this.emailContentTextNode !== 'undefined')
	{
		this.emailContentText.removeChild(this.emailContentTextNode);
	}

	this.emailContentTextNode = document.createTextNode('johndoe');
	this.emailContentText.appendChild(this.emailContentTextNode);

	// new text block
	this.pwText.setAttribute('fill', fontColor);
	this.pwText.setAttribute('font-size', fontSize * this.scale);
	this.pwText.setAttribute('text-anchor', 'start');
	this.pwText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.pwText.setAttribute('y', this.bounds.y + arg.h * 0.38);

	if (this.pwTextNode !== null || typeof this.pwTextNode !== 'undefined')
	{
		this.pwText.removeChild(this.pwTextNode);
	}

	this.pwTextNode = document.createTextNode('Password:');
	this.pwText.appendChild(this.pwTextNode);

	// new text block
	this.pwContentText.setAttribute('fill', fontColor);
	this.pwContentText.setAttribute('font-size', fontSize * this.scale);
	this.pwContentText.setAttribute('text-anchor', 'start');
	this.pwContentText.setAttribute('x', this.bounds.x + arg.w * 0.075);
	this.pwContentText.setAttribute('y', this.bounds.y + arg.h * 0.47);

	if (this.pwContentTextNode !== null || typeof this.pwContentTextNode !== 'undefined')
	{
		this.pwContentText.removeChild(this.pwContentTextNode);
	}

	this.pwContentTextNode = document.createTextNode('********');
	this.pwContentText.appendChild(this.pwContentTextNode);

	// new text block
	this.confPwText.setAttribute('fill', fontColor);
	this.confPwText.setAttribute('font-size', fontSize * this.scale);
	this.confPwText.setAttribute('text-anchor', 'start');
	this.confPwText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.confPwText.setAttribute('y', this.bounds.y + arg.h * 0.38);

	if (this.confPwTextNode !== null || typeof this.confPwTextNode !== 'undefined')
	{
		this.confPwText.removeChild(this.confPwTextNode);
	}

	this.confPwTextNode = document.createTextNode('Password:');
	this.confPwText.appendChild(this.confPwTextNode);

	// new text block
	this.confPwContentText.setAttribute('fill', fontColor);
	this.confPwContentText.setAttribute('font-size', fontSize * this.scale);
	this.confPwContentText.setAttribute('text-anchor', 'start');
	this.confPwContentText.setAttribute('x', this.bounds.x + arg.w * 0.075);
	this.confPwContentText.setAttribute('y', this.bounds.y + arg.h * 0.47);

	if (this.confPwContentTextNode !== null || typeof this.confPwContentTextNode !== 'undefined')
	{
		this.confPwContentText.removeChild(this.confPwContentTextNode);
	}

	this.confPwContentTextNode = document.createTextNode('********');
	this.confPwContentText.appendChild(this.confPwContentTextNode);

	// new text block
	this.rememberText.setAttribute('fill', fontColor);
	this.rememberText.setAttribute('font-size', fontSize * this.scale);
	this.rememberText.setAttribute('font-style', 'italic');
	this.rememberText.setAttribute('text-decoration', 'underline');
	this.rememberText.setAttribute('text-anchor', 'start');
	this.rememberText.setAttribute('x', this.bounds.x + arg.w * 0.05);
	this.rememberText.setAttribute('y', this.bounds.y + arg.h * 0.68);

	if (this.rememberTextNode !== null || typeof this.rememberTextNode !== 'undefined')
	{
		this.rememberText.removeChild(this.rememberTextNode);
	}

	this.rememberTextNode = document.createTextNode('Forgot password?');
	this.rememberText.appendChild(this.rememberTextNode);

	// new text block
	this.buttonText.setAttribute('fill', '#ffffff');
	this.buttonText.setAttribute('font-size', fontSize * this.scale * 1.2);
	this.buttonText.setAttribute('font-weight', 'bold');
	this.buttonText.setAttribute('text-anchor', 'middle');
	this.buttonText.setAttribute('x', this.bounds.x + arg.w * 0.25);
	this.buttonText.setAttribute('y', this.bounds.y + arg.h * 0.58);

	if (this.buttonTextNode !== null || typeof this.buttonTextNode !== 'undefined')
	{
		this.buttonText.removeChild(this.buttonTextNode);
	}

	this.buttonTextNode = document.createTextNode('SIGN IN');
	this.buttonText.appendChild(this.buttonTextNode);

	this.updateRotation();
};

mxShapeMockupSignUp.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
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
	else if (shape === 'lineShapes')
	{
		path.moveTo(dx + w * 0.05, dy + h * 0.12);
		path.lineTo(dx + w * 0.95, dy + h * 0.12);
		path.moveTo(dx + w * 0.05, dy + h * 0.72);
		path.lineTo(dx + w * 0.95, dy + h * 0.72);
	}
	else if (shape === 'buttonShapes')
	{
		path.moveTo(dx + w * 0.09, dy + h * 0.52);
		path.lineTo(dx + w * 0.45, dy + h * 0.52);
		path.lineTo(dx + w * 0.45, dy + h * 0.61);
		path.lineTo(dx + w * 0.09, dy + h * 0.61);
		path.close();
		path.moveTo(dx + w * 0.09, dy + h * 0.84);
		path.lineTo(dx + w * 0.45, dy + h * 0.84);
		path.lineTo(dx + w * 0.45, dy + h * 0.93);
		path.lineTo(dx + w * 0.09, dy + h * 0.93);
		path.close();
	}
	else if (shape === 'fieldShapes')
	{
		path.moveTo(dx + w * 0.05, dy + h * 0.22);
		path.lineTo(dx + w * 0.8, dy + h * 0.22);
		path.lineTo(dx + w * 0.8, dy + h * 0.3);
		path.lineTo(dx + w * 0.05, dy + h * 0.3);
		path.close();
		path.moveTo(dx + w * 0.05, dy + h * 0.4);
		path.lineTo(dx + w * 0.8, dy + h * 0.4);
		path.lineTo(dx + w * 0.8, dy + h * 0.48);
		path.lineTo(dx + w * 0.05, dy + h * 0.48);
		path.close();
	}
};

