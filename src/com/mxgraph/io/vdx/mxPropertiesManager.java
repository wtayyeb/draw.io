package com.mxgraph.io.vdx;

import java.util.HashMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This is a singleton class that stores various global properties to document.<br/>
 * The properties are:
 * <ul>
 * <li>
 * document's colors
 * </li>
 * <li>
 * document's fonts
 * </li>
 * <li>
 * default text style
 * </li>
 * <li>
 * default line style
 * </li>
 * <li>
 * default fill style
 * </li>
 * </ul>
 */
public class mxPropertiesManager
{
	/**
	 * Map with the document's colors.<br/>
	 * The key is the index number and the value is the hexadecimal representation of the color.
	 */
	private HashMap<String, String> colorElementMap = new HashMap<String, String>();

	/**
	 * Map with the document's fonts.<br/>
	 * The key is the ID and the value is the name of the font.
	 */
	private HashMap<String, String> fontElementMap = new HashMap<String, String>();

	/**
	 * Stylesheet with the default text style.
	 */
	private mxStyleSheet textStyle;

	/**
	 * Stylesheet with the default line style.
	 */
	private mxStyleSheet lineStyle;

	/**
	 * Stylesheet with the default fill style.
	 */
	private mxStyleSheet fillStyle;

	private static mxPropertiesManager propertiesManager = null;

	/**
	 * Singleton pattern requires private constructor.
	 */
	private mxPropertiesManager()
	{
	}

	/**
	 * Returns the instance of mxPropertiesManager.<br/>
	 * If no instance has been created until the moment, a new instance is
	 * returned.<br/>
	 * Ths method don't load the properties.
	 * @return An instance of mxPropertiesManager.
	 */
	public static mxPropertiesManager getInstance()
	{
		if (propertiesManager == null)
		{
			propertiesManager = new mxPropertiesManager();
		}
		return propertiesManager;
	}

	/**
	 * Loads the properties of the document.
	 * @param doc Document with the properties.
	 */
	public void initialise(Document doc)
	{
		//Loads the colors
		NodeList vdxColors = doc.getElementsByTagName(mxVdxConstants.COLORS);

		if (vdxColors.getLength() > 0)
		{
			Element colors = (Element) vdxColors.item(0);
			NodeList colorList = colors
					.getElementsByTagName(mxVdxConstants.COLOR_ENTRY);
			int colorLength = colorList.getLength();

			for (int i = 0; i < colorLength; i++)
			{
				Element color = (Element) colorList.item(i);
				String colorId = color.getAttribute(mxVdxConstants.INDEX);
				String colorValue = color.getAttribute(mxVdxConstants.RGB);
				colorElementMap.put(colorId, colorValue);
			}
		}

		//Loads the fonts
		NodeList vdxFonts = doc.getElementsByTagName(mxVdxConstants.FACE_NAMES);

		if (vdxFonts.getLength() > 0)
		{
			Element fonts = (Element) vdxFonts.item(0);
			NodeList fontList = fonts
					.getElementsByTagName(mxVdxConstants.FACE_NAME);
			int fontLength = fontList.getLength();

			for (int i = 0; i < fontLength; i++)
			{
				Element font = (Element) fontList.item(i);
				String fontId = font.getAttribute(mxVdxConstants.ID);
				String fontValue = font.getAttribute(mxVdxConstants.FONT_NAME);
				fontElementMap.put(fontId, fontValue);
			}
		}

		//Loads the defaults documents styles.
		NodeList vdxDocumentStyle = doc
				.getElementsByTagName(mxVdxConstants.DOCUMENT_SHEET);
		if (vdxDocumentStyle.getLength() > 0)
		{
			Element defaultStyle = (Element) vdxDocumentStyle.item(0);
			String lineId = defaultStyle
					.getAttribute(mxVdxConstants.LINE_STYLE);
			String fillId = defaultStyle
					.getAttribute(mxVdxConstants.FILL_STYLE);
			String textId = defaultStyle
					.getAttribute(mxVdxConstants.TEXT_STYLE);
			mxStyleSheetManager ssm = mxStyleSheetManager.getInstance();
			lineStyle = ssm.getSheet(lineId);
			fillStyle = ssm.getSheet(fillId);
			textStyle = ssm.getSheet(textId);
		}

	}

	/**
	 * Returns the color of index indicated in 'ix'.
	 * @param ix Index of the color.
	 * @return Hexadecimal representation of the color.
	 */
	public String getColor(String ix)
	{
		String color = colorElementMap.get(ix);
		if (color == null)
		{
			return "";
		}
		else
		{
			return color;
		}
	}

	/**
	 * Returns the font of id indicated in 'id'
	 * @param id font's ID
	 * @return Name of the font.
	 */
	public String getFont(String id)
	{
		String font = fontElementMap.get(id);
		if (font == null)
		{
			return "";
		}
		else
		{
			return font;
		}
	}

	/**
	 * Returns the default fill style.
	 * @return Stylesheet with the default fill style wrapped in an instance of mxStyleSheet.
	 */
	public mxStyleSheet getFillStyle()
	{
		return fillStyle;
	}

	/**
	 * Returns the default line style.
	 * @return Stylesheet with the default line style wrapped in an instance of mxStyleSheet.
	 */
	public mxStyleSheet getLineStyle()
	{
		return lineStyle;
	}

	/**
	 * Returns the default text style.
	 * @return Stylesheet with the default text style wrapped in an instance of mxStyleSheet.
	 */
	public mxStyleSheet getTextStyle()
	{
		return textStyle;
	}
}
