package com.mxgraph.io.vdx;

import com.mxgraph.util.mxPoint;
import java.util.ArrayList;
import java.util.List;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * This class is a general wrapper for one Shape Element.<br/>
 * Provides a set of method for retrieve the value of the diferents properties
 * stored in the shape element.<br/>
 * References to other shapes or stylesheets are not considered.
 */
public class mxGeneralShape
{
	protected Element shape;

	/**
	 * Create a new instance of mxGeneralShape
	 * @param shape Shape Element to be wrapped.
	 */
	public mxGeneralShape(Element shape)
	{
		this.shape = shape;
	}

	/**
	 * Returns the shape contained.
	 * @return Shape Element contained.
	 */
	public Element getShape()
	{
		return shape;
	}

	/**
	 * Sets the shape to be contained.
	 * @param shape Shape Element to be contained.
	 */
	public void setShape(Element shape)
	{
		this.shape = shape;
	}

	/**
	 * Returns the id of the stylesheet that contains the fill style.
	 * @return ID of the stylesheet.
	 */
	public String getFillStyleId()
	{
		return shape.getAttribute(mxVdxConstants.FILL_STYLE);
	}

	/**
	 * Returns the id of the stylesheet that contains the line style
	 * @return ID of the stylesheet.
	 */
	public String getLineStyleId()
	{
		return shape.getAttribute(mxVdxConstants.LINE_STYLE);
	}

	/**
	 * Returns the id of the stylesheet that contains the text style
	 * @return ID of the stylesheet.
	 */
	public String getTextStyleId()
	{
		return shape.getAttribute(mxVdxConstants.TEXT_STYLE);
	}

	/**
	 * Checks if the shape Element has a children with tag name = 'tag'.
	 * @param tag Name of the Element to be found.
	 * @return Returns <code>true</code> if the shape Element has a children with tag name = 'tag'
	 */
	protected boolean hasPrimaryTag(String tag)
	{
		boolean ret = false;
		NodeList childrens = shape.getChildNodes();
		if (mxVdxUtils.nodeListHasTag(childrens, tag))
		{
			ret = true;
		}
		else
		{
			ret = false;

		}
		return ret;
	}

	/**
	 * Returns the element with tag name = 'tag' in the childrens of shape
	 * @param tag Name of the Element to be found.
	 * @return Element with tag name = 'tag'.
	 */
	protected Element getPrimaryTag(String tag)
	{
		NodeList childrens = shape.getChildNodes();
		Element primary = null;
		if (mxVdxUtils.nodeListHasTag(childrens, tag))
		{
			primary = mxVdxUtils.nodeListTag(childrens, tag);
		}
		return primary;
	}

	/**
	 * Returns the element with tag name = 'tag' and IX attribute = 'ix' in the childrens of shape.
	 * @param tag Name of the Element to be found. 
	 * @param ix Index of the Element to be found.
	 * @return Element with tag name = 'tag' and IX attribute = 'ix'.
	 */
	protected Element getPrimaryTagIndexed(String tag, String ix)
	{
		NodeList childrens = shape.getChildNodes();
		Element primary = null;
		if (mxVdxUtils.nodeListHasTag(childrens, tag))
		{
			primary = mxVdxUtils.nodeListTagIndexed(childrens, tag, ix);
		}
		return primary;
	}

	/**
	 * Checks if the 'primary' Element has a children with tag name = 'tag'.
	 * @param tag Name of the Element to be found.
	 * @return Returns <code>true</code> if the 'primary' Element has a children with tag name = 'tag'.
	 */
	protected boolean hasSecondaryTag(Element primary, String tag)
	{
		NodeList xChildrens = null;
		boolean ret = false;
		if (primary != null)
		{
			xChildrens = primary.getChildNodes();
		}
		if (mxVdxUtils.nodeListHasTag(xChildrens, tag))
		{
			ret = true;
		}
		else
		{
			ret = false;
		}
		return ret;
	}

	/**
	 * Returns the value of the element with tag name = 'tag' in the childrens
	 * of 'primary' in his double representation.<br/>
	 * .vdx uses Inches for numerical representations, so this value
	 * is multiplied by the result of <code>mxVdxUtils.conversionFactor()</code>
	 * and is converted to pixels.
	 * @param tag Name of the Element to be found.
	 * @return Numerical value of the element.
	 */
	protected double getNumericalValueOfSecondaryTag(Element primary, String tag)
	{
		double val = 0;
		NodeList xChildrens = null;
		if (primary != null)
		{
			xChildrens = primary.getChildNodes();
		}
		Element elem = null;

		if (mxVdxUtils.nodeListHasTag(xChildrens, tag))
		{
			elem = mxVdxUtils.nodeListTag(xChildrens, tag);
		}

		if (elem != null)
		{
			val = Double.parseDouble(elem.getTextContent())
					* mxVdxUtils.conversionFactor();
		}
		return val;
	}

	/**
	 * Returns the value of the element with tag name = 'tag' in the childrens
	 * of primary.
	 * @param tag Name of the Element to be found.
	 * @return String value of the element.
	 */
	protected String getValueOfSecondaryTag(Element primary, String tag)
	{
		String val = "";
		NodeList xChildrens = null;
		if (primary != null)
		{
			xChildrens = primary.getChildNodes();
		}
		Element elem = null;
		if (mxVdxUtils.nodeListHasTag(xChildrens, tag))
		{
			elem = mxVdxUtils.nodeListTag(xChildrens, tag);
			val = elem.getTextContent();
		}

		return val;
	}

	/**
	 * Check if the shape has defined a pinX element.
	 * @return Returns <code>true</code> if the shape has defined a pinX element.
	 */
	public boolean hasPinX()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(xForm, mxVdxConstants.PIN_X);
	}

	/**
	 * Returns the value of the pinX element.
	 * @return The shape pinX element
	 */
	public double getPinX()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		double px = 0;
		if (hasSecondaryTag(xForm, mxVdxConstants.PIN_X))
		{
			px = getNumericalValueOfSecondaryTag(xForm, mxVdxConstants.PIN_X);
		}
		return px;
	}

	/**
	 * Returns <code>true</code> if the shape has defined a pinY element.
	 * @return Returns <code>true</code> if the shape has defined a pinY element.
	 */
	public boolean hasPinY()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(xForm, mxVdxConstants.PIN_Y);
	}

	/**
	 * Returns the value of the pinY element in pixels.
	 * @return Numerical value of the pinY element.
	 */
	public double getPinY()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		double py = 0;
		if (hasSecondaryTag(xForm, mxVdxConstants.PIN_Y))
		{
			py = getNumericalValueOfSecondaryTag(xForm, mxVdxConstants.PIN_Y);
		}
		return py;
	}

	/**
	 * Check if the shape has defined a locPinX element.
	 * @return Returns <code>true</code> if the shape has defined a locPinX element.
	 */
	public boolean hasLocPinX()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(xForm, mxVdxConstants.LOC_PIN_X);
	}

	/**
	 * Returns the value of the locPinX element in pixels.
	 * @return Numerical value of the pinY element.
	 */
	public double getLocPinX()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		double py = 0;
		if (hasSecondaryTag(xForm, mxVdxConstants.LOC_PIN_X))
		{
			py = getNumericalValueOfSecondaryTag(xForm,
					mxVdxConstants.LOC_PIN_X);
		}
		return py;
	}

	/**
	 * Check if the shape has defined a locPinY element.
	 * @return Returns <code>true</code> if the shape has defined a locPinY element.
	 */
	public boolean hasLocPinY()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(xForm, mxVdxConstants.LOC_PIN_Y);

	}

	/**
	 * Returns the value of the locPinY element in pixels.
	 * @return Numerical value of the locPinY element.
	 */
	public double getLocPinY()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		double py = 0;
		if (hasSecondaryTag(xForm, mxVdxConstants.LOC_PIN_Y))
		{
			py = getNumericalValueOfSecondaryTag(xForm,
					mxVdxConstants.LOC_PIN_Y);
		}
		return py;
	}

	/**
	 * Checks if the shape has defined a width element.
	 * @return Returns <code>true</code> if the shape has defined a width element.
	 */
	public boolean hasWidth()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(xForm, mxVdxConstants.WIDTH);
	}

	/**
	 * Returns the value of the width element in pixels.
	 * @return Numerical value of the width element.
	 */
	public double getWidth()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		double w = 0;
		if (hasSecondaryTag(xForm, mxVdxConstants.WIDTH))
		{
			w = getNumericalValueOfSecondaryTag(xForm, mxVdxConstants.WIDTH);
		}
		return w;
	}

	/**
	 * Checks if the shape has defined a height element.
	 * @return Returns <code>true</code> if the shape has defined a height element.
	 */
	public boolean hasHeight()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(xForm, mxVdxConstants.HEIGHT);
	}

	/**
	 * Returns the value of the height element in pixels.
	 * @return Numerical value of the height element.
	 */
	public double getHeight()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.X_FORM);
		double h = 0;
		if (hasSecondaryTag(xForm, mxVdxConstants.HEIGHT))
		{
			h = getNumericalValueOfSecondaryTag(xForm, mxVdxConstants.HEIGHT);
		}
		return h;
	}

	/**
	 * Checks if back ground color of the Shape is defined.
	 * @return Returns <code>true</code> if back ground color of the Shape is defined.
	 */
	public boolean hasFillColor()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.FILL);
		return hasSecondaryTag(xForm, mxVdxConstants.FILL_BKGND);
	}

	/**
	 * Returns the background color.
	 * @return Background color in hexadecimal representation.
	 */
	public String getFillColor()
	{

		Element fill = getPrimaryTag(mxVdxConstants.FILL);
		String color = "";
		if (hasSecondaryTag(fill, mxVdxConstants.FILL_BKGND))
		{
			color = getValueOfSecondaryTag(fill, mxVdxConstants.FILL_BKGND);
		}
		if (!color.startsWith("#"))
		{
			mxPropertiesManager pm = mxPropertiesManager.getInstance();
			color = pm.getColor(color);
		}
		return color;
	}

	/**
	 * Checks if foreground color of the Shape is defined.
	 * @return Returns <code>true</code> if foreground color of the Shape is defined.
	 */
	public boolean hasFillForeColor()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.FILL);
		return hasSecondaryTag(xForm, mxVdxConstants.FILL_FOREGND);
	}

	/**
	 * Returns the foreground color.
	 * @return Foreground color in hexadecimal representation.
	 */
	public String getFillForeColor()
	{

		Element fill = getPrimaryTag(mxVdxConstants.FILL);
		String color = "";
		if (hasSecondaryTag(fill, mxVdxConstants.FILL_FOREGND))
		{
			color = getValueOfSecondaryTag(fill, mxVdxConstants.FILL_FOREGND);
		}
		if (!color.startsWith("#"))
		{
			mxPropertiesManager pm = mxPropertiesManager.getInstance();
			color = pm.getColor(color);
		}
		return color;
	}

	/**
	 * Checks if pattern of the Shape is defined.
	 * @return Returns <code>true</code> if pattern of the Shape is defined.
	 */
	public boolean hasFillPattern()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.FILL);
		return hasSecondaryTag(xForm, mxVdxConstants.FILL_PATTERN);
	}

	/**
	 * Returns the pattern.
	 * @return String value of the FillPattern element.
	 */
	public String getFillPattern()
	{

		Element fill = getPrimaryTag(mxVdxConstants.FILL);
		String pattern = "";
		if (hasSecondaryTag(fill, mxVdxConstants.FILL_PATTERN))
		{
			pattern = getValueOfSecondaryTag(fill, mxVdxConstants.FILL_PATTERN);
		}
		return pattern;
	}

	/**
	 * Checks if shadow pattern of the Shape is defined.
	 * @return Returns <code>true</code> if shadow pattern of the Shape is defined.
	 */
	public boolean hasShdwPattern()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.FILL);
		return hasSecondaryTag(xForm, mxVdxConstants.SHDW_PATTERN);
	}

	/**
	 * Returns the shadow pattern.
	 * @return String value of the ShdwPattern Element
	 */
	public String getShdwPattern()
	{

		Element fill = getPrimaryTag(mxVdxConstants.FILL);
		String pattern = "";
		if (hasSecondaryTag(fill, mxVdxConstants.SHDW_PATTERN))
		{
			pattern = getValueOfSecondaryTag(fill, mxVdxConstants.SHDW_PATTERN);
		}
		return pattern;
	}

	/**
	 * Checks if pattern of the line is defined.
	 * @return Returns <code>true</code> if pattern of the line is defined.
	 */
	public boolean hasLinePattern()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(xForm, mxVdxConstants.LINE_PATTERN);
	}

	/**
	 * Returns the line pattern of the shape
	 * @return String value of the LinePattern element.
	 */
	public String getLinePattern()
	{
		Element fill = getPrimaryTag(mxVdxConstants.LINE);
		String pattern = "";
		if (hasSecondaryTag(fill, mxVdxConstants.LINE_PATTERN))
		{
			pattern = getValueOfSecondaryTag(fill, mxVdxConstants.LINE_PATTERN);
		}
		return pattern;
	}

	/**
	 * Checks if begin arrow of the line is defined.
	 * @return Returns <code>true</code> if begin arrow of the line is defined.
	 */
	public boolean hasBeginArrow()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(xForm, mxVdxConstants.BEGIN_ARROW);

	}

	/**
	 * Returns the line begin arrow of the shape
	 * @return String value of the BeginArrow element.
	 */
	public String getBeginArrow()
	{
		Element fill = getPrimaryTag(mxVdxConstants.LINE);
		String arrow = "";
		if (hasSecondaryTag(fill, mxVdxConstants.BEGIN_ARROW))
		{
			arrow = getValueOfSecondaryTag(fill, mxVdxConstants.BEGIN_ARROW);
		}
		return arrow;
	}

	/**
	 * Checks if end arrow of the line is defined.
	 * @return Returns <code>true</code> if end arrow of the line is defined.
	 */
	public boolean hasEndArrow()
	{
		Element xForm = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(xForm, mxVdxConstants.END_ARROW);
	}

	/**
	 * Returns the line end arrow of the shape
	 * @return String value of the EndArrow element.
	 */
	public String getEndArrow()
	{
		Element fill = getPrimaryTag(mxVdxConstants.LINE);
		String arrow = "";
		if (hasSecondaryTag(fill, mxVdxConstants.END_ARROW))
		{
			arrow = getValueOfSecondaryTag(fill, mxVdxConstants.END_ARROW);
		}
		return arrow;
	}

	/**
	 * Checks if begin arrow size of the line is defined.
	 * @return Returns <code>true</code> if begin arrow size of the line is defined.
	 */
	public boolean hasBeginArrowSize()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(line, mxVdxConstants.BEGIN_ARROW_SIZE);

	}

	/**
	 * Returns the line begin arrow size of the shape
	 * @return String value of the BeginArrowSize element.
	 */
	public String getBeginArrowSize()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		String size = "";
		if (hasSecondaryTag(line, mxVdxConstants.BEGIN_ARROW_SIZE))
		{
			size = getValueOfSecondaryTag(line, mxVdxConstants.BEGIN_ARROW_SIZE);
		}
		return size;
	}

	/**
	 * Checks if end arrow size of the line is defined.
	 * @return Returns <code>true</code> if end arrow size of the line is defined.
	 */
	public boolean hasEndArrowSize()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(line, mxVdxConstants.END_ARROW_SIZE);

	}

	/**
	 * Returns the line end arrow size of the shape
	 * @return String value of the EndArrowSize element.
	 */
	public String getEndArrowSize()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		String size = "";
		if (hasSecondaryTag(line, mxVdxConstants.END_ARROW_SIZE))
		{
			size = getValueOfSecondaryTag(line, mxVdxConstants.END_ARROW_SIZE);
		}
		return size;
	}

	/**
	 * Checks if the line weight is defined.
	 * @return Returns <code>true</code> if the line weight is defined.
	 */
	public boolean hasLineWeight()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(line, mxVdxConstants.LINE_WEIGHT);
	}

	/**
	 * Returns the line weight of the shape in pixels
	 * @return Numerical value of the LineWeight element.
	 */
	public double getLineWeight()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		double lw = 0;
		if (hasSecondaryTag(line, mxVdxConstants.LINE_WEIGHT))
		{
			lw = getNumericalValueOfSecondaryTag(line,
					mxVdxConstants.LINE_WEIGHT);
		}
		return lw;
	}

	/**
	 * Checks if line color of the Shape is defined.
	 * @return Returns <code>true</code> if line color of the Shape is defined.
	 */
	public boolean hasLineColor()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(line, mxVdxConstants.LINE_COLOR);
	}

	/**
	 * Returns the line color.
	 * @return Line color of the shape in hexadecimal representation.
	 */
	public String getLineColor()
	{

		Element line = getPrimaryTag(mxVdxConstants.LINE);
		String color = "";
		if (hasSecondaryTag(line, mxVdxConstants.LINE_COLOR))
		{
			color = getValueOfSecondaryTag(line, mxVdxConstants.LINE_COLOR);
		}
		if (!color.startsWith("#"))
		{
			mxPropertiesManager pm = mxPropertiesManager.getInstance();
			color = pm.getColor(color);
		}
		return color;
	}

	/**
	 * Checks if the rounding factor of the Shape is defined.
	 * @return Returns <code>true</code> if line color of the Shape is defined.
	 */
	public boolean hasRounding()
	{
		Element line = getPrimaryTag(mxVdxConstants.LINE);
		return hasSecondaryTag(line, mxVdxConstants.ROUNDING);
	}

	/**
	 * Returns the rounding factor.
	 * @return Value of the Rounding element
	 */
	public double getRounding()
	{

		Element line = getPrimaryTag(mxVdxConstants.LINE);
		double r = 0;
		if (hasSecondaryTag(line, mxVdxConstants.ROUNDING))
		{
			String val = "";
			val = getValueOfSecondaryTag(line, mxVdxConstants.ROUNDING);
			if (!val.equals(""))
			{
				r = Double.valueOf(val);
			}
		}
		return r;
	}

	/**
	 * Checks if transparence of the Shape is defined.
	 * @return Returns <code>true</code> if transparence of the Shape is defined.
	 */
	public boolean hasTransparence()
	{
		Element fill = getPrimaryTag(mxVdxConstants.FILL);
		return hasSecondaryTag(fill, mxVdxConstants.FILL_BKGND_TRANS);
	}

	/**
	 * Returns the level of transparence of the Shape.
	 * @return double in range (opaque = 0)..(100 = transparent)
	 */
	public double getTransparence()
	{
		Element fill = getPrimaryTag(mxVdxConstants.FILL);
		double trans = 0;
		if (hasSecondaryTag(fill, mxVdxConstants.FILL_BKGND_TRANS))
		{
			trans = getNumericalValueOfSecondaryTag(fill,
					mxVdxConstants.FILL_BKGND_TRANS);
		}
		return trans;
	}

	/**
	 * Checks if angle of the Shape is defined.
	 * @return Returns <code>true</code> if angle of the Shape is defined.
	 */
	public boolean hasAngle()
	{
		Element fill = getPrimaryTag(mxVdxConstants.X_FORM);
		return hasSecondaryTag(fill, mxVdxConstants.ANGLE);
	}

	/**
	 * Returns the rotation angle of the Shape.
	 * @return Value of the Angle element in radians.
	 */
	public double getAngle()
	{
		Element fill = getPrimaryTag(mxVdxConstants.X_FORM);
		double angle = 0;
		if (hasSecondaryTag(fill, mxVdxConstants.ANGLE))
		{
			String rot = "0";
			rot = getValueOfSecondaryTag(fill, mxVdxConstants.ANGLE);
			angle = Double.valueOf(rot);
		}
		return angle;
	}

	/**
	 * Checks if the shape has defined a Text element.
	 * @return Returns <code>true</code> if the shape has defined a Text element.
	 */
	public boolean hasText()
	{
		return hasPrimaryTag(mxVdxConstants.TEXT);
	}

	/**
	 * Returns the value of the Text element.
	 * @return Value of the Text element.
	 */
	public String getText()
	{
		String ret = "";
		Element text = getPrimaryTag(mxVdxConstants.TEXT);

		if (text != null)
		{
			ret = text.getTextContent();
		}
		return ret;
	}

	/**
	 * Returns the childrens Nodes of Text.
	 * @return List with the childrens of the Text element.
	 */
	public List<Node> getTextChildrens()
	{
		List<Node> list = null;
		Element text = getPrimaryTag(mxVdxConstants.TEXT);
		NodeList child = null;
		if (text != null)
		{
			child = text.getChildNodes();
			list = mxVdxUtils.copyNodeList(child);
		}
		return list;
	}

	/**
	 * Returns the NameU attribute.
	 * @return Value of the NameU attribute.
	 */
	public String getNameU()
	{
		String nameU = "";
		if (shape.hasAttribute(mxVdxConstants.NAME_U))
		{
			nameU = shape.getAttribute(mxVdxConstants.NAME_U);
		}
		return nameU;
	}

	/**
	 * Returns the value of the Id attribute.
	 * @return Value of the Id attribute.
	 */
	public String getId()
	{
		return shape.getAttribute(mxVdxConstants.ID);
	}

	/**
	 * Checks if the Geom Element of the shape contains the Ellipse element.
	 * @return Returns <code>true</code> if the Geom Element of the shape contains the Ellipse element.
	 */
	public boolean hasEllipse()
	{
		Element fill = getPrimaryTag(mxVdxConstants.GEOM);
		return hasSecondaryTag(fill, mxVdxConstants.ELLIPSE);
	}

	/**
	 * Returns the amount of LineTo Elements inside of the Geom Element
	 * @return Number of LineTo elements.
	 */
	public int getAmountLineTo()
	{
		List<Element> lineTo = new ArrayList<Element>();
		Element Geom = getPrimaryTag(mxVdxConstants.GEOM);
		NodeList xChildrens = null;

		if (Geom != null)
		{
			xChildrens = Geom.getChildNodes();
		}

		if (mxVdxUtils.nodeListHasTag(xChildrens, mxVdxConstants.LINE_TO))
		{
			lineTo = mxVdxUtils
					.nodeListTags(xChildrens, mxVdxConstants.LINE_TO);
		}
		int a = lineTo.size();
		return a;

	}

	/**
	 * Returns the amount of Connection Elements inside of Shape Element.
	 * @return Number of Connection Elements.
	 */
	public int getAmountConnection()
	{
		List<Element> lineTo = new ArrayList<Element>();
		NodeList xChildrens = null;

		if (shape != null)
		{
			xChildrens = shape.getChildNodes();
		}

		if (mxVdxUtils.nodeListHasTag(xChildrens, mxVdxConstants.CONNECTION))
		{
			lineTo = mxVdxUtils.nodeListTags(xChildrens,
					mxVdxConstants.CONNECTION);
		}
		int a = lineTo.size();
		return a;

	}

	/**
	 * Returns the amount of EllipticalArcTo Elements inside of Geom Element
	 * @return Number of EllipticalArcTo Elements.
	 */
	public int getAmountEllipticalArcTo()
	{
		List<Element> ellipticalArcTo = new ArrayList<Element>();
		Element Geom = getPrimaryTag(mxVdxConstants.GEOM);
		NodeList xChildrens = null;

		if (Geom != null)
		{
			xChildrens = Geom.getChildNodes();
		}

		if (mxVdxUtils.nodeListHasTag(xChildrens,
				mxVdxConstants.ELLIPTICAL_ARC_TO))
		{
			ellipticalArcTo = mxVdxUtils.nodeListTags(xChildrens,
					mxVdxConstants.ELLIPTICAL_ARC_TO);
		}
		int a = ellipticalArcTo.size();
		return a;

	}

	/**
	 * Returns the amount of ArcTo Elements inside of Geom Element
	 * @return Number of ArcTo Elements.
	 */
	public int getAmountArcTo()
	{
		List<Element> arcTo = new ArrayList<Element>();
		Element Geom = getPrimaryTag(mxVdxConstants.GEOM);
		NodeList xChildrens = null;

		if (Geom != null)
		{
			xChildrens = Geom.getChildNodes();
		}

		if (mxVdxUtils.nodeListHasTag(xChildrens, mxVdxConstants.ARC_TO))
		{
			arcTo = mxVdxUtils.nodeListTags(xChildrens, mxVdxConstants.ARC_TO);
		}
		int a = arcTo.size();
		return a;
	}

	/**
	 * Checks if the shape has the XForm1D element.
	 * @return Returns <code>true</code> if the shape has the XForm1D element.
	 */
	public boolean hasXForm1D()
	{
		NodeList childrens = shape.getChildNodes();
		return mxVdxUtils.nodeListHasTag(childrens, mxVdxConstants.X_FORM_1D);
	}

	/**
	 * Returns the co-ordinates of the begin point of an Edge Shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return mxPoint that represents the co-ordinates.
	 */
	public mxPoint getBeginXY(double parentHeight)
	{
		double beginX = 0;
		double beginY = 0;
		if (hasPrimaryTag(mxVdxConstants.X_FORM_1D))
		{
			Element xForm1D = getPrimaryTag(mxVdxConstants.X_FORM_1D);
			if (hasSecondaryTag(xForm1D, mxVdxConstants.BEGIN_X))
			{
				beginX = getNumericalValueOfSecondaryTag(xForm1D,
						mxVdxConstants.BEGIN_X);
			}
			if (hasSecondaryTag(xForm1D, mxVdxConstants.BEGIN_Y))
			{
				beginY = parentHeight
						- getNumericalValueOfSecondaryTag(xForm1D,
								mxVdxConstants.BEGIN_Y);
			}
		}
		return new mxPoint(beginX, beginY);
	}

	/**
	 * Returns the co-ordinates of the end point of an Edge Shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return mxPoint that represents the co-ordinates.
	 */
	public mxPoint getEndXY(double parentHeight)
	{
		double endX = 0;
		double endY = 0;
		if (hasPrimaryTag(mxVdxConstants.X_FORM_1D))
		{
			Element xForm1D = getPrimaryTag(mxVdxConstants.X_FORM_1D);
			if (hasSecondaryTag(xForm1D, mxVdxConstants.END_X))
			{
				endX = getNumericalValueOfSecondaryTag(xForm1D,
						mxVdxConstants.END_X);
			}
			if (hasSecondaryTag(xForm1D, mxVdxConstants.END_Y))
			{
				endY = parentHeight
						- getNumericalValueOfSecondaryTag(xForm1D,
								mxVdxConstants.END_Y);
			}
		}
		return new mxPoint(endX, endY);
	}

	/**
	 * Returns the list of routing points of a edge shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return List of mxPoint that represents the routing points.
	 */
	public List<mxPoint> getRoutingPoints(double parentHeight)
	{
		mxPoint beginXY = getBeginXY(parentHeight);
		ArrayList<mxPoint> pointList = new ArrayList<mxPoint>();
		NodeList lineTos = shape.getElementsByTagName(mxVdxConstants.LINE_TO);
		ArrayList<Element> lineToList = new ArrayList<Element>();

		//Discards deleted elements.
		int numLineTos = lineTos.getLength();

		for (int l = 0; l < numLineTos; l++)
		{
			Element lineTo = (Element) lineTos.item(l);

			if (!(lineTo.hasAttribute(mxVdxConstants.DELETED) && (lineTo
					.getAttribute(mxVdxConstants.DELETED)).equals("1")))
			{
				lineToList.add(lineTo);
			}
		}

		//Get routing points from LineTo Elements.
		int numPoints = lineToList.size();
		for (int k = 0; (k < (numPoints - 1)); k++)
		{
			Element lineTo = lineToList.get(k);
			mxPoint lineToXY = getLineToXY(lineTo);
			Double x = (beginXY.getX() + lineToXY.getX());
			Double y = (beginXY.getY() + lineToXY.getY());
			pointList.add(new mxPoint(x, y));
		}

		return pointList;
	}

	/**
	 * Returns the xy co-ordinates inside a LineTo Element.
	 * @param lineTo LineTo Element
	 * @return mxPoint that represents the xy co-ordinates
	 */
	public static mxPoint getLineToXY(Element lineTo)
	{
		Element xElem = (Element) lineTo.getElementsByTagName(mxVdxConstants.X)
				.item(0);

		Element yElem = (Element) lineTo.getElementsByTagName(mxVdxConstants.Y)
				.item(0);

		double lineToX = Double.valueOf(xElem.getTextContent())
				* mxVdxUtils.conversionFactor();
		double lineToY = (Double.valueOf(yElem.getTextContent()) * mxVdxUtils
				.conversionFactor()) * -1;
		return new mxPoint(lineToX, lineToY);
	}

	/**
	 * Checks if the color of one text fragment is defined
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the color of one text fragment is defined.
	 */
	public boolean hasTextColor(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.COLOR);
	}

	/**
	 * Returns the color of one text fragment
	 * @param charIX IX atribute of Char element
	 * @return Text color in hexadecimal representation.
	 */
	public String getTextColor(String charIX)
	{
		String color = "#000000";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.COLOR))
		{
			color = getValueOfSecondaryTag(ch, mxVdxConstants.COLOR);
			if (!color.startsWith("#"))
			{
				mxPropertiesManager pm = mxPropertiesManager.getInstance();
				color = pm.getColor(color);
			}
		}
		return color;
	}

	/**
	 * Checks if the background color of text is defined
	 * @return Returns <code>true</code> if the background color of text is defined.
	 */
	public boolean hasTextBkgndColor()
	{
		Element ch = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		return hasSecondaryTag(ch, mxVdxConstants.TEXT_BKGND);
	}

	/**
	 * Returns the background color of text.
	 * @return Text background color in hexadecimal representation.
	 */
	public String getTextBkgndColor()
	{
		String color = "";
		Element textBlock = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		if (hasSecondaryTag(textBlock, mxVdxConstants.TEXT_BKGND))
		{
			color = getValueOfSecondaryTag(textBlock, mxVdxConstants.TEXT_BKGND);
			if (!color.startsWith("#"))
			{
				mxPropertiesManager pm = mxPropertiesManager.getInstance();
				color = String.valueOf(Integer.parseInt(color) - 1);
				color = pm.getColor(color);
			}
		}
		return color;
	}

	/**
	 * Checks if the top margin of text is defined
	 * @return Returns <code>true</code> if the top margin of text is defined
	 */
	public boolean hasTextTopMargin()
	{
		Element ch = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		return hasSecondaryTag(ch, mxVdxConstants.TOP_MARGIN);
	}

	/**
	 * Returns the top margin of text in pixels.
	 * @return Numerical value of the TopMargin element
	 */
	public double getTextTopMargin()
	{
		double margin = 0;
		Element textBlock = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		if (hasSecondaryTag(textBlock, mxVdxConstants.TOP_MARGIN))
		{
			margin = getNumericalValueOfSecondaryTag(textBlock,
					mxVdxConstants.TOP_MARGIN);
		}
		return margin;
	}

	/**
	 * Checks if the bottom margin of text is defined
	 * @return Returns <code>true</code> if the bottom margin of text is defined.
	 */
	public boolean hasTextBottomMargin()
	{
		Element ch = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		return hasSecondaryTag(ch, mxVdxConstants.BOTTOM_MARGIN);
	}

	/**
	 * Returns the bottom margin of text in pixels.
	 * @return Numerical value of the BottomMargin element.
	 */
	public double getTextBottomMargin()
	{
		double margin = 0;
		Element textBlock = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		if (hasSecondaryTag(textBlock, mxVdxConstants.BOTTOM_MARGIN))
		{
			margin = getNumericalValueOfSecondaryTag(textBlock,
					mxVdxConstants.BOTTOM_MARGIN);
		}
		return margin;
	}

	/**
	 * Checks if the left margin of text is defined.
	 * @return Returns <code>true</code> if the left margin of text is defined.
	 */
	public boolean hasTextLeftMargin()
	{
		Element ch = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		return hasSecondaryTag(ch, mxVdxConstants.LEFT_MARGIN);
	}

	/**
	 * Returns the left margin of text in pixels.
	 * @return Numerical value of the LeftMargin element.
	 */
	public double getTextLeftMargin()
	{
		double margin = 0;
		Element textBlock = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		if (hasSecondaryTag(textBlock, mxVdxConstants.LEFT_MARGIN))
		{
			margin = getNumericalValueOfSecondaryTag(textBlock,
					mxVdxConstants.LEFT_MARGIN);
		}
		return margin;
	}

	/**
	 * Checks if the right margin of text is defined.
	 * @return Returns <code>true</code> if the right margin of text is defined.
	 */
	public boolean hasTextRightMargin()
	{
		Element ch = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		return hasSecondaryTag(ch, mxVdxConstants.RIGHT_MARGIN);
	}

	/**
	 * Returns the right margin of text in pixels.
	 * @return Numerical value of the RightMargin element.
	 */
	public double getTextRightMargin()
	{
		double margin = 0;
		Element textBlock = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		if (hasSecondaryTag(textBlock, mxVdxConstants.RIGHT_MARGIN))
		{
			margin = getNumericalValueOfSecondaryTag(textBlock,
					mxVdxConstants.RIGHT_MARGIN);
		}
		return margin;
	}

	/**
	 * Checks if the size of one text fragment is defined.
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the size of one text fragment is defined.
	 */
	public boolean hasTextSize(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.SIZE);
	}

	/**
	 * Returns the size of one text fragment in pixels.
	 * @param charIX IX atribute of Char element
	 * @return String representation of the numerical value of the Size element.
	 */
	public String getTextSize(String charIX)
	{
		double size = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.SIZE))
		{
			size = getNumericalValueOfSecondaryTag(ch, mxVdxConstants.SIZE);
		}
		return String.valueOf(size);
	}

	/**
	 * Checks if the style of one text fragment is defined.
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the style of one text fragment is defined.
	 */
	public boolean hasTextStyle(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.STYLE);
	}

	/**
	 * Returns the style of one text fragment.
	 * @param charIX IX atribute of Char element
	 * @return String value of the Style element.
	 */
	public String getTextStyle(String charIX)
	{
		String style = "";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.STYLE))
		{
			style = getValueOfSecondaryTag(ch, mxVdxConstants.STYLE);
		}
		return style;
	}

	/**
	 * Checks if the font of one text fragment is defined
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the font of one text fragment is defined.
	 */
	public boolean hasTextFont(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.FONT);
	}

	/**
	 * Returns the font of one text fragment
	 * @param charIX IX atribute of Char element
	 * @return Name of the font.
	 */
	public String getTextFont(String charIX)
	{
		String font = "";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.FONT))
		{
			font = getValueOfSecondaryTag(ch, mxVdxConstants.FONT);
		}
		mxPropertiesManager mpm = mxPropertiesManager.getInstance();
		font = mpm.getFont(font);
		return font;
	}

	/**
	 * Checks if the position of one text fragment is defined
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the position of one text fragment is defined.
	 */
	public boolean hasTextPos(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.POS);
	}

	/**
	 * Returns the position of one text fragment
	 * @param charIX IX atribute of Char element
	 * @return Integer value of the Pos element.
	 */
	public int getTextPos(String charIX)
	{
		int pos = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.POS))
		{
			String val = getValueOfSecondaryTag(ch, mxVdxConstants.POS);
			if (!val.equals(""))
			{
				pos = Integer.parseInt(val);
			}
		}
		return pos;
	}

	/**
	 * Checks if the strikethru of one text fragment is defined
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the strikethru of one text fragment is defined
	 */
	public boolean hasTextStrike(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.STRIKETHRU);
	}

	/**
	 * Checks if one text fragment is Strikethru
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if one text fragment is Strikethru
	 */
	public boolean getTextStrike(String charIX)
	{
		boolean strike = false;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.STRIKETHRU))
		{
			String val = getValueOfSecondaryTag(ch, mxVdxConstants.STRIKETHRU);
			strike = val.equals("1");
		}
		return strike;
	}

	/**
	 * Checks if the case of one text fragment is defined
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the case of one text fragment is defined.
	 */
	public boolean hasTextCase(String charIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		return hasSecondaryTag(ch, mxVdxConstants.CASE);
	}

	/**
	 * Returns the case property of one text fragment
	 * @param charIX IX atribute of Char element
	 * @return Integer value of the Case element
	 */
	public int getTextCase(String charIX)
	{
		int strike = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.CHAR, charIX);
		if (hasSecondaryTag(ch, mxVdxConstants.CASE))
		{
			String val = getValueOfSecondaryTag(ch, mxVdxConstants.CASE);
			if (!val.equals(""))
			{
				strike = Integer.parseInt(val);
			}
		}
		return strike;
	}

	/**
	 * Checks if the vertical align of text  is defined.
	 * @return Returns <code>true</code> if the vertical align of text  is defined.
	 */
	public boolean hasVerticalAlign()
	{
		Element tb = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		return hasSecondaryTag(tb, mxVdxConstants.VERTICAL_ALIGN);
	}

	/**
	 * Returns the vertical align property of text.
	 * @return Integer value of the VerticalAlign element.
	 */
	public int getVerticalAlign()
	{
		int strike = 0;
		Element tb = getPrimaryTag(mxVdxConstants.TEXT_BLOCK);
		if (hasSecondaryTag(tb, mxVdxConstants.VERTICAL_ALIGN))
		{
			String val = getValueOfSecondaryTag(tb,
					mxVdxConstants.VERTICAL_ALIGN);
			if (!val.equals(""))
			{
				strike = Integer.parseInt(val);
			}
		}
		return strike;
	}

	/**
	 * Checks if the angle of text is defined
	 * @return Returns <code>true</code> if the angle of text is defined.
	 */
	public boolean hasTxtAngle()
	{
		Element tb = getPrimaryTag(mxVdxConstants.TEXT_X_FORM);
		return hasSecondaryTag(tb, mxVdxConstants.TXT_ANGLE);
	}

	/**
	 * Returns the angle of the text.
	 * @return Double value of the TxtAngle element.
	 */
	public double getTxtAngle()
	{
		double strike = 0;
		Element tb = getPrimaryTag(mxVdxConstants.TEXT_X_FORM);
		if (hasSecondaryTag(tb, mxVdxConstants.TXT_ANGLE))
		{
			String val = getValueOfSecondaryTag(tb, mxVdxConstants.TXT_ANGLE);
			if (!val.equals(""))
			{
				strike = Double.valueOf(val);
			}
		}
		return strike;
	}

	/**
	 * Checks if the horizontal align of text  is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the horizontal align of text  is defined.
	 */
	public boolean hasHorizontalAlign(String paraIX)
	{
		Element para = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(para, mxVdxConstants.HORIZONTAL_ALIGN);
	}

	/**
	 * Returns the horizontal align property of text
	 * @param paraIX IX atribute of Para element
	 * @return Integer value of the HorizontalAlign element.
	 */
	public int getHorizontalAlign(String paraIX)
	{
		int horizontal = 0;
		Element tb = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(tb, mxVdxConstants.HORIZONTAL_ALIGN))
		{
			String val = getValueOfSecondaryTag(tb,
					mxVdxConstants.HORIZONTAL_ALIGN);
			if (!val.equals(""))
			{
				horizontal = Integer.parseInt(val);
			}
		}
		return horizontal;
	}

	/**
	 * Checks if the first indent of one paragraph is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the first indent of one paragraph is defined.
	 */
	public boolean hasIndentFirst(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.INDENT_FIRST);
	}

	/**
	 * Returns the first indent of one paragraph in pixels.
	 * @param paraIX IX atribute of Para element
	 * @return String representation of the numerical value of the IndentFirst element.
	 */
	public String getIndentFirst(String paraIX)
	{
		double indent = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.INDENT_FIRST))
		{
			indent = getNumericalValueOfSecondaryTag(ch,
					mxVdxConstants.INDENT_FIRST);
		}
		return String.valueOf(indent);
	}

	/**
	 * Checks if the indent to left of one paragraph is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the indent to left of one paragraph is defined.
	 */
	public boolean hasIndentLeft(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.INDENT_LEFT);
	}

	/**
	 * Returns the indent to left of one paragraph
	 * @param paraIX IX atribute of Para element
	 * @return String representation of the numerical value of the IndentLeft element.
	 */
	public String getIndentLeft(String paraIX)
	{
		double indent = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.INDENT_LEFT))
		{
			indent = getNumericalValueOfSecondaryTag(ch,
					mxVdxConstants.INDENT_LEFT);
		}
		return String.valueOf(indent);
	}

	/**
	 * Checks if the indent to right of one paragraph is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the indent to right of one paragraph is defined.
	 */
	public boolean hasIndentRight(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.INDENT_RIGHT);
	}

	/**
	 * Returns the indent to right of one paragraph
	 * @param paraIX IX atribute of Para element
	 * @return String representation of the numerical value of the IndentRight element.
	 */
	public String getIndentRight(String paraIX)
	{
		double indent = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.INDENT_RIGHT))
		{
			indent = getNumericalValueOfSecondaryTag(ch,
					mxVdxConstants.INDENT_RIGHT);
		}
		return String.valueOf(indent);
	}

	/**
	 * Checks if the space before one paragraph is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the space before one paragraph is defined.
	 */
	public boolean hasSpBefore(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.SPACE_BEFORE);
	}

	/**
	 * Returns the space before one paragraph.
	 * @param paraIX IX atribute of Para element
	 * @return String representation of the numerical value of the SpBefore element.
	 */
	public String getSpBefore(String paraIX)
	{
		double indent = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.SPACE_BEFORE))
		{
			indent = getNumericalValueOfSecondaryTag(ch,
					mxVdxConstants.SPACE_BEFORE);
		}
		return String.valueOf(indent);
	}

	/**
	 * Checks if the space after one paragraph is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the space after one paragraph is defined.
	 */
	public boolean hasSpAfter(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.SPACE_AFTER);
	}

	/**
	 * Returns the space after one paragraph
	 * @param paraIX IX atribute of Para element
	 * @return String representation of the numerical value of the SpAfter element.
	 */
	public String getSpAfter(String paraIX)
	{
		double indent = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.SPACE_AFTER))
		{
			indent = getNumericalValueOfSecondaryTag(ch,
					mxVdxConstants.SPACE_AFTER);
		}
		return String.valueOf(indent);
	}

	/**
	 * Checks if the space between lines in one paragraph is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the space between lines in one paragraph is defined.
	 */
	public boolean hasSpLine(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.SPACE_LINE);
	}

	/**
	 * Returns the space between lines in one paragraph.
	 * @param paraIX IX atribute of Para element.
	 * @return Double representation of the value of the SpLine element.
	 */
	public double getSpLine(String paraIX)
	{
		double space = 0;
		String val = "";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.SPACE_LINE))
		{
			val = getValueOfSecondaryTag(ch, mxVdxConstants.SPACE_LINE);
		}
		if (!val.equals(""))
		{
			space = Double.parseDouble(val);
		}
		return space;
	}

	/**
	 * Checks if the flags of one paragraph is defined.
	 * @param paraIX IX atribute of Para element.
	 * @return Returns <code>true</code> if the flags of one paragraph is defined.
	 */
	public boolean hasFlags(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.FLAGS);
	}

	/**
	 * Returns the flags of one paragraph.
	 * @param paraIX IX atribute of Para element.
	 * @return String value of the Flags element.
	 */
	public String getFlags(String paraIX)
	{
		String flags = "0";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.FLAGS))
		{
			flags = getValueOfSecondaryTag(ch, mxVdxConstants.FLAGS);
		}
		return flags;
	}

	/**
	 * Checks if the direction of one text fragment is defined
	 * @param paraIX IX atribute of Para element
	 * @return Returns <code>true</code> if the direction of one text fragment is defined.
	 */
	public boolean hasRTLText(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.RTL_TEXT);
	}

	/**
	 * Returns the direction of one text fragment.
	 * @param paraIX IX atribute of Para element.
	 * @return String value of the RTLText.
	 */
	public String getRTLText(String paraIX)
	{
		String flags = "ltr";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.RTL_TEXT))
		{
			flags = getValueOfSecondaryTag(ch, mxVdxConstants.RTL_TEXT);
		}
		return flags;
	}

	/**
	 * Checks if the space between characters in one text fragment is defined.
	 * @param paraIX IX atribute of Para element.
	 * @return Returns <code>true</code> if the space between characters in one text fragment is defined.
	 */
	public boolean hasLetterSpace(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.LETTER_SPACE);
	}

	/**
	 * Returns the space between characters in one text fragment.
	 * @param paraIX IX atribute of Para element.
	 * @return String representation of the numerical value of the Letterspace element.
	 */
	public String getLetterSpace(String paraIX)
	{
		double space = 0;
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.LETTER_SPACE))
		{
			space = getNumericalValueOfSecondaryTag(ch,
					mxVdxConstants.LETTER_SPACE);
		}
		return String.valueOf(space);
	}

	/**
	 * Checks if the bullet element is defined.
	 * @param paraIX IX atribute of Para element.
	 * @return Returns <code>true</code> if the bullet element is defined.
	 */
	public boolean hasBullet(String paraIX)
	{
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		return hasSecondaryTag(ch, mxVdxConstants.BULLET);
	}

	/**
	 * Returns the bullet element value.
	 * @param paraIX IX atribute of Para element.
	 * @return String value of the Bullet element.
	 */
	public String getBullet(String paraIX)
	{
		String bullet = "0";
		Element ch = getPrimaryTagIndexed(mxVdxConstants.PARAGRAPH, paraIX);
		if (hasSecondaryTag(ch, mxVdxConstants.BULLET))
		{
			bullet = getValueOfSecondaryTag(ch, mxVdxConstants.BULLET);
		}
		return bullet;
	}
}
