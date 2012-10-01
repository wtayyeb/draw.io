//TODO check in VML if removeChild is used correctly (there is a chance that this.g.removeChild is used instead of the correct this.node.removeChild)


/**
 * Function: ellipse
 *
 * Adds the given ellipse. Some implementations may require the path to be
 * closed after this operation.
 */
mxPath.prototype.ellipse = function(x, y, w, h)
{
	x += this.translate.x;
	y += this.translate.y;
	x *= this.scale;
	y *= this.scale;

	if (this.isVml())
	{
		this.path.push('at ', Math.round(x), ' ', Math.round(y), ' ', Math.round(x + w), ' ', Math.round(y +  h), ' ',
				Math.round(x), ' ', Math.round(y + h / 2), ' ', Math.round(x), ' ', Math.round(y + h / 2), ' ');
	}
	else
	{
		var startX = x;
		var startY = y + h/2;
		var endX = x + w;
		var endY = y + h/2;
		var r1 = w / 2;
		var r2 = h / 2;
		this.path.push('M ', startX, ' ', startY, ' ');
		this.path.push('A ', r1, ' ', r2, ' 0 1 0 ', endX, ' ', endY, ' ');
		this.path.push('A ', r1, ' ', r2, ' 0 1 0 ', startX, ' ', startY);
	}
};

/**
 * Function: arcTo
 *
 * Adds the given arc.
 */
mxPath.prototype.arcTo = function(x1, y1, r1, r2, angle, largeArc, sweep, x2, y2)
{
	x1 += this.translate.x;
	y1 += this.translate.y;
	x1 *= this.scale;
	y1 *= this.scale;
	x2 += this.translate.x;
	y2 += this.translate.y;
	x2 *= this.scale;
	y2 *= this.scale;

	if (this.isVml())
	{
		var curves = mxUtils.arcToCurves(x1, y1, r1, r2, angle, largeArc, sweep, x2, y2);

		for (var i = 0; i < curves.length; i += 6) 
		{
			this.path.push('c' + ' ' + Math.round(curves[i]) + ' ' + Math.round(curves[i + 1]) + ' ' +
					Math.round(curves[i + 2]) + ' ' + Math.round(curves[i + 3]) + ' ' +
					Math.round(curves[i + 4]) + ' ' + Math.round(curves[i + 5]));
		}
	}
	else
	{
		this.path.push('A ' + r1 + ',' + r2 + ' ' + angle + ' ' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2);
	}
};










function mxShapeMockup(bounds, fill, stroke, strokewidth)
{
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.fixedAspect = false;
};

/**
 * Extends mxShape.
 */
mxShapeMockup.prototype = new mxShape();
mxShapeMockup.prototype.constructor = mxShapeMockup;

/**
 * Variable: vmlNodes
 *
 * Adds local references to <mxShape.vmlNodes>.
 */
mxShapeMockup.prototype.vmlNodes = mxShapeMockup.prototype.vmlNodes.concat(['background', 'foreground']);

//style parameter names for various mockup shapes
mxShapeMockup.prototype.cst = {
		ADJ_STYLE : 'adjStyle',
		BAR_ONE_COLOR : 'barOneColor',
		BAR_POS : 'barPos',
		BAR_TWO_COLOR : 'barTwoColor',
		BULLET_STYLE : 'bulletStyle',
		BUTTON : 'button',
		BUTTON_COLOR : 'buttonColor',
		BUTTON_STATE : 'buttonState',
		BUTTON_STYLE : 'buttonStyle',
		BUTTON_TEXT : 'buttonText',
		CALLOUT_STYLE : 'calloutStyle',
		CALLOUT_TEXT : 'calloutText',
		CAPTCHA_TEXT : 'captchaText',
		COMBO_STRING : 'comboString',
		DIS_FILL_COLOR : 'disFillColor',
		DIS_STROKE_COLOR : 'disStrokeColor',
		EMPTY_FILL_COLOR : 'emptyFillColor',
		FALSE : 'false',
		FILL_COLOR2 : 'fillColor2',
		FRAME_COLOR : 'frameColor',
		FRAME_FILL_COLOR : 'frameFillColor',
		FRAME_STROKE_COLOR : 'frameStrokeColor',
		GAUGE_NAME : 'gaugeName',
		GAUGE_POS : 'gaugePos',
		GRADE : 'grade',
		GRID_SIZE : 'gridSize',
		HANDLE_COLOR : 'handleColor',
		HANDLE_STYLE : 'handleStyle',
		HAS_HEADER : 'hasHeader',
		HEADER_COLOR : 'headerColor',
		HIGH_COLOR : 'highColor',
		LAYER_NAME : 'layerName',
		LAYOUT : 'layout',
		LEFT_COLOR : 'leftColor',
		LIST : 'list',
		LOW_COLOR : 'lowColor',
		MAX_TEXT : 'maxText',
		MED_COLOR : 'medColor',
		MIN_TEXT : 'minText',
		NAMES : 'names',
		NOTE_TEXT : 'noteText',
		OFF_COLOR : 'offColor',
		ON_COLOR : 'onColor',
		OFF_TEXT : 'offText',
		ON_TEXT : 'onText',
		PW_STRING : 'pwString',
		PW_STYLE : 'pwStyle',
		RATING_SCALE : 'ratingScale',
		RATING_STYLE : 'ratingStyle',
		RULER_ORIENTATION : 'rulerOrientation',
		SEARCH_STRING : 'searchString',
		SEL_BUTTON_COLOR : 'selButtonColor',
		SEL_TAB_COLOR : 'selTabColor',
		SHAPES1_COLOR : 'shapes1Color',
		SHAPES2_COLOR : 'shapes2Color',
		SHAPES3_COLOR : 'shapes3Color',
		SLIDER_POS : 'sliderPos',
		SLIDER_STYLE : 'sliderStyle',
		SPINNER_STYLE : 'spinnerStyle',
		STATUS_TEXT : 'statusText',
		SUB_TEXT : 'subText',
		TAB : 'tab',
		TAB_COLOR : 'tabColor',
		TAB_STYLE : 'tabStyle',
		TAPE_COLOR : 'tapeColor',
		TITLE_TEXT : 'titleText',
		TRUE : 'true',
		UNIT_SIZE : 'unitSize',
		URL_TEXT : 'urlText',
		VAL : 'val',
		X_SIZE : 'xSize',
		Y_SIZE : 'ySize'
};

/**
 * Variable: mixedModeHtml
 *
 * Overrides the parent value with false, meaning it will
 * draw in VML in mixed Html mode.
 */
mxShapeMockup.prototype.mixedModeHtml = false;

/**
 * Variable: preferModeHtml
 *
 * Overrides the parent value with false, meaning it will
 * draw as VML in prefer Html mode.
 */
mxShapeMockup.prototype.preferModeHtml = false;

mxShapeMockup.prototype.origWidth = 100;
mxShapeMockup.prototype.origHeight = 100;
mxShapeMockup.prototype.origAspect = mxShapeMockup.prototype.origWidth / mxShapeMockup.prototype.origHeight;

mxShapeMockup.prototype.updateRotation = function()
{
	var rotation = this.getRotation();
	if (this.dialect == mxConstants.DIALECT_SVG)
	{
		// Adds rotation as a separate transform
		if (rotation != 0)
		{
			var cx = this.bounds.getCenterX();
			var cy = this.bounds.getCenterY();
			var transform = 'rotate(' + rotation + ' ' + cx + ' ' + cy + ')';

			if (this.innerNode != null)
			{
				this.innerNode.setAttribute('transform', transform);
			}

			if (this.foreground != null)
			{
				this.foreground.setAttribute('transform', transform);
			}

			if (this.outline != null)
			{
				this.outline.setAttribute('transform', transform);
			}

			if (this.sign != null)
			{
				this.sign.setAttribute('transform', transform);
			}

			if (this.signTwo != null)
			{
				this.signTwo.setAttribute('transform', transform);
			}

			// Shadow needs different transform so that it ends up on the correct side
			if (this.shadowNode != null)
			{
				this.shadowNode.setAttribute('transform',  this.getSvgShadowTransform() + ' ' + transform);
				this.shadowNode.setAttribute('stroke-width', this.strokewidth);
			}
		}
	}
	else
	{
		if (rotation != 0)
		{
			this.node.style.rotation = rotation;
		}
	}
};

mxShapeMockup.prototype.calcArgs = function()
{
	var w, h, dx, dy, s, inset = 0;
	if (this.fixedAspect)
	{
		w = this.bounds.width;
		h = w / this.origAspect;

		if (h > (this.bounds.height * 1.000001))
		{
			h = this.bounds.height;
			w = h * this.origAspect;
		}

		dx = (this.bounds.width - w) / 2;
		dy = (this.bounds.height - h) / 2;

		s = this.strokewidth * this.scale;
		inset = 3 + s;
		w = Math.round(w);
		h = Math.round(h);
	}
	else
	{
		w = this.bounds.width;
		h = this.bounds.height;
		dx = 0;
		dy = 0;
		s = this.strokewidth * this.scale;
		inset = 3 + s;
	}

	return {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
};

mxShapeMockup.prototype.createPath = function(arg, shape)
{
	var x = this.bounds.x;
	var y = this.bounds.y;
	var w = this.bounds.width;
	var h = this.bounds.height;
	var dx = 0;
	var dy = 0;

	// Inverts bounds for stencils which are rotated 90 or 270 degrees
	if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH)
	{
		dx = (w - h) / 2;
		dy = (h - w) / 2;
		x += dx;
		y += dy;
		var tmp = w;
		w = h;
		h = tmp;
	}

	var path = null;

	if (this.dialect == mxConstants.DIALECT_SVG)
	{
		path = new mxPath('svg');
		path.setTranslate(x, y);
	}
	else
	{
		path = new mxPath('vml');
		path.setTranslate(dx, -dx);
		path.scale = this.vmlScale;
	}

	this.redrawPath(path, x, y, w, h, arg, shape);
	return path.getPath();
};

/**
 * Function: getSizeForString
 * 
 * Returns an <mxRectangle> with the size (width and height in pixels) of
 * the given string. The string may contain HTML markup. Newlines should be
 * converted to <br> before calling this method.
 * 
 * Example:
 * 
 * (code)
 * var label = graph.getLabel(cell).replace(/\n/g, "<br>");
 * var size = graph.getSizeForString(label);
 * (end)
 * 
 * Parameters:
 * 
 * text - String whose size should be returned.
 * fontSize - Integer that specifies the font size in pixels. Default is
 * <mxConstants.DEFAULT_FONTSIZE>.
 * fontFamily - String that specifies the name of the font family. Default
 * is <mxConstants.DEFAULT_FONTFAMILY>.
 */
mxShapeMockup.prototype.getSizeForString = function(text, fontSize, fontFamily)
{
	var div = document.createElement('div');

	// Sets the font size and family if non-default
	div.style.fontSize = (fontSize || mxConstants.DEFAULT_FONTSIZE) + 'px';
	div.style.fontFamily = fontFamily || mxConstants.DEFAULT_FONTFAMILY;

	// Disables block layout and outside wrapping and hides the div
	div.style.position = 'absolute';
	div.style.display = 'inline';
	div.style.visibility = 'hidden';

	// Adds the text and inserts into DOM for updating of size
	div.innerHTML = text;
	document.body.appendChild(div);

	// Gets the size and removes from DOM
	var size = new mxRectangle(0, 0, div.offsetWidth, div.offsetHeight);
	document.body.removeChild(div);

	return size;
};
