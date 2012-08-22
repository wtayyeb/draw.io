/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mxgraph.io.vdx;

import java.util.HashMap;
import java.util.List;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This class is a wrapper for a Master element.<br/>
 * Contains a map with the shapes contained in the Master element
 * and allows access these by ID.
 */
public class mxMasterElement
{
	private Element master;

	/*
	 * Map that contains the shapes in Master element wrapped for instances of mxMasterShape.
	 * The key is the shape's ID.
	 */
	private HashMap<String, mxMasterShape> masterShapes = new HashMap<String, mxMasterShape>();

	/**
	 * Create a new instace of mxMasterElement and retrieves all the shapes contained
	 * in the Master element.
	 * @param m Master Element to be wrapped.
	 */
	public mxMasterElement(Element m)
	{
		this.master = m;
		this.masterShapes = retrieveMasterShapes(masterShapes, this.master);
	}

	/**
	 * Retrieves and wraps all the shapes contained in the 'shape' param.<br/>
	 * This method is recursive, it retrieves the subshapes of the shapes too.
	 * @param masterShps Map where the shapes must be placed.
	 * @param shape Shape from wich the subshapes are retrieved.
	 * @return Map with the shapes wrapped in instances of mxMasterShape.
	 */
	private HashMap<String, mxMasterShape> retrieveMasterShapes(
			HashMap<String, mxMasterShape> masterShps, Element shape)
	{
		NodeList childrens = shape.getChildNodes();

		if (mxVdxUtils.nodeListHasTag(childrens, "Shapes"))
		{
			Element shps = mxVdxUtils.nodeListTag(childrens, "Shapes");
			NodeList shpsList = shps.getChildNodes();

			List<Element> shapeList = mxVdxUtils
					.nodeListTags(shpsList, "Shape");

			for (int i = 0; i < shapeList.size(); i++)
			{
				Element shp = shapeList.get(i);
				String shapeId = shp.getAttribute("ID");
				mxMasterShape masterShape = new mxMasterShape(shp);
				masterShps.put(shapeId, masterShape);
				masterShps = retrieveMasterShapes(masterShps, shp);
			}
		}
		return masterShps;
	}

	/**
	 * Returns the first shape in the Master
	 * @return First shape in the Master wrapped in a instance of mxMasterShape
	 */
	public mxMasterShape getMasterShape()
	{
		return getMasterShape(null);
	}

	/**
	 * Returns the shape in the master element with ID = 'id'.
	 * @param id Shape's ID
	 * @return The shape in the master element with ID = 'id' wrapped in a instance of mxMasterShape
	 */
	public mxMasterShape getMasterShape(String id)
	{
		mxMasterShape ret = masterShapes.get(id);
		if (ret == null)
		{
			ret = (mxMasterShape) masterShapes.values().toArray()[0];
		}
		return ret;
	}

	/**
	 * Returns the NameU attribute.
	 * @return Value of the NameU attribute.
	 */
	public String getNameU()
	{
		String nameU = "";
		if (master.hasAttribute("NameU"))
		{
			nameU = master.getAttribute("NameU");
		}
		return nameU;
	}
}
