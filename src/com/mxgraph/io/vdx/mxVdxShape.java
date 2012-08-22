package com.mxgraph.io.vdx;

import com.mxgraph.io.mxVdxCodec;

import com.mxgraph.model.mxCell;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.view.mxGraph;
import java.util.HashMap;
import java.util.Hashtable;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This class is a wrapper for one Shape Element.<br/>
 * This class is responsible for retrieve all the properties of the shape and add it
 * to the graph. If a property is not found in the shape element but it is an instance
 * of a Master, the property is taken from the masterShape element. If the property
 * is not found neither in the masterShape , and it has a reference to a stylesheet
 * the property is taken from there.
 */
public class mxVdxShape extends mxGeneralShape
{
	/**
	 * Master Shape referenced by the shape.
	 */
	private mxMasterShape masterShape = null;

	/**
	 * Master element referenced by the shape.
	 */
	private mxMasterElement masterElement = null;

	/**
	 * Stylesheet with the fill style referenced by the shape.
	 */
	private mxStyleSheet fillStyle = null;

	/**
	 * Stylesheet with the line style referenced by the shape.
	 */
	private mxStyleSheet lineStyle = null;

	/**
	 * Stylesheet with the text style referenced by the shape.
	 */
	private mxStyleSheet textStyle = null;

	/**
	 * Create a new instance of mxVdxShape.
	 * This method get the references to the master element, master shape
	 * and stylesheet.
	 * @param shape
	 */
	public mxVdxShape(Element shape)
	{
		super(shape);
		masterElement = mxMastersManager.getInstance().getMaster(
				this.lookForMasterId());
		if (masterElement != null)
		{
			//If the shape has the Master attribute the master shape is the first
			//shape of the master element.
			if (this.getMasterId() != null && !this.getMasterId().equals(""))
			{
				this.masterShape = masterElement.getMasterShape();
			}
			else if (this.getShapeMasterId() != null
					&& !this.getShapeMasterId().equals(""))
			{
				this.masterShape = masterElement.getMasterShape(this
						.getShapeMasterId());
			}
		}

		mxStyleSheetManager ssm = mxStyleSheetManager.getInstance();
		this.fillStyle = ssm.getSheet(getFillStyleId());
		this.lineStyle = ssm.getSheet(getLineStyleId());
		this.textStyle = ssm.getSheet(getTextStyleId());

	}

	/**
	 * Returns the value of the Text element.<br/>
	 * If the shape has not text, it is obtained from master shape.
	 * If html labels are enabled, the text properties are set with tags html.
	 * @return Text label of the shape.
	 */
	public String getTextLabel()
	{
		String ret = "";
		if (mxVdxCodec.isHtmlLabelsEnable())
		{
			mxVdxTextParser vtp = new mxVdxTextParser(this, masterShape,
					textStyle);
			//Get text with tags html
			ret = vtp.getHtmlTextContent();
		}
		else
		{
			if (this.hasText())
			{
				ret = this.getText();
			}
			else if (masterShape != null && masterShape.hasText())
			{
				return masterShape.getText();
			}
		}
		return ret;
	}

	/**
	 * Checks if a nameU is for big connectors.
	 * @param nameU NameU attribute.
	 * @return Returns <code>true</code> if a nameU is for big connectors.
	 */
	public boolean isConnectorBigNameU(String nameU)
	{
		return nameU.startsWith("60 degree single")
				|| nameU.startsWith("45 degree single")
				|| nameU.startsWith("45 degree double")
				|| nameU.startsWith("60 degree double")
				|| nameU.startsWith("45 degree  tail")
				|| nameU.startsWith("60 degree  tail")
				|| nameU.startsWith("45 degree tail")
				|| nameU.startsWith("60 degree tail")
				|| nameU.startsWith("Flexi-arrow 2")
				|| nameU.startsWith("Flexi-arrow 1")
				|| nameU.startsWith("Flexi-arrow 3")
				|| nameU.startsWith("Double flexi-arrow")
				|| nameU.startsWith("Fancy arrow");
	}

	/**
	 * Checks if the shape or the master shape has the XForm1D element.
	 * @return Returns <code>true</code> if the shape or the master shape
	 * has the XForm1D element.
	 */
	public boolean containsXForm1D()
	{
		if (this.hasXForm1D())
		{
			return true;
		}
		else if (masterShape != null && masterShape.hasXForm1D())
		{
			return true;
		}
		return false;
	}

	/**
	 * Checks if the shape must be treated as an edge.
	 * @return Returns <code>true</code> if the shape must be treated as an edge.
	 */
	public boolean isExceptionEdge()
	{
		String nameU = getNameU();
		if (nameU.startsWith("Control transfer")
				|| nameU.startsWith("Branch: no return")
				|| nameU.startsWith("Interrupt")
				|| nameU.startsWith("External control")
				|| nameU.startsWith("Refinement")
				|| nameU.startsWith("Branch: return"))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Checks if the shape represents a vertex.
	 * @return Returns <code>true</code> if the shape represents a vertex.
	 */
	public boolean isVertexShape()
	{
		String nameU = getNameU();
		if (nameU.startsWith("Dynamic connector") || isConnectorBigNameU(nameU))
		{
			return false;
		}
		else if (masterElement != null
				&& masterElement.getNameU().startsWith("Dynamic connector"))
		{
			return false;
		}
		mxPoint dimentions = this.getDimentions();

		if (!isGroup()
				&& containsXForm1D()
				&& ((dimentions.getX() <= 0) || (dimentions.getY() <= 0) || getAmountConnection() == 0))
		{
			return false;
		}

		if (isExceptionEdge())
		{
			return false;
		}
		return true;
	}

	/**
	 * Returns the coordinates of the top left corner of the Shape.
	 * When a coordinate is not found, it is taken from masterShape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return mxPoint that represents the co-ordinates
	 */
	public mxPoint getOriginPoint(double parentHeight)
	{
		double px = 0;
		double py = 0;
		double lpy = 0;
		double lpx = 0;
		double h = 0;

		//Defines PinX
		if (this.hasPinX())
		{
			px = this.getPinX();
		}
		else if (masterShape != null && masterShape.hasPinX())
		{
			px = masterShape.getPinX();
		}

		//Defines PinY
		if (this.hasPinY())
		{
			py = this.getPinY();
		}
		else if (masterShape != null && masterShape.hasPinY())
		{
			py = masterShape.getPinY();
		}

		//Defines LocPinX
		if (this.hasLocPinX())
		{
			lpx = this.getLocPinX();
		}
		else if (masterShape != null && masterShape.hasLocPinX())
		{
			lpx = masterShape.getLocPinX();
		}

		//Defines LocPinY
		if (this.hasLocPinY())
		{
			lpy = this.getLocPinY();
		}
		else if (masterShape != null && masterShape.hasLocPinY())
		{
			lpy = masterShape.getLocPinY();
		}
		//Defines Height
		if (this.hasHeight())
		{
			h = this.getHeight();
		}
		else if (masterShape != null && masterShape.hasHeight())
		{
			h = masterShape.getHeight();
		}

		double x = (px) - (lpx);
		double y = parentHeight - ((py) + (h - lpy));
		return new mxPoint(x, y);
	}

	/**
	 * Returns the width and height of the Shape expressed like a mxPoint.<br/>
	 * x = width<br/>
	 * y = height<br/>
	 * When a dimention is not found, it is taken from masterShape.
	 * @return mxPoint that represents the dimentions of the shape.
	 */
	public mxPoint getDimentions()
	{
		double w = 0;
		double h = 0;

		//Defines Width
		if (this.hasWidth())
		{
			w = this.getWidth();
		}
		else if (masterShape != null && masterShape.hasWidth())
		{
			w = masterShape.getWidth();
		}

		//Defines Height
		if (this.hasHeight())
		{
			h = this.getHeight();
		}
		else if (masterShape != null && masterShape.hasHeight())
		{
			h = masterShape.getHeight();
		}

		return new mxPoint(w, h);
	}

	/**
	 * Returns the opacity of the Shape.<br/>
	 * @return Double in the range of (transparent = 0)..(100 = opaque)
	 */
	private double getOpacity()
	{
		mxVdxShapeForm vsf = new mxVdxShapeForm(this, masterShape,
				masterElement, 0);
		double opacity = 100;
		if (this.isGroup() && !vsf.isSimpleComplex() && !vsf.isSwimlane())
		{
			opacity = 0;
		}

		if (this.hasTransparence())
		{
			opacity = 100 - this.getTransparence();
		}
		else if (masterShape != null && masterShape.hasTransparence())
		{
			opacity = 100 - masterShape.getTransparence();
		}
		if (this.hasFillPattern())
		{
			String pattern = this.getFillPattern();
			if (pattern.equals("0"))
			{
				opacity = 0;
			}
		}
		else if (masterShape != null && masterShape.hasFillPattern())
		{
			String pattern = masterShape.getFillPattern();
			if (pattern.equals("0"))
			{
				opacity = 0;
			}
		}
		else if (fillStyle != null && fillStyle.hasFillPattern())
		{
			String pattern = fillStyle.getFillPattern();
			if (pattern.equals("0"))
			{
				opacity = 0;
			}
		}

		opacity = Math.max(opacity, 0);
		opacity = Math.min(opacity, 100);

		return opacity;
	}

	/**
	 * Returns the shape's fill pattern.<br/>
	 * The property may to be defined in master shape or fill stylesheet.
	 * @return  String value of the fill pattern.
	 */
	private String getColorPattern()
	{
		String pattern = "";
		if (this.hasFillPattern())
		{
			pattern = this.getFillPattern();
		}
		else if ((masterShape != null) && masterShape.hasFillPattern())
		{
			pattern = masterShape.getFillPattern();
		}
		else if ((fillStyle != null) && fillStyle.hasFillPattern())
		{
			pattern = fillStyle.getFillPattern();
		}
		return pattern;
	}

	/**
	 * Returns the shape's background color.
	 * The property may to be defined in master shape or fill stylesheet.
	 * @return hexadecimal representation of the background color.
	 */
	private String getBackColor()
	{
		String fillcolor = "";
		if (this.hasFillColor())
		{
			fillcolor = this.getFillColor();
		}
		else if ((masterShape != null) && masterShape.hasFillColor())
		{
			fillcolor = masterShape.getFillColor();
		}
		else if ((fillStyle != null) && fillStyle.hasFillColor())
		{
			fillcolor = fillStyle.getFillColor();
		}
		return fillcolor;
	}

	/**
	 * Returns the shape's color.<br/>
	 * The property may to be defined in master shape or fill stylesheet.<br/>
	 * If the color is the background or the fore color, it depends of the pattern.
	 * For simple gradients and solid, returns the fore color, else returns the
	 * background color.
	 * @return hexadecimal representation of the color.
	 */
	private String getColor()
	{
		String fillcolor = "";

		if (this.hasFillPattern())
		{
			String pattern = this.getFillPattern();
			if (pattern.equals("1") || pattern.equals("25")
					|| pattern.equals("27") || pattern.equals("28")
					|| pattern.equals("30"))
			{
				if (this.hasFillForeColor())
				{
					fillcolor = this.getFillForeColor();
				}
			}
			else
			{
				if (this.hasFillColor())
				{
					fillcolor = this.getFillColor();
				}
			}
		}
		else
		{
			if (this.hasFillColor())
			{
				fillcolor = this.getFillColor();
			}
		}

		if (masterShape != null && fillcolor.equals(""))
		{

			if (masterShape.hasFillPattern())
			{
				String pattern = masterShape.getFillPattern();
				if (pattern.equals("1") || pattern.equals("25")
						|| pattern.equals("27") || pattern.equals("28")
						|| pattern.equals("30"))
				{
					if (masterShape.hasFillForeColor())
					{
						fillcolor = masterShape.getFillForeColor();
					}
				}
				else
				{
					if (masterShape.hasFillColor())
					{
						fillcolor = masterShape.getFillColor();
					}
				}
			}
			else
			{
				if (masterShape.hasFillColor())
				{
					fillcolor = masterShape.getFillColor();
				}
			}

		}

		if (masterShape == null && fillStyle != null && fillcolor.equals(""))
		{
			if (fillStyle.hasFillPattern())
			{
				String pattern = fillStyle.getFillPattern();
				if (pattern.equals("1") || pattern.equals("25")
						|| pattern.equals("27") || pattern.equals("28")
						|| pattern.equals("30"))
				{
					if (fillStyle.hasFillForeColor())
					{
						fillcolor = fillStyle.getFillForeColor();
					}
				}
				else
				{
					if (fillStyle.hasFillColor())
					{
						fillcolor = fillStyle.getFillColor();
					}
				}
			}
			else
			{
				if (fillStyle.hasFillColor())
				{
					fillcolor = fillStyle.getFillColor();
				}
			}
		}

		return fillcolor;
	}

	/**
	 * Retuns the background color for apply in the gradient.<br/>
	 * If no gradient must be applicated, returns an empty string.
	 * @return hexadecimal representation of the color.
	 */
	private String getGradient()
	{
		String gradient = "";
		String pattern = getColorPattern();
		if (pattern.equals("25") || pattern.equals("27")
				|| pattern.equals("28") || pattern.equals("30"))
		{
			gradient = getBackColor();
		}
		return gradient;
	}

	/**
	 * Returns the direction of the gradient.<br/>
	 * If no gradient must be applicated, returns an empty string.
	 * @return Direction.(east, west, north or south)
	 */
	private String getGradientDirection()
	{
		String direction = "";
		String pattern = getColorPattern();
		if (pattern.equals("25"))
		{
			direction = mxConstants.DIRECTION_EAST;
		}
		else if (pattern.equals("27"))
		{
			direction = mxConstants.DIRECTION_WEST;
		}
		else if (pattern.equals("28"))
		{
			direction = mxConstants.DIRECTION_SOUTH;
		}
		else if (pattern.equals("30"))
		{
			direction = mxConstants.DIRECTION_NORTH;
		}
		return direction;
	}

	/**
	 * Returns the rotation of the shape.<br/>
	 * If no gradient must be applicated, returns an empty string.
	 * @return Rotation of the shape in degrees.
	 */
	public double getRotation()
	{
		mxVdxShapeForm vsf = new mxVdxShapeForm(this, masterShape,
				masterElement, 0);
		double rotation = 0;
		if (this.hasAngle())
		{

			rotation = this.getAngle();

		}
		else if (masterShape != null && masterShape.hasAngle())
		{
			rotation = masterShape.getAngle();

		}
		//Correct the rotation of shapes out of phase.
		if (vsf.isEastDirection())
		{
			rotation = Math.toDegrees(rotation);
			rotation -= 90;
			rotation = rotation % 360;
			return 360 - rotation;
		}
		rotation = Math.toDegrees(rotation);
		rotation = rotation % 360;
		return 360 - rotation;
	}

	/**
	 * Returns the label background color.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return hexadecimal representation of the color.
	 */
	public String getLabelBkgndColor()
	{
		String lbkgnd = "";
		if (this.hasTextBkgndColor())
		{
			lbkgnd = this.getTextBkgndColor();
		}
		else if (masterShape != null && masterShape.hasTextBkgndColor())
		{
			lbkgnd = masterShape.getTextBkgndColor();
		}
		else if (textStyle != null && textStyle.hasTextBkgndColor())
		{
			lbkgnd = textStyle.getTextBkgndColor();
		}
		return lbkgnd;
	}

	/**
	 * Returns the top spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Top spacing in double precision.
	 */
	public double getTopSpacing()
	{
		double topMargin = 0;
		if (this.hasTextTopMargin())
		{
			topMargin = this.getTextTopMargin();
		}
		else if (masterShape != null && masterShape.hasTextTopMargin())
		{
			topMargin = masterShape.getTextTopMargin();
		}
		else if (textStyle != null && textStyle.hasTextTopMargin())
		{
			topMargin = textStyle.getTextTopMargin();
		}
		//value is fixed.
		return topMargin / 2 - 2.8;
	}

	/**
	 * Returns the bottom spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Bottom spacing in double precision.
	 */
	public double getBottomSpacing()
	{
		double bottomMargin = 0;
		if (this.hasTextBottomMargin())
		{
			bottomMargin = this.getTextBottomMargin();
		}
		else if (masterShape != null && masterShape.hasTextBottomMargin())
		{
			bottomMargin = masterShape.getTextBottomMargin();
		}
		else if (textStyle != null && textStyle.hasTextBottomMargin())
		{
			bottomMargin = textStyle.getTextBottomMargin();
		}
		return bottomMargin / 2 - 2.8;
	}

	/**
	 * Returns the left spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Left spacing in double precision.
	 */
	public double getLeftSpacing()
	{
		double leftMargin = 0;
		if (this.hasTextLeftMargin())
		{
			leftMargin = this.getTextLeftMargin();
		}
		else if (masterShape != null && masterShape.hasTextLeftMargin())
		{
			leftMargin = masterShape.getTextLeftMargin();
		}
		else if (textStyle != null && textStyle.hasTextLeftMargin())
		{
			leftMargin = textStyle.getTextLeftMargin();
		}
		return leftMargin / 2 - 2.8;
	}

	/**
	 * Returns the right spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Right spacing in double precision.
	 */
	public double getRightSpacing()
	{
		double rightMargin = 0;
		if (this.hasTextRightMargin())
		{
			rightMargin = this.getTextRightMargin();
		}
		else if (masterShape != null && masterShape.hasTextRightMargin())
		{
			rightMargin = masterShape.getTextRightMargin();
		}
		else if (textStyle != null && textStyle.hasTextRightMargin())
		{
			rightMargin = textStyle.getTextRightMargin();
		}
		return rightMargin / 2 - 2.8;
	}

	/**
	 * Returns the vertical align of the label.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Vertical align (bottom, middle and top)
	 */
	public String getAlignVertical()
	{
		int align = 1;
		String vertical = mxConstants.ALIGN_MIDDLE;
		if (this.hasVerticalAlign())
		{
			align = this.getVerticalAlign();
		}
		else if (masterShape != null && masterShape.hasVerticalAlign())
		{
			masterShape.getVerticalAlign();
		}
		else if (textStyle != null && textStyle.hasVerticalAlign())
		{
			textStyle.getVerticalAlign();
		}
		if (align == 0)
		{
			vertical = mxConstants.ALIGN_TOP;
		}
		else if (align == 2)
		{
			vertical = mxConstants.ALIGN_BOTTOM;
		}
		return vertical;
	}

	/**
	 * Checks if the label must be rotated.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Returns <code>true<code/> if the label must remains horizontal.
	 */
	public boolean getLabelRotation()
	{
		boolean horz = true;
		//Defines rotation.
		double rotation = this.getRotation();

		double angle = 0;
		if (this.hasTxtAngle())
		{
			angle = this.getTxtAngle();
		}
		else if (masterShape != null && masterShape.hasTxtAngle())
		{
			angle = masterShape.getTxtAngle();
		}
		else if (textStyle != null && textStyle.hasTxtAngle())
		{
			angle = textStyle.getTxtAngle();
		}
		angle = Math.toDegrees(angle);
		angle = angle - rotation;
		if (!(Math.abs(angle) < 45 || Math.abs(angle) > 270))
		{
			horz = false;
		}

		return horz;
	}

	/**
	 * Analizes the shape and returns a string whith the style.
	 * @return style readed from the shape.
	 */
	public String getStyleFromShape(double parentHeight)
	{

		StringBuilder style = new StringBuilder();
		mxVdxShapeForm vsf = new mxVdxShapeForm(this, masterShape,
				masterElement, parentHeight);
		//Set the style of the labels.
		style.append(mxConstants.STYLE_WHITE_SPACE + "=wrap;");

		//Defines rotation.
		double rotation = this.getRotation();

		//Defines Label Rotation
		String rotationString = getLabelRotation() ? "1" : "0";
		style.append(mxConstants.STYLE_HORIZONTAL + "=" + rotationString + ";");

		style.append(mxConstants.STYLE_ROTATION + "=" + rotation + ";");

		//Defines fillcolor
		String fillcolor = getColor();
		if (!fillcolor.equals(""))
		{
			style.append(mxConstants.STYLE_FILLCOLOR + "=" + fillcolor + ";");
		}

		//Defines gradient
		String gradient = getGradient();
		if (!gradient.equals(""))
		{
			style.append(mxConstants.STYLE_GRADIENTCOLOR + "=" + gradient + ";");
			String gradientDirection = getGradientDirection();
			if (!gradientDirection.equals(""))
			{
				style.append(mxConstants.STYLE_GRADIENT_DIRECTION + "=" + gradientDirection + ";");
			}
		}
		//Defines Form
		String form = vsf.getForm();
		if (form.equals("text"))
		{
			form = vsf.getAproxForm();
			// TODO Moved here when simplifying vertex import to just the parent
			// Sometime the parent was 0 opacity and the children represent the drawing
			// So we now only use the value map unable to map to a shape directly
			//Defines opacity
			double opacity = this.getOpacity();
			style.append(mxConstants.STYLE_OPACITY + "=" + opacity + ";");
		}
		
		style.append(form + ";");

		//Defines if line is rounding
		if (!form.endsWith(mxConstants.STYLE_ROUNDED + "=1"))
		{
			String isRounded = getIsRounded();
			style.append(mxConstants.STYLE_ROUNDED + "=" + isRounded + ";");
		}

		//Defines line Pattern
		if (isDashed())
		{
			style.append(mxConstants.STYLE_DASHED + "=1;");
		}

		//Defines line color
		String color = getLineStrokeColor();
		style.append(mxConstants.STYLE_STROKECOLOR + "=" + color + ";");

		//Defines the line width
		double lWeight = getLineWidth();
		style.append(mxConstants.STYLE_STROKEWIDTH + "=" + lWeight + ";");

		//Defines if line has shadow
		String isShadow = getIsShadow();
		style.append(mxConstants.STYLE_SHADOW + "=" + isShadow + ";");

		//Defines label background
		String lbkgnd = getLabelBkgndColor();
		if (!lbkgnd.equals(""))
		{
			style.append(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR + "=" + lbkgnd + ";");
		}

		//Defines label top spacing
		double topMargin = getTopSpacing();
		style.append(mxConstants.STYLE_SPACING_TOP + "=" + topMargin + ";");

		//Defines label bottom spacing
		double bottomMargin = getBottomSpacing();
		style.append(mxConstants.STYLE_SPACING_BOTTOM + "=" + bottomMargin + ";");

		//Defines label left spacing
		double leftMargin = getLeftSpacing();
		style.append(mxConstants.STYLE_SPACING_LEFT + "=" + leftMargin + ";");

		//Defines label right spacing
		double rightMargin = getRightSpacing();
		style.append(mxConstants.STYLE_SPACING_RIGHT + "=" + rightMargin + ";");

		//Defines label vertical align
		String verticalAlign = getAlignVertical();
		style.append(mxConstants.STYLE_VERTICAL_ALIGN + "=" + verticalAlign + ";");

		String perimeter = vsf.getPerimeter(form);
		style.append(mxConstants.STYLE_PERIMETER + "=" + perimeter + ";");

		String direction = vsf.getDirection(form);
		style.append(mxConstants.STYLE_DIRECTION + "=" + direction + ";");

		return style.toString();
	}

	/**
	 * Checks if the lines of the shape are dashed.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>true</code> if the lines of the shape are dashed.
	 */
	public boolean isDashed()
	{
		boolean dashed = false;
		if (this.hasLinePattern())
		{
			String linePattern = this.getLinePattern();
			if (!(linePattern.equals("0") || linePattern.equals("1")))
			{
				dashed = true;
			}
		}
		else if ((masterShape != null) && masterShape.hasLinePattern())
		{
			String linePattern = masterShape.getLinePattern();
			if (!(linePattern.equals("0") || linePattern.equals("1")))
			{
				dashed = true;
			}
		}
		else if ((lineStyle != null) && lineStyle.hasLinePattern())
		{
			String linePattern = lineStyle.getLinePattern();
			if (!(linePattern.equals("0") || linePattern.equals("1")))
			{
				dashed = true;
			}
		}
		return dashed;
	}

	/**
	 * Returns the start arrow of the line.
	 * @return Type of start arrow.
	 */
	public String getStartArrow()
	{
		String beginArrow = mxConstants.NONE;
		String begin = "0";
		if (this.hasBeginArrow())
		{
			begin = this.getBeginArrow();
		}
		else if ((masterShape != null) && masterShape.hasBeginArrow())
		{
			begin = masterShape.getBeginArrow();
		}
		else if ((lineStyle != null) && lineStyle.hasBeginArrow())
		{
			begin = lineStyle.getBeginArrow();
		}

		if (begin.equals("0"))
		{
			beginArrow = mxConstants.NONE;
		}
		else if (begin.equals("1"))
		{
			beginArrow = mxConstants.ARROW_OPEN;
		}
		else if (begin.equals("5"))
		{
			beginArrow = mxConstants.ARROW_CLASSIC;
		}
		else if (begin.equals("4"))
		{
			beginArrow = mxConstants.ARROW_BLOCK;
		}
		else if (begin.equals("10"))
		{
			beginArrow = mxConstants.ARROW_OVAL;
		}
		else
		{
			beginArrow = mxConstants.ARROW_CLASSIC;
		}
		return beginArrow;
	}

	/**
	 * Returns the end arrow of the line.
	 * @return Type of end arrow.
	 */
	public String getFinalArrow()
	{
		String endArrow = mxConstants.NONE;
		String end = "0";
		if (this.hasEndArrow())
		{
			end = this.getEndArrow();
		}
		else if ((masterShape != null) && masterShape.hasEndArrow())
		{
			end = masterShape.getEndArrow();
		}
		else if ((lineStyle != null) && lineStyle.hasEndArrow())
		{
			end = lineStyle.getEndArrow();
		}

		if (end.equals("0"))
		{
			endArrow = mxConstants.NONE;
		}
		else if (end.equals("1"))
		{
			endArrow = mxConstants.ARROW_OPEN;
		}
		else if (end.equals("5"))
		{
			endArrow = mxConstants.ARROW_CLASSIC;
		}
		else if (end.equals("4"))
		{
			endArrow = mxConstants.ARROW_BLOCK;
		}
		else if (end.equals("10"))
		{
			endArrow = mxConstants.ARROW_OVAL;
		}
		else
		{
			endArrow = mxConstants.ARROW_CLASSIC;
		}
		return endArrow;
	}

	/**
	 * Returns the line color.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return hexadecimal representation of the color.
	 */
	public String getLineStrokeColor()
	{
		String color = "#000000";

		if (this.hasLineColor())
		{
			color = this.getLineColor();
		}
		else if ((masterShape != null) && masterShape.hasLineColor())
		{
			color = masterShape.getLineColor();
		}
		else if ((lineStyle != null) && lineStyle.hasLineColor())
		{
			color = lineStyle.getLineColor();
		}
		return color;
	}

	/**
	 * Returns the line width.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Line width in pixels.
	 */
	public double getLineWidth()
	{
		double lWeight = 1;

		if (this.hasLineWeight())
		{
			lWeight = this.getLineWeight();
		}
		else if ((masterShape != null) && masterShape.hasLineWeight())
		{
			lWeight = masterShape.getLineWeight();
		}
		else if ((lineStyle != null) && lineStyle.hasLineWeight())
		{
			lWeight = lineStyle.getLineWeight();
		}
		//Value is fixed for weight < 1
		if (lWeight < 1)
		{
			lWeight *= 2;
		}
		return lWeight;
	}

	/**
	 * Returns the start arrow size.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * Determines the value in pixels of each arrow size category in .vdx.
	 * @return Size in pixels.
	 */
	public float getStartArrowSize()
	{
		String baSize = "4";
		float saSize = 4;
		if (this.hasBeginArrowSize())
		{
			baSize = this.getBeginArrowSize();
		}
		else if ((masterShape != null) && masterShape.hasBeginArrowSize())
		{
			baSize = masterShape.getBeginArrowSize();
		}
		else if ((lineStyle != null) && lineStyle.hasBeginArrowSize())
		{
			baSize = lineStyle.getBeginArrowSize();
		}

		if (baSize.equals("0"))
		{
			saSize = 2;
		}
		else if (baSize.equals("1"))
		{
			saSize = 3;
		}
		else if (baSize.equals("2"))
		{
			saSize = 5;
		}
		else if (baSize.equals("3"))
		{
			saSize = 7;
		}
		else if (baSize.equals("4"))
		{
			saSize = 9;
		}
		else if (baSize.equals("5"))
		{
			saSize = 22;
		}
		else if (baSize.equals("6"))
		{
			saSize = 45;
		}
		return saSize;
	}

	/**
	 * Returns the end arrow size.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * Determines the value in pixels of each arrow size category in .vdx.
	 * @return Size in pixels.
	 */
	public float getFinalArrowSize()
	{
		String eaSize = "4";
		float faSize = 4;
		if (this.hasEndArrowSize())
		{
			eaSize = this.getEndArrowSize();
		}
		else if ((masterShape != null) && masterShape.hasEndArrowSize())
		{
			eaSize = masterShape.getEndArrowSize();
		}
		else if ((lineStyle != null) && lineStyle.hasEndArrowSize())
		{
			eaSize = lineStyle.getEndArrowSize();
		}

		if (eaSize.equals("0"))
		{
			faSize = 2;
		}
		else if (eaSize.equals("1"))
		{
			faSize = 3;
		}
		else if (eaSize.equals("2"))
		{
			faSize = 5;
		}
		else if (eaSize.equals("3"))
		{
			faSize = 7;
		}
		else if (eaSize.equals("4"))
		{
			faSize = 9;
		}
		else if (eaSize.equals("5"))
		{
			faSize = 22;
		}
		else if (eaSize.equals("6"))
		{
			faSize = 45;
		}
		return faSize;
	}

	/**
	 * Returns if the line is Rounded.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>mxVdxConstants.TRUE</code> if the line is Rounded.
	 */
	public String getIsRounded()
	{
		double round = 0;
		if (this.hasRounding())
		{
			round = this.getRounding();
		}
		else if ((masterShape != null) && masterShape.hasRounding())
		{
			round = masterShape.getRounding();
		}
		else if ((lineStyle != null) && lineStyle.hasRounding())
		{
			round = lineStyle.getRounding();
		}
		String isRounded = mxVdxConstants.FALSE;
		if (round > 0)
		{
			isRounded = mxVdxConstants.TRUE;
		}
		return isRounded;
	}

	/**
	 * Return if the line has shadow.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>mxVdxConstants.TRUE</code> if the line has shadow.
	 */
	public String getIsShadow()
	{
		String shdw = "0";
		if (this.hasShdwPattern())
		{
			shdw = this.getShdwPattern();
		}
		else if ((masterShape != null) && masterShape.hasShdwPattern())
		{
			shdw = masterShape.getShdwPattern();
		}
		else if ((lineStyle != null) && lineStyle.hasShdwPattern())
		{
			shdw = lineStyle.getShdwPattern();
		}
		String isShadow = mxVdxConstants.FALSE;
		if (!shdw.equals("0"))
		{
			isShadow = mxVdxConstants.TRUE;
		}
		return isShadow;
	}

	/**
	 * Returns the style of the edge. (Orthogonal or straight)
	 * @return Edge Style.
	 */
	public String getEdgeStyle()
	{
		if (this.getAmountLineTo() > 1)
		{
			return mxConstants.EDGESTYLE_ELBOW;
		}
		else
		{
			return mxConstants.NONE;
		}
	}

	/**
	 * Analizes a edge shape and returns a string with the style.
	 * @return style read from the edge shape.
	 */
	public String getStyleFromEdgeShape(double parentHeight)
	{
		Hashtable<String, Object> styleMap = new Hashtable<String, Object>();

		//Defines Edge Style
		styleMap.put(mxConstants.STYLE_EDGE, getEdgeStyle());

		//Defines Pattern
		String dashed = isDashed() ? "1" : "0";
		styleMap.put(mxConstants.STYLE_DASHED, dashed);

		//Defines Begin Arrow
		String beginArrow = getStartArrow();
		styleMap.put(mxConstants.STYLE_STARTARROW, beginArrow);

		//Defines End Arrow
		String endArrow = getFinalArrow();
		styleMap.put(mxConstants.STYLE_ENDARROW, endArrow);

		//Defines the start arrow size.
		float saSize = getStartArrowSize();
		styleMap.put(mxConstants.STYLE_STARTSIZE, saSize);

		//Defines the end arrow size.
		float faSize = getFinalArrowSize();
		styleMap.put(mxConstants.STYLE_ENDSIZE, faSize);

		//Defines the line width
		double lWeight = getLineWidth();
		styleMap.put(mxConstants.STYLE_STROKEWIDTH, lWeight);

		//Defines color
		String color = getLineStrokeColor();
		styleMap.put(mxConstants.STYLE_STROKECOLOR, color);

		//Defines if line is rounding
		String isRounded = getIsRounded();
		styleMap.put(mxConstants.STYLE_ROUNDED, isRounded);

		//Defines if line has shadow
		String isShadow = getIsShadow();
		styleMap.put(mxConstants.STYLE_SHADOW, isShadow);

		if (isConnectorBigNameU(getNameU()))
		{
			styleMap.put(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_ARROW);
			//Defines fillcolor
			String fillcolor = getColor();
			if (!fillcolor.equals(""))
			{
				styleMap.put(mxConstants.STYLE_FILLCOLOR, fillcolor);
			}
		}

		//Defines label background
		String lbkgnd = getLabelBkgndColor();
		if (!lbkgnd.equals(""))
		{
			styleMap.put(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, lbkgnd);
		}

		//Defines label top spacing
		double topMargin = getTopSpacing();
		styleMap.put(mxConstants.STYLE_SPACING_TOP, topMargin);

		//Defines label bottom spacing
		double bottomMargin = getBottomSpacing();
		styleMap.put(mxConstants.STYLE_SPACING_BOTTOM, bottomMargin);

		//Defines label left spacing
		double leftMargin = getLeftSpacing();
		styleMap.put(mxConstants.STYLE_SPACING_LEFT, leftMargin);

		//Defines label right spacing
		double rightMargin = getRightSpacing();
		styleMap.put(mxConstants.STYLE_SPACING_RIGHT, rightMargin);

		//Defines label vertical align
		String verticalAlign = getAlignVertical();
		styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN, verticalAlign);

		//Defines Label Rotation
		styleMap.put(mxConstants.STYLE_HORIZONTAL, getLabelRotation());

		return mxVdxUtils.getStyleString(styleMap, "=");
	}

	/**
	 * Returns the points of a vertex shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return array of mxPoint whith the vertex's points
	 */
	public mxPoint[] getVertexPoints(double parentHeight)
	{

		NodeList childrens = shape.getChildNodes();
		mxPoint origin = this.getOriginPoint(parentHeight);
		mxPoint dimentions = this.getDimentions();
		Element geom = mxVdxUtils.nodeListTag(childrens, mxVdxConstants.GEOM);
		NodeList lineToList = geom.getElementsByTagName(mxVdxConstants.LINE_TO);
		int length = lineToList.getLength();
		mxPoint[] points = new mxPoint[length];

		for (int i = 0; i < length; i++)
		{
			Element lineTo = (Element) lineToList.item(i);
			points[i] = getLineToXY(lineTo);
			points[i].setX(points[i].getX() + origin.getX());
			points[i]
					.setY(points[i].getY() + origin.getY() + dimentions.getY());
		}
		return points;
	}

	/**
	 * Returns the master's Id of the Shape.
	 * @return Master's ID of the shape, null if has not a master.
	 */
	public String getMasterId()
	{
		if (shape.hasAttribute(mxVdxConstants.MASTER))
		{
			return shape.getAttribute(mxVdxConstants.MASTER);
		}
		else
		{
			return null;
		}
	}

	/**
	 * Gets the Master's Id of the shape. If it not has the master atribute, the function look
	 * for it in his parents.
	 * @return Master's Id of the shape.
	 */
	public String lookForMasterId()
	{
		String id = null;
		Element shap = this.shape;
		while ((id == null || id.equals(""))
				&& (!shap.getTagName().equals(mxVdxConstants.PAGE)))
		{
			id = shap.getAttribute(mxVdxConstants.MASTER);
			shap = (Element) shap.getParentNode();
		}
		return id;
	}

	/**
	 * Returns the masterShape's Id of the shape.
	 * @return Master Shape's ID of the shape, null if has not a master shape.
	 */
	public String getShapeMasterId()
	{
		if (shape.hasAttribute(mxVdxConstants.MASTER_SHAPE))
		{
			return shape.getAttribute(mxVdxConstants.MASTER_SHAPE);
		}
		else
		{
			return null;
		}
	}

	/**
	 * Checks if a shape contains other shapes inside.
	 * @return Returns <code>true</code> if a shape contains other shapes inside.
	 */
	public boolean isGroup()
	{
		return shape.getAttribute("Type").equals("Group");
	}

	/**
	 * Returns if the shape is composed for several shapes.
	 * @return Returns <code>true</code> if the shape is composed for several shapes.
	 */
	public boolean isComplexShape()
	{
		mxVdxShapeForm vsf = new mxVdxShapeForm(this, masterShape,
				masterElement, 0);
		boolean isComplex = false;
		if (isGroup())
		{
			isComplex = vsf.isSwimlane();
			isComplex |= vsf.isSubproces();
			isComplex |= vsf.isSimpleComplex();
		}
		return isComplex;
	}

	/**
	 * Adds a Complex shape to the graph.
	 * The sub-shapes of a complex shape are processed like part of the shape.
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return Cell added to the graph.
	 */
	public mxCell addComplexShapeToGraph(mxGraph graph, Object parent,
			double parentHeight)
	{
		mxVdxShapeForm vsf = new mxVdxShapeForm(this, masterShape,
				masterElement, 0);
		if (vsf.isSwimlane())
		{
			//Set title
			String t = "";
			Element text = (Element) shape.getElementsByTagName("Text").item(0);
			if (text != null)
			{
				t = (text.getTextContent());
			}

			//Get subshapes.
			NodeList shpsList = shape.getElementsByTagName("Shapes");
			Element shps = (Element) shpsList.item(0);
			NodeList child = shps.getChildNodes();
			Element sh = (Element) child.item(child.getLength() - 2);
			mxVdxShape subShape = new mxVdxShape(sh);
			Element sh2 = (Element) child.item(child.getLength() - 1);
			mxVdxShape subShape2 = new mxVdxShape(sh2);

			//Define dimentions
			mxPoint d = this.getDimentions();
			d.setY(subShape.getDimentions().getY());

			//Define origin
			mxPoint o = this.getOriginPoint(parentHeight);

			//Define style
			String style = this.getStyleFromShape(parentHeight);

			HashMap<String, Object> styleMap = mxVdxUtils.getStyleMap(style,
					"=");
			styleMap.put(mxConstants.STYLE_FILLCOLOR, subShape2.getColor());
			style = mxVdxUtils.getStyleString(styleMap, "=");

			//Insert a new vertex in the graph
			mxCell v1 = (mxCell) graph.insertVertex(parent, null, t, o.getX(),
					o.getY(), d.getX(), d.getY(), style);

			return v1;
		}
		else
		{
			//The first shape has all the properties.
			return this.addSimpleShapeToGraph(graph, parent, parentHeight);
		}
	}

	/**
	 * Adds a simple shape to the graph
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return Cell added to the graph.
	 */
	public mxCell addSimpleShapeToGraph(mxGraph graph, Object parent,
			double parentHeight)
	{
		mxVdxShapeForm vsf = new mxVdxShapeForm(this, masterShape,
				masterElement, 0);
		//Defines Text Label.
		String textLabel = this.getTextLabel();

		mxPoint cordenates = this.getOriginPoint(parentHeight);
		mxPoint dimentions = this.getDimentions();
		if (vsf.isEastDirection())
		{
			double y = dimentions.getY();
			double x = dimentions.getX();
			dimentions.setX(y);
			dimentions.setY(x);
		}
		//Defines style
		String style = this.getStyleFromShape(parentHeight);

		//Insert a new vertex in the graph
		mxCell v1 = (mxCell) graph.insertVertex(parent, null, textLabel,
				cordenates.getX(), cordenates.getY(), dimentions.getX(),
				dimentions.getY(), style);
		return v1;
	}
}
