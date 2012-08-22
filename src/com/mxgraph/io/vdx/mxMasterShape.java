package com.mxgraph.io.vdx;

import com.mxgraph.util.mxPoint;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This class is a wrapper for a shape element contained in a Master element.<br/>
 * If a property is not found in the shape Element but it may be found in a stylesheet
 * the property is searched in such stylesheet.
 */
public class mxMasterShape extends mxDelegateShape
{
	public mxMasterShape(Element s)
	{
		super(s);
	}

	/**
	 * Returns the points of a vertex shape.
	 * @param parentHeight Height of the parent cell of the vertex.
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
	 * Return the co-ordinates of the top left corner of the Shape.
	 * @param parentHeight Height of the parent cell of the vertex.
	 * @return mxPoint that represents the co-ordinates.
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

		//Defines PinY
		if (this.hasPinY())
		{
			py = this.getPinY();
		}

		//Defines LocPinX
		if (this.hasLocPinX())
		{
			lpx = this.getLocPinX();
		}

		//Defines LocPinY
		if (this.hasLocPinY())
		{
			lpy = this.getLocPinY();
		}

		//Defines Height
		if (this.hasHeight())
		{
			h = this.getHeight();
		}

		double x = (px) - (lpx);
		double y = parentHeight - ((py) + (h - lpy));
		return new mxPoint(x, y);
	}

	/**
	 * Return the width and height of the Shape expressed like a mxPoint.
	 * x = width
	 * y = height
	 * @return mxPoint that represents the dimentions of the shape
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

		//Defines Height
		if (this.hasHeight())
		{
			w = this.getHeight();
		}
		return new mxPoint(w, h);
	}
}
