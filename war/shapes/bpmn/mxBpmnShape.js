//TODO opacity works for the outline only, need to merge overlapping paths to be able to do it for the foreground

function mxBpmnShape(bounds, fill, stroke, strokewidth)
{
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.fixedAspect = true;
};

/**
 * Extends mxShape.
 */
mxBpmnShape.prototype = new mxShape();
mxBpmnShape.prototype.constructor = mxBpmnShape;

mxBpmnShape.prototype.eventParam = 'bpmnEvent';
mxBpmnShape.prototype.eventTypeParam = 'bpmnEventType';

mxBpmnShape.prototype.eventTypeEnum = { 
		START_STANDARD : 'standard', 
		EVENT_SP_INT : 'eventInt', 
		EVENT_SP_NONINT : 'eventNonint',
		CATCHING : 'catching',
		BOUND_INT : 'boundInt',
		BOUND_NONINT : 'boundNonInt',
		THROWING : 'throwing',
		END : 'end',
		GATEWAY : 'gateway'};

mxBpmnShape.prototype.eventEnum = { 
		GENERAL 		: 'general', 
		MESSAGE 		: 'message', 
		TIMER 			: 'timer', 
		ESCALATION 		: 'escalation', 
		CONDITIONAL 	: 'conditional', 
		LINK 			: 'link', 
		ERROR			: 'error', 
		CANCEL			: 'cancel', 
		COMPENSATION 	: 'compensation', 
		SIGNAL 			: 'signal', 
		MULTIPLE		: 'multiple', 
		PAR_MULTI		: 'parallelMultiple', 
		TERMINATE		: 'terminate',
		GW_EXCLUSIVE 	: 'gwExclusive',
		GW_PARALLEL		: 'gwParallel',
		GW_INCLUSIVE	: 'gwInclusive',
		GW_COMPLEX		: 'gwComplex'};

/**
 * Variable: vmlNodes
 *
 * Adds local references to <mxShape.vmlNodes>.
 */
mxBpmnShape.prototype.vmlNodes = mxBpmnShape.prototype.vmlNodes.concat(['background', 'foreground']);

/**
 * Variable: mixedModeHtml
 *
 * Overrides the parent value with false, meaning it will
 * draw in VML in mixed Html mode.
 */
mxBpmnShape.prototype.mixedModeHtml = false;

/**
 * Variable: preferModeHtml
 *
 * Overrides the parent value with false, meaning it will
 * draw as VML in prefer Html mode.
 */
mxBpmnShape.prototype.preferModeHtml = false;

mxBpmnShape.prototype.origWidth = 100;
mxBpmnShape.prototype.origHeight = 100;
mxBpmnShape.prototype.origAspect = mxBpmnShape.prototype.origWidth / mxBpmnShape.prototype.origHeight;

mxBpmnShape.prototype.updateRotation = function()
{
	var rotation = this.getRotation();
	if (this.dialect == mxConstants.DIALECT_SVG)
	{
		// Adds rotation as a separate transform
		if (rotation != 0)
		{
			var transform = 'rotate(' + rotation + ' ' + this.bounds.getCenterX() + ' ' + this.bounds.getCenterY() + ')';

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
				var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam,  mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
				var isGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');
				
				if (eventType === mxBpmnShape.prototype.eventTypeEnum.END && isGateway !== 1)
				{
					this.shadowNode.setAttribute('stroke-width', 4 * this.strokewidth);
				}
				else
				{
					this.shadowNode.setAttribute('stroke-width', this.strokewidth);
				}
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

mxBpmnShape.prototype.createPath = function(arg, shape)
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
 * Function: createVml
 *
 * Creates and returns the VML node to represent this shape.
 */
mxBpmnShape.prototype.createVml = function()
{
	var node = document.createElement('v:group');

	this.background = document.createElement('v:shape');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);
	this.backgroundDash = document.createElement('v:stroke');
	this.background.appendChild(this.backgroundDash);

	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);  
	var currIsGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');  

	if (currIsGateway === 1)
	{
		this.outline = document.createElement('v:shape');
		this.configureVmlShape(this.outline);
		node.appendChild(this.outline);
		this.outlineDash = document.createElement('v:stroke');
		this.outline.appendChild(this.outlineDash);
	}

	this.sign = document.createElement('v:shape');
	this.configureVmlShape(this.sign);
	node.appendChild(this.sign);
	this.sign.strokeweight = Math.max(1,Math.round(2*this.strokewidth * this.scale)) + 'px';

	if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE)
	{
		this.signTwo = document.createElement('v:shape');
		node.appendChild(this.signTwo);
		this.signTwo.strokeweight = Math.max(1,Math.round(2*this.strokewidth * this.scale)) + 'px';
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

mxBpmnShape.prototype.redrawVml = function()
{
	var currEventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);  
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);  
	var currIsGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');

	if (this.oldEventType !== currEventType || this.oldEvent !== currEvent || this.oldIsGateway !== currIsGateway)
	{
		// the shape structure is changed, so we re-create the DOM
		this.restructVml();  
	}
	
	var inset, w, h = 0;
	var dx = 0;
	var dy = 0;
	var s = 0;

	if (this.fixedAspect)
	{
		w = this.bounds.width;
		h = w / this.origAspect;
		if (h > (this.bounds.height * 1.000001))
		{
			h = this.bounds.height;
			w = h * this.origAspect;
		}
		dx = Math.round((this.bounds.width - w) / 2);
		dy = Math.round((this.bounds.height - h) / 2);

		s = this.strokewidth * this.scale;
		inset = 3 + s;
		w = Math.round(w);
		h = Math.round(h);
	}
	else
	{
		w = Math.round(this.bounds.width);
		h = Math.round(this.bounds.height);
		s = Math.round(this.strokewidth * this.scale);
		inset = 3 + s;
	}

	s = this.strokewidth * this.scale;
	inset = 3 + s;

	this.redrawOutlineVml(w, h, dx, dy, s, inset);

	var outlineType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');

	if (outlineType === 1)
	{
		this.redrawForegroundVml(w * 0.5, h * 0.5, dx + w * 0.25, dy + h * 0.25, s, inset);
	}
	else
	{
		this.redrawForegroundVml(w, h, dx, dy, s, inset);
	}

	this.updateRotation();

	this.oldEventType = currEventType;  
	this.oldEvent = currEvent;  
	this.oldIsGateway = currIsGateway;  
};

//a shape is re-created
mxBpmnShape.prototype.restructVml = function()
{
	var currEventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);  
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);  
	var currIsGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');  

	if ((typeof this.signTwo !== 'undefined' || this.signTwo === null) && currEvent !== mxBpmnShape.prototype.eventEnum.MESSAGE)
	{
		this.node.removeChild(this.signTwo);
		this.signTwo = null;
	}
	
	if (currIsGateway === 1 && (typeof this.outline === 'undefined' || this.outline === null))
	{
		// the shape outlines need to be created inside the gateway shape 
		this.outline = document.createElement('v:shape');
		this.outline.filled = 'false';
		this.node.insertBefore(this.outline,this.sign);
		this.outlineDash = document.createElement('v:stroke');
		this.outline.appendChild(this.outlineDash);
		this.outline.coordSize = this.bounds.width + ',' + this.bounds.height;
	}

	if (currEventType === mxBpmnShape.prototype.eventTypeEnum.END && typeof this.outline !== 'undefined' && this.outline !== null)
	{
		this.outline.strokeweight = Math.max(1,Math.round(4*this.strokewidth * this.scale)) + 'px';
	}

	if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE && (typeof this.signTwo === 'undefined' || this.signTwo === null))
	{
		this.signTwo = document.createElement('v:shape');
		this.node.appendChild(this.signTwo);
		this.signTwo.coordSize = this.bounds.width + ',' + this.bounds.height;
	}
};

mxBpmnShape.prototype.redrawOutlineVml = function(w, h, dx, dy, s, inset)
{
	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	var outlineType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');
	var arg = {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
	this.background.path = this.createPath(arg, 'background');

	if (outlineType!==1)
	{
		if (typeof this.outline !== "undefined" && this.outline !== null)
		{
			this.node.removeChild(this.outline);
			this.outline = null;
		}

		var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
		if (eventType === mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT)
		{
			this.backgroundDash.dashstyle = "dash";
		}
		else
		{
			this.backgroundDash.dashstyle = "solid";
		}
	}
	else
	{
		// a gateway outline
		this.backgroundDash.dashstyle = "solid";
	}

	var currEventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);  
	if (currEventType===mxBpmnShape.prototype.eventTypeEnum.END && outlineType!==1)
	{
		this.background.strokeweight = Math.round(4*this.strokewidth * this.scale) + 'px';
	}
};

mxBpmnShape.prototype.redrawForegroundVml = function(w, h, dx, dy, s, inset)
{
	var isGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');
	if (isGateway === 1) {isGateway = true;} else	{isGateway = false;}

	var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);

	// if gateway, then only the rhombus is drawn, so we need to draw the circle
	if (isGateway)
	{
		var arg = {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
		this.outline.path = this.createPath(arg, 'outline');
		this.outline.style.width = this.bounds.width + 'px';
		this.outline.style.height = this.bounds.height + 'px';
		this.outline.coordSize = this.bounds.width + ',' + this.bounds.height;
		if (eventType === mxBpmnShape.prototype.eventTypeEnum.END)
		{
			this.outline.strokeweight = Math.max(1,Math.round(4*this.strokewidth * this.scale)) + 'px';
		}
		else
		{
			this.outline.strokeweight = Math.max(1,Math.round(this.strokewidth * this.scale)) + 'px';
		}

		if (isGateway)
		{
			this.outline.filled = 'false';
		}

		if (eventType === mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT)
		{
			this.outlineDash.dashstyle = "dash";
		}
		else
		{
			this.outlineDash.dashstyle = "solid";
		}
	}

	this.sign.style.width = this.bounds.width + 'px';
	this.sign.style.height = this.bounds.height + 'px';
	this.sign.coordSize = this.bounds.width + ',' + this.bounds.height;

	if (this.style != null)
	{
		var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
		this.sign.strokecolor = strokeColor;
		this.sign.filled = 'false';
	}

	if (currEvent === mxBpmnShape.prototype.eventEnum.GW_INCLUSIVE)
	{
		this.sign.strokeweight = Math.max(1,Math.round(4*this.strokewidth * this.scale)) + 'px';
	}
	else
	{
		this.sign.strokeweight = Math.max(1,Math.round(2*this.strokewidth * this.scale)) + 'px';
	}

	var arg = {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
	this.sign.path = this.createPath(arg, 'sign');

	if (typeof this.signTwo!=='undefined' && this.signTwo!==null)
	{
		this.signTwo.style.width = this.bounds.width + 'px';
		this.signTwo.style.height = this.bounds.height + 'px';
		this.signTwo.coordSize = this.bounds.width + ',' + this.bounds.height;
		this.signTwo.path = this.createPath(arg, 'signTwo');
		this.signTwo.strokeweight = Math.max(1,Math.round(2*this.strokewidth * this.scale)) + 'px';
		this.signTwo.filled = 'false';
		if (this.style != null)
		{
			var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
			this.signTwo.strokecolor = strokeColor;
			if (eventType === mxBpmnShape.prototype.eventTypeEnum.THROWING ||
					eventType === mxBpmnShape.prototype.eventTypeEnum.END)
			{
				var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#FFFFFF');
				this.signTwo.strokecolor = fillColor;
			}
		}
	}

	if (eventType === mxBpmnShape.prototype.eventTypeEnum.THROWING ||
			eventType === mxBpmnShape.prototype.eventTypeEnum.END ||
			currEvent === mxBpmnShape.prototype.eventEnum.GW_PARALLEL ||
			currEvent === mxBpmnShape.prototype.eventEnum.GW_COMPLEX )
	{
		this.sign.filled='true';
		if (this.style != null)
		{
			var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
			var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#FFFFFF');
			this.sign.fillcolor = strokeColor;
			if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE)
			{
				this.sign.strokecolor = fillColor;
			}
		}
	}
};

mxBpmnShape.prototype.redrawPath = function(path, x, y, width, height, arg, shape)
{
	var isGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');

	if (isGateway === 1)
	{
		isGateway = true;
	} 
	else	
	{
		isGateway = false;
	}

	var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);
	var w = arg.w;
	var h = arg.h;
	var dx = arg.dx;
	var dy = arg.dy;
	
	if (shape === 'background')
	{
		if (isGateway || eventType === mxBpmnShape.prototype.eventTypeEnum.GATEWAY)
		{
			path.moveTo(dx, h * 0.5 + dy);
			path.lineTo(w * 0.5 + dx, dy);
			path.lineTo(w + arg.dx, h * 0.5 + dy);
			path.lineTo(w * 0.5 + dx, h + dy);
			path.close();
		}
		else
		{
			path.ellipse(dx, dy, w, h);
			path.close();
			
			if (eventType === mxBpmnShape.prototype.eventTypeEnum.CATCHING ||
					eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_INT ||
					eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT ||
					eventType === mxBpmnShape.prototype.eventTypeEnum.THROWING)
			{
				path.ellipse(dx + w *0.025, dy + h * 0.025, w * 0.95, h * 0.95);
				path.close();
			}
		}
	}
	if (shape==='outline')
	{
		path.ellipse(dx, dy, w, h);
		path.close();

		if (eventType === mxBpmnShape.prototype.eventTypeEnum.CATCHING ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_INT ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.THROWING)
		{
			path.ellipse(dx + w *0.025, dy + h * 0.025, w * 0.95, h * 0.95);
			path.close();
		}
	}
	if (shape==='sign')
	{
		if (currEvent === mxBpmnShape.prototype.eventTypeEnum.GENERAL)
		{
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE)
		{
			path.moveTo(w * 0.15 + dx, h * 0.3 + dy);
			path.lineTo(w * 0.15 + dx, h * 0.7 + dy);
			path.lineTo(w * 0.85 + dx, h * 0.7 + dy);
			path.lineTo(w * 0.85 + dx, h * 0.3 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.TIMER)
		{
			path.ellipse(dx + w * 0.055, dy + h * 0.055, w * 0.89, h * 0.89);
			path.close();
			path.moveTo(w * 0.5 + dx, h * 0.11 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.16 + dy);
			path.moveTo(w * 0.695 + dx, h * 0.161 + dy);
			path.lineTo(w * 0.667 + dx, h * 0.21 + dy);
			path.moveTo(w * 0.837 + dx, h * 0.303 + dy);
			path.lineTo(w * 0.788 + dx, h * 0.333 + dy);
			path.moveTo(w * 0.89 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.84 + dx, h * 0.5 + dy);
			path.moveTo(w * 0.837 + dx, h * 0.697 + dy);
			path.lineTo(w * 0.788 + dx, h * 0.667 + dy);
			path.moveTo(w * 0.695 + dx, h * 0.839 + dy);
			path.lineTo(w * 0.667 + dx, h * 0.79 + dy);
			path.moveTo(w * 0.5 + dx, h * 0.84 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.89 + dy);
			path.moveTo(w * 0.305 + dx, h * 0.839 + dy);
			path.lineTo(w * 0.333 + dx, h * 0.79 + dy);
			path.moveTo(w * 0.163 + dx, h * 0.697 + dy);
			path.lineTo(w * 0.212 + dx, h * 0.667 + dy);
			path.moveTo(w * 0.11 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.16 + dx, h * 0.5 + dy);
			path.moveTo(w * 0.163 + dx, h * 0.303 + dy);
			path.lineTo(w * 0.212 + dx, h * 0.333 + dy);
			path.moveTo(w * 0.305 + dx, h * 0.161 + dy);
			path.lineTo(w * 0.333 + dx, h * 0.21 + dy);
			path.moveTo(w * 0.52 + dx, h * 0.165 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.72 + dx, h * 0.5 + dy);
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.ESCALATION)
		{
			path.moveTo(w * 0.19 + dx, h * 0.72 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.15 + dy);
			path.lineTo(w * 0.81 + dx, h * 0.72 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.43 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.CONDITIONAL)
		{
			path.moveTo(w * 0.3 + dx, h * 0.16 + dy);
			path.lineTo(w * 0.7 + dx, h * 0.16 + dy);
			path.lineTo(w * 0.7 + dx, h * 0.84 + dy);
			path.lineTo(w * 0.3 + dx, h * 0.84 + dy);
			path.close();
			path.moveTo(w * 0.3 + dx, h * 0.23 + dy);
			path.lineTo(w * 0.62 + dx, h * 0.23 + dy);
			path.moveTo(w * 0.3 + dx, h * 0.41 + dy);
			path.lineTo(w * 0.62 + dx, h * 0.41 + dy);
			path.moveTo(w * 0.3 + dx, h * 0.59 + dy);
			path.lineTo(w * 0.62 + dx, h * 0.59 + dy);
			path.moveTo(w * 0.3 + dx, h * 0.77 + dy);
			path.lineTo(w * 0.62 + dx, h * 0.77 + dy);
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.LINK)
		{
			path.moveTo(w * 0.27 + dx, h * 0.59 + dy);
			path.lineTo(w * 0.27 + dx, h * 0.41 + dy);
			path.lineTo(w * 0.56 + dx, h * 0.41 + dy);
			path.lineTo(w * 0.56 + dx, h * 0.33 + dy);
			path.lineTo(w * 0.73 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.56 + dx, h * 0.67 + dy);
			path.lineTo(w * 0.56 + dx, h * 0.59 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.ERROR)
		{
			path.moveTo(w * 0.212 + dx, h * 0.75 + dy);
			path.lineTo(w * 0.403 + dx, h * 0.305 + dy);
			path.lineTo(w * 0.572 + dx, h * 0.565 + dy);
			path.lineTo(w * 0.792 + dx, h * 0.243 + dy);
			path.lineTo(w * 0.597 + dx, h * 0.72 + dy);
			path.lineTo(w * 0.428 + dx, h * 0.5 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.CANCEL)
		{
			path.moveTo(w * 0.25 + dx, h * 0.25 + dy);
			path.lineTo(w * 0.75 + dx, h * 0.75 + dy);
			path.moveTo(w * 0.25 + dx, h * 0.75 + dy);
			path.lineTo(w * 0.75 + dx, h * 0.25 + dy);
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.COMPENSATION)
		{
			path.moveTo(w * 0.28 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.35 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.65 + dy);
			path.close();
			path.moveTo(w * 0.5 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.72 + dx, h * 0.35 + dy);
			path.lineTo(w * 0.72 + dx, h * 0.65 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.SIGNAL)
		{
			path.moveTo(w * 0.19 + dx, h * 0.72 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.15 + dy);
			path.lineTo(w * 0.81 + dx, h * 0.72 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.MULTIPLE)
		{
			path.moveTo(w * 0.2 + dx, h * 0.41 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.19 + dy);
			path.lineTo(w * 0.795 + dx, h * 0.41 + dy);
			path.lineTo(w * 0.69 + dx, h * 0.755 + dy);
			path.lineTo(w * 0.31 + dx, h * 0.755 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.PAR_MULTI)
		{
			path.moveTo(w * 0.43 + dx, h * 0.2 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.2 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.8 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.8 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.8 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.8 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.2 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.2 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.43 + dy);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.TERMINATE)
		{
			path.ellipse(dx + w * 0.05, dy + h * 0.05, w * 0.9, h * 0.9);
			path.close();
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.GW_EXCLUSIVE)
		{
			path.moveTo(w * 0.38 + dx, h * 0.24 + dy);
			path.lineTo(w * 0.62 + dx, h * 0.76 + dy);
			path.moveTo(w * 0.62 + dx, h * 0.24 + dy);
			path.lineTo(w * 0.38 + dx, h * 0.76 + dy);
		}
		else if (currEvent === mxBpmnShape.prototype.eventEnum.GW_PARALLEL)
		{
			path.moveTo(w * 0.43 + dx, h * 0.2 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.2 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.8 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.8 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.8 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.8 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.2 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.2 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.43 + dy);
			path.close();
		}
		if (currEvent === mxBpmnShape.prototype.eventEnum.GW_INCLUSIVE)
		{
			path.ellipse(dx + w * 0.125 , dy + h * 0.125, w * 0.75, h * 0.75);
			path.close();
		}
		if (currEvent === mxBpmnShape.prototype.eventEnum.GW_COMPLEX)
		{
			path.moveTo(w * 0.25 + dx, h * 0.47 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.47 + dy);
			path.lineTo(w * 0.3 + dx, h * 0.34 + dy);
			path.lineTo(w * 0.34 + dx, h * 0.3 + dy);
			path.lineTo(w * 0.47 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.47 + dx, h * 0.25 + dy);
			path.lineTo(w * 0.53 + dx, h * 0.25 + dy);
			path.lineTo(w * 0.53 + dx, h * 0.43 + dy);
			path.lineTo(w * 0.66 + dx, h * 0.3 + dy);
			path.lineTo(w * 0.7 + dx, h * 0.34 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.47 + dy);
			path.lineTo(w * 0.75 + dx, h * 0.47 + dy);
			path.lineTo(w * 0.75 + dx, h * 0.53 + dy);
			path.lineTo(w * 0.57 + dx, h * 0.53 + dy);
			path.lineTo(w * 0.7 + dx, h * 0.66 + dy);
			path.lineTo(w * 0.66 + dx, h * 0.7 + dy);
			path.lineTo(w * 0.53 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.53 + dx, h * 0.75 + dy);
			path.lineTo(w * 0.47 + dx, h * 0.75 + dy);
			path.lineTo(w * 0.47 + dx, h * 0.57 + dy);
			path.lineTo(w * 0.34 + dx, h * 0.7 + dy);
			path.lineTo(w * 0.3 + dx, h * 0.66 + dy);
			path.lineTo(w * 0.43 + dx, h * 0.53 + dy);
			path.lineTo(w * 0.25 + dx, h * 0.53 + dy);
		}
	}
	if (shape==='signTwo')
	{
		if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE)
		{
			path.moveTo(w * 0.15 + dx, h * 0.3 + dy);
			path.lineTo(w * 0.5 + dx, h * 0.5 + dy);
			path.lineTo(w * 0.85 + dx, h * 0.3 + dy);
		}
	}
};

/**
 * Function: createSvg
 *
 * Creates and returns the SVG node to represent this shape.
 */
mxBpmnShape.prototype.createSvg = function()
{
	this.g = this.createSvgGroup('path');

	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);  
	var currIsGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');  

	if (currIsGateway===1)
	{
		this.outline = document.createElementNS(mxConstants.NS_SVG, 'path');
		this.g.appendChild(this.outline);
	}

	this.sign = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.g.appendChild(this.sign);
	this.sign.setAttribute('stroke-width', (Math.max(1, 2*this.strokewidth * this.scale)));

	if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE)
	{
		this.signTwo = document.createElementNS(mxConstants.NS_SVG, 'path');
		this.g.appendChild(this.signTwo);
		this.signTwo.setAttribute('stroke-width', (Math.max(1, 2*this.strokewidth * this.scale)));
	}

	return this.g;
};

mxBpmnShape.prototype.redrawSvg = function()
{
	var currEventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);  
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);  
	var currIsGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');  

	if (this.oldEventType !== currEventType || this.oldEvent !== currEvent || this.oldIsGateway !== currIsGateway)
	{
		// the shape structure is changed, so we re-create the DOM
		this.restructSvg();  
	}
	
	var inset, w, h = 0;
	var dx = 0;
	var dy = 0;

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

		var s = this.strokewidth * this.scale;
		inset = 3 + s;
		w = Math.round(w);
		h = Math.round(h);
	}
	else
	{
		w = this.bounds.width;
		h = this.bounds.height;
		s = this.strokewidth * this.scale;
		inset = 3 + s;
	}

	this.redrawOutlineSvg(w, h, dx, dy, s, inset);

	var outlineType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');

	if (outlineType===1)
	{
		this.redrawForegroundSvg(w * 0.5, h * 0.5, dx + w * 0.25, dy + h * 0.25, s, inset);
	}
	else
	{
		this.redrawForegroundSvg(w, h, dx, dy, s, inset);
	}

	this.updateRotation();

	this.oldEventType = currEventType;  
	this.oldEvent = currEvent;  
	this.oldIsGateway = currIsGateway; 
};

//a shape is re-created
mxBpmnShape.prototype.restructSvg = function()
{
	var currEventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);  
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);  
	var currIsGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');  

	if ((typeof this.signTwo !== 'undefined' || this.signTwo === null) && currEvent !== mxBpmnShape.prototype.eventEnum.MESSAGE)
	{
		this.g.removeChild(this.signTwo);
		this.signTwo = null;
	}
	if (currIsGateway === 1 && (typeof this.outline === 'undefined' || this.outline === null))
	{
		// the shape outlines need to be created inside the gateway shape 
		this.outline = document.createElementNS(mxConstants.NS_SVG, 'path');
		this.outline.setAttribute('fill', 'none');
		this.g.insertBefore(this.outline,this.sign);
	}

	if (currEventType === mxBpmnShape.prototype.eventTypeEnum.END && typeof this.outline !== 'undefined' && this.outline !== null)
	{
		this.outline.setAttribute('stroke-width', (Math.max(1, 4*this.strokewidth * this.scale)));
	}

	if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE && (typeof this.signTwo === 'undefined' || this.signTwo === null))
	{
		this.signTwo = document.createElementNS(mxConstants.NS_SVG, 'path');
		this.g.appendChild(this.signTwo);
	}
};

mxBpmnShape.prototype.redrawOutlineSvg = function(w, h, dx, dy, s, inset)
{
	var outlineType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');
	var arg = {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
	this.innerNode.setAttribute('d', this.createPath(arg, 'background'));

	if (this.shadowNode !== null)
	{
		this.shadowNode.setAttribute('transform',  this.getSvgShadowTransform());
		this.shadowNode.setAttribute('d', this.innerNode.getAttribute('d'));
		var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
		var isGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');
		if (eventType === mxBpmnShape.prototype.eventTypeEnum.END && isGateway!==1)
		{
			this.shadowNode.setAttribute('stroke-width', 4*this.strokewidth);
		}
		else
		{
			this.shadowNode.setAttribute('stroke-width', this.strokewidth);
		}
	}

	if (outlineType!==1)
	{
		if (typeof this.outline !== "undefined" && this.outline !== null)
		{
			this.g.removeChild(this.outline);
			this.outline = null;
		}

		var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
		if (eventType === mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT)
		{
			var phase = Math.max(1, (3 * this.scale * this.strokewidth));
			this.innerNode.setAttribute('stroke-dasharray', phase + ' ' + phase);
		}
		else
		{
			this.innerNode.removeAttribute('stroke-dasharray');
		}
	}
	else
	{
		// a gateway outline
		this.innerNode.removeAttribute('stroke-dasharray');
	}

	var currEventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);  
	if ((currEventType===mxBpmnShape.prototype.eventTypeEnum.END) && outlineType!==1)
	{
		this.innerNode.setAttribute('stroke-width', (Math.max(1, 4*this.strokewidth * this.scale)));
	}
	else
	{
		this.innerNode.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
	}
};

mxBpmnShape.prototype.redrawForegroundSvg = function(w, h, dx, dy, s, inset)
{
	var isGateway = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeEnum.GATEWAY, '0');
	if (isGateway === 1) {isGateway = true;} else	{isGateway = false;}

	var eventType = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventTypeParam, mxBpmnShape.prototype.eventTypeEnum.START_STANDARD);
	var currEvent = mxUtils.getValue(this.style, mxBpmnShape.prototype.eventParam, mxBpmnShape.prototype.eventEnum.GENERAL);

	// if gateway, then only the rhombus is drawn, so we need to draw the circle
	if (isGateway)
	{
		if (this.style != null)
		{
			var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
			this.outline.setAttribute('stroke',strokeColor);
		}

		var arg = {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
		this.outline.setAttribute('d', this.createPath(arg, 'outline'));
		if (eventType === mxBpmnShape.prototype.eventTypeEnum.END)
		{
			this.outline.setAttribute('stroke-width', (Math.max(1, 4*this.strokewidth * this.scale)));
		}
		else
		{
			this.outline.setAttribute('stroke-width', (Math.max(1, this.strokewidth * this.scale)));
		}

		this.outline.setAttribute('fill','none');

		if (eventType === mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT ||
				eventType === mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT)
		{
			var phase = Math.max(1, (3 * this.scale * this.strokewidth));
			this.outline.setAttribute('stroke-dasharray', phase + ' ' + phase);
		}
		else
		{
			this.outline.removeAttribute('stroke-dasharray');
		}
	}

	if (eventType === mxBpmnShape.prototype.eventTypeEnum.THROWING ||
			eventType === mxBpmnShape.prototype.eventTypeEnum.END ||
			currEvent === mxBpmnShape.prototype.eventEnum.GW_COMPLEX ||
			currEvent === mxBpmnShape.prototype.eventEnum.GW_PARALLEL )
	{
		if (this.style != null)
		{
			var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
			var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#FFFFFF');
			this.sign.setAttribute('fill', strokeColor);
			if (currEvent === mxBpmnShape.prototype.eventEnum.MESSAGE)
			{
				this.sign.setAttribute('stroke', fillColor);
			}
			else
			{
				this.sign.setAttribute('stroke', strokeColor);
			}
		}
	}
	else
	{
		if (this.style != null)
		{
			var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
			this.sign.setAttribute('stroke', strokeColor);
			this.sign.setAttribute('fill','none');
		}
	}

	if (currEvent === mxBpmnShape.prototype.eventEnum.GW_INCLUSIVE)
	{
		this.sign.setAttribute('stroke-width', (Math.max(1, 4*this.strokewidth * this.scale)));
	}
	else
	{
		this.sign.setAttribute('stroke-width', (Math.max(1, 2*this.strokewidth * this.scale)));
	}


	var arg = {w:w, h:h, dx:dx, dy:dy, s:s, inset:inset};
	this.sign.setAttribute('d', this.createPath(arg, 'sign'));

	if (typeof this.signTwo!=='undefined' && this.signTwo!==null)
	{
		this.signTwo.setAttribute('d', this.createPath(arg, 'signTwo'));
		this.signTwo.setAttribute('stroke-width', (Math.max(1, 2*this.strokewidth * this.scale)));
		this.signTwo.setAttribute('fill','none');
		if (this.style != null)
		{
			var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
			this.signTwo.setAttribute('stroke',strokeColor);
			if (eventType === mxBpmnShape.prototype.eventTypeEnum.THROWING ||
					eventType === mxBpmnShape.prototype.eventTypeEnum.END)
			{
				var fillColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#FFFFFF');
				this.signTwo.setAttribute('stroke',fillColor);
			}
		}
	}
};
