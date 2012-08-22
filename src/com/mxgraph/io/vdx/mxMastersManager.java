package com.mxgraph.io.vdx;

import java.util.HashMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This is a singleton class that contains a map with the master elements of the
 * document. The master elements are wrapped in instances of mxMasterElement and
 * may to be access by ID.
 */
public class mxMastersManager
{
	/**
	 * Map with the master elements of the document.<br/>
	 * The key is the master's ID.
	 */
	private HashMap<String, mxMasterElement> masterElementsMap = new HashMap<String, mxMasterElement>();

	private static mxMastersManager masterManager = null;

	/**
	 * Singleton pattern requires private constructor.
	 */
	private mxMastersManager()
	{
	}

	/**
	 * Returns the instance of mxMasterManager.
	 * If no instance has been created until the moment, a new instance is
	 * returned.
	 * This method don't load the map.
	 * @return An instance of mxMasterManager.
	 */
	public static mxMastersManager getInstance()
	{
		if (masterManager == null)
		{
			masterManager = new mxMastersManager();
		}
		return masterManager;
	}

	/**
	 * Load the map with the master elements in the document.<br/>
	 * The masters are wrapped for instances of mxMasterElement.
	 * @param doc Document with the masters.
	 */
	public void initialise(Document doc)
	{
		NodeList vdxMasters = doc.getElementsByTagName(mxVdxConstants.MASTERS);

		if (vdxMasters.getLength() > 0)
		{
			Element masters = (Element) vdxMasters.item(0);
			NodeList masterList = masters
					.getElementsByTagName(mxVdxConstants.MASTER);
			int masterLength = masterList.getLength();

			for (int i = 0; i < masterLength; i++)
			{
				Element master = (Element) masterList.item(i);
				String masterId = master.getAttribute(mxVdxConstants.ID);
				mxMasterElement masterElement = new mxMasterElement(master);
				masterElementsMap.put(masterId, masterElement);
			}
		}
	}

	/**
	 * Returns the mxMasterElement's HashMap
	 * @return Map of master elements.
	 */
	public HashMap<String, mxMasterElement> getMasterElementsMap()
	{
		return masterElementsMap;
	}

	/**
	 * Returns the wrapper of the master element with id = 'id'
	 * @param id Master element's ID.
	 * @return Master element with id = 'id' wrapped in a instance of mxMasterElement
	 */
	public mxMasterElement getMaster(String id)
	{
		return masterElementsMap.get(id);
	}
}
