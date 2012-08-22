package com.mxgraph.io.vdx;

import java.util.HashMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This is a singleton class that contains a map with the stylesheets elements of the
 * document. The stylesheets elements are wrapped in instances of mxStyleSheet and
 * may to be access by ID.
 */
public class mxStyleSheetManager
{
	/**
	 * Map with the stylesheets of the document.<br/>
	 * The key is the stylesheet's ID.
	 */
	private HashMap<String, mxStyleSheet> styleSheetMap = new HashMap<String, mxStyleSheet>();

	private static mxStyleSheetManager styleSheetManager = null;

	/**
	 * Singleton pattern requires private constructor.
	 */
	private mxStyleSheetManager()
	{
	}

	/**
	 * Returns the instance of mxStyleSheetManager.<br/>
	 * If no instance has been created until the moment, a new instance is
	 * returned.<br/>
	 * This method don't load the map.
	 * @return An instance of mxStyleSheetManager.
	 */
	public static mxStyleSheetManager getInstance()
	{
		if (styleSheetManager == null)
		{
			styleSheetManager = new mxStyleSheetManager();
		}
		return styleSheetManager;
	}

	/**
	 * Load the map with the stylesheets elements in the document.<br/>
	 * The masters are wrapped for instances of mxStyleSheet.
	 * @param doc Document with the stylesheets.
	 */
	public void initialise(Document doc)
	{
		NodeList vdxSheets = doc
				.getElementsByTagName(mxVdxConstants.STYLE_SHEETS);

		if (vdxSheets.getLength() > 0)
		{
			Element sheets = (Element) vdxSheets.item(0);
			NodeList sheetList = sheets
					.getElementsByTagName(mxVdxConstants.STYLE_SHEET);
			int sheetLength = sheetList.getLength();

			for (int i = 0; i < sheetLength; i++)
			{
				Element sheet = (Element) sheetList.item(i);
				String sheetId = sheet.getAttribute(mxVdxConstants.ID);
				mxStyleSheet sheetElement = new mxStyleSheet(sheet);
				styleSheetMap.put(sheetId, sheetElement);
			}
		}
	}

	/**
	 * Returns the mxStyleSheet HashMap
	 * @return Map of stylesheet elements
	 */
	public HashMap<String, mxStyleSheet> getStyleSheetsMap()
	{
		return styleSheetMap;
	}

	/**
	 * Returns the wrapper of the stylesheet element with id indicated by 'id'
	 * @param id StyleSheet's ID.
	 * @return StyleSheet element with id = 'id' wrapped in a instance of mxStyleSheet.
	 */
	public mxStyleSheet getSheet(String id)
	{
		return styleSheetMap.get(id);
	}
}
