package com.mxgraph.io;

import com.mxgraph.io.vdx.PageShapeIDKey;
import com.mxgraph.io.vdx.mxMastersManager;
import com.mxgraph.io.vdx.mxPropertiesManager;
import com.mxgraph.io.vdx.mxStyleSheetManager;
import com.mxgraph.io.vdx.mxVdxConstants;
import com.mxgraph.io.vdx.mxVdxShape;
import com.mxgraph.io.vdx.mxVdxUtils;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.util.mxPoint;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxConnectionConstraint;
import com.mxgraph.view.mxGraph;
import java.util.ArrayList;
import org.w3c.dom.Node;

/**
 * Parses a .vdx XML diagram file and imports it in the given graph.<br/>
 * This class depends from the classes contained in
 * com.mxgraph.io.vdx.
 */
public class mxVdxCodec
{
	/**
	 * Stores the vertexes imported.
	 */
	private static HashMap<PageShapeIDKey, mxCell> vertexMap = new HashMap<PageShapeIDKey, mxCell>();

	/**
	 * Stores the shapes that represent Edges.
	 */
	private static HashMap<PageShapeIDKey, mxVdxShape> edgeShapeMap = new HashMap<PageShapeIDKey, mxVdxShape>();

	/**
	 * Stores the shapes that represent Vertexes.
	 */
	private static HashMap<PageShapeIDKey, mxVdxShape> vertexShapeMap = new HashMap<PageShapeIDKey, mxVdxShape>();

	/**
	 * Stores the parents of the shapes imported.
	 */
	private static HashMap<PageShapeIDKey, Object> parentsMap = new HashMap<PageShapeIDKey, Object>();

	/**
	 * Stores the page Elements that represents a background.
	 */
	private static HashMap<String, Element> backgroundsMap = new HashMap<String, Element>();

	private static HashMap<PageShapeIDKey, Object> cellsMap = new HashMap<PageShapeIDKey, Object>();

	private static ArrayList<PageShapeIDKey> shapeIDList = new ArrayList<PageShapeIDKey>();

	/**
	 * Page Height used in the importPage method.<br/>
	 * This value is accumulated to represents multiple pages.
	 */
	private static double pageHeight = 0;

	/**
	 * Height of the actual page.
	 */
	private static double actualPageHeight = 0;

	/**
	 * Number of pages imported until now.<br/>
	 * This number is used in the keys of the maps.
	 */
	private static int pageNumber = 0;

	/**
	 * Its value determines if text label must be formated with html tags or not.<br/>
	 * Don't confuse with the htmlLabels property of the graph. This property is set
	 * in true at beginning of the decode method.
	 */
	private static boolean htmlLabelsEnable = true;

	/**
	 * Checks if html labels are active.
	 * @return Returns <code>true</code> if html labels are enable.
	 */
	public static boolean isHtmlLabelsEnable()
	{
		return htmlLabelsEnable;
	}

	/**
	 * Sets html labels.
	 * @param htmlLabelsEnable New value of the property.
	 */
	public static void setHtmlLabelsEnable(boolean htmlLabelsEnable)
	{
		mxVdxCodec.htmlLabelsEnable = htmlLabelsEnable;
	}

	/**
	 * Remove all the elements from the defined maps.
	 */
	private static void cleanMaps()
	{
		vertexMap.clear();
		edgeShapeMap.clear();
		vertexShapeMap.clear();
		parentsMap.clear();
		backgroundsMap.clear();
		pageHeight = 0;
		actualPageHeight = 0;
	}

	/**
	 * Return the width and height of a Page expressed like a mxPoint.
	 * x = width
	 * y = height
	 * @param page Element that represents a page
	 * @return mxPoint that represents the dimentions of the shape
	 */
	private static mxPoint getPageDimentions(Element page)
	{
		Element pHeight = (Element) page.getElementsByTagName(
				mxVdxConstants.PAGE_HEIGHT).item(0);
		double pageH = Double.valueOf(pHeight.getTextContent())
				* mxVdxUtils.conversionFactor();
		Element pageWidth = (Element) page.getElementsByTagName(
				mxVdxConstants.PAGE_WIDTH).item(0);
		double pageW = Double.valueOf(pageWidth.getTextContent())
				* mxVdxUtils.conversionFactor();
		return new mxPoint(pageW, pageH);
	}

	/**
	 * Calculate the absolute coordinates of a cell's point.
	 * @param cellParent Cell that contains the point.
	 * @param graph Graph where the parsed graph is included.
	 * @param point Point to wich coordinates are calculated.
	 * @return The point in absolute coordinates.
	 */
	private static mxPoint calculateAbsolutePoint(mxCell cellParent,
			mxGraph graph, mxPoint point)
	{
		if (cellParent != null)
		{
			mxCellState state = graph.getView().getState(cellParent);
			if (state != null)
			{
				point.setX(point.getX() + state.getX());
				point.setY(point.getY() + state.getY());
			}
		}
		return point;
	}

	/**
	 * Adds a vertex to the graph if 'shape' is a vertex or add the shape to edgeShapeMap if is a edge.
	 * This method doesn't import the subshapes of 'shape'.
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the shape to be imported.
	 * @param shp Shape to be imported.
	 * @param parentHeight Height of the parent cell.
	 * @return the new vertex added. null if 'shape' is not a vertex.
	 */
	private static mxCell addShape(mxGraph graph, Object parent, Element shp,
			double parentHeight)
	{
		//Create a wrapper for shape Element.
		mxVdxShape shape = new mxVdxShape(shp);

		//If is a Shape or a Group add the vertex to the graph.
		if (shp.getAttribute(mxVdxConstants.TYPE).equals(
				mxVdxConstants.TYPE_SHAPE)
				|| shp.getAttribute(mxVdxConstants.TYPE).equals(
						mxVdxConstants.TYPE_GROUP))
		{
			String id = shape.getId();
			shapeIDList.add(new PageShapeIDKey(pageNumber, id));
			//If is a vertex shape
			if (shape.isVertexShape())
			{

				mxCell v1 = null;
				if (shape.isComplexShape())
				{
					v1 = shape.addComplexShapeToGraph(graph, parent,
							parentHeight);
				}
				else
				{

					v1 = shape.addSimpleShapeToGraph(graph, parent,
							parentHeight);
				}
				vertexMap.put(new PageShapeIDKey(pageNumber, id), v1);
				vertexShapeMap.put(new PageShapeIDKey(pageNumber, id), shape);
				cellsMap.put(new PageShapeIDKey(pageNumber, id), v1);
				return v1;

			}
			else
			{
				edgeShapeMap.put(new PageShapeIDKey(pageNumber, id), shape);
			}
		}
		return null;
	}

	/**
	 * Adds a conected edge to the graph.<br/>
	 * These edge are the referenced in one Connect element at least.<br/>
	 * The edge shape imported is taken from edgeShapeMap and is removed from it.
	 * @param graph graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the edge to be imported.
	 * @param connect Connect Element that references an edge shape and the source vertex.
	 * @param sigConnect Connect Element that references the same edge shape that 'connect'
	 * and the target vertex. This parameter may to be null.
	 * @return The new edge. null if not edge is added.
	 */
	private static Object addConectedEdge(mxGraph graph, Element connect,
			Element sigConnect)
	{
		mxCell edge = null;

		//Retrieve edge Shape and Parent
		String shapeConnect = connect.getAttribute(mxVdxConstants.FROM_SHEET);

		mxVdxShape edgeShape = edgeShapeMap.get(new PageShapeIDKey(pageNumber,
				shapeConnect));
		edgeShapeMap.remove(new PageShapeIDKey(pageNumber, shapeConnect));

		if (edgeShape != null)
		{
			Object parent = parentsMap.get(new PageShapeIDKey(pageNumber,
					edgeShape.getId()));

			//Get Parent Height
			double parentHeight = pageHeight;

			mxCell parentCell = (mxCell) parent;

			if (parentCell != null)
			{
				mxGeometry parentGeometry = parentCell.getGeometry();

				if (parentGeometry != null)
				{
					parentHeight = parentGeometry.getHeight();
					parentHeight += pageHeight - actualPageHeight;
				}
			}

			//Get beginXY and endXY coordinates.
			mxPoint beginXY = edgeShape.getBeginXY(parentHeight);
			beginXY = calculateAbsolutePoint((mxCell) parent, graph, beginXY);

			mxPoint endXY = edgeShape.getEndXY(parentHeight);
			endXY = calculateAbsolutePoint((mxCell) parent, graph, endXY);

			//Declare variables.
			mxCell source = null;
			mxCell target = null;
			mxPoint fromConstraint = null;
			mxPoint toConstraint = null;

			//Defines text label
			String textLabel = edgeShape.getTextLabel();

			String from = connect.getAttribute(mxVdxConstants.TO_SHEET);
			mxVdxShape fromShape = vertexShapeMap.get(new PageShapeIDKey(
					pageNumber, from));

			//If the source is not defined.
			if (connect.getAttribute(mxVdxConstants.FROM_CELL).equals(
					mxVdxConstants.END_X)
					|| fromShape == null)
			{
				//Only one side connected.
				source = (mxCell) graph.insertVertex(parent, null, null,
						beginXY.getX(), beginXY.getY(), 0, 0);
				fromConstraint = new mxPoint(0, 0);

				sigConnect = connect;
			}
			else
			{
				//Define Source vertex of the edge.
				source = vertexMap.get(new PageShapeIDKey(pageNumber, from));

				//Get dimentions of vertex
				mxPoint dimentionFrom = fromShape.getDimentions();

				//Get From shape origin and begin/end of edge in absolutes values.
				double height = pageHeight;

				if ((source.getParent() != null)
						&& (source.getParent().getGeometry() != null))
				{
					height = source.getParent().getGeometry().getHeight();
					height += pageHeight - actualPageHeight;
				}

				mxPoint originFrom = fromShape.getOriginPoint(height);
				mxPoint absOriginFrom = calculateAbsolutePoint(
						(mxCell) source.getParent(), graph, originFrom);

				//Determines From Constraints (Connection point) of the edge.
				fromConstraint = new mxPoint(
						(beginXY.getX() - absOriginFrom.getX())
								/ dimentionFrom.getX(),
						(beginXY.getY() - absOriginFrom.getY())
								/ dimentionFrom.getY());

			}

			//If is connected in both sides.
			if (sigConnect != null)
			{
				String to = sigConnect.getAttribute(mxVdxConstants.TO_SHEET);
				mxVdxShape toShape = vertexShapeMap.get(new PageShapeIDKey(
						pageNumber, to));

				if (toShape != null)
				{

					target = vertexMap.get(new PageShapeIDKey(pageNumber, to));

					mxPoint dimentionTo = toShape.getDimentions();

					//Get To shape origin.
					double height = pageHeight;

					if ((target.getParent() != null)
							&& (target.getParent().getGeometry() != null))
					{
						height = target.getParent().getGeometry().getHeight();
						height += pageHeight - actualPageHeight;
					}
					mxPoint originTo = toShape.getOriginPoint(height);

					mxPoint absOriginTo = calculateAbsolutePoint(
							(mxCell) target.getParent(), graph, originTo);

					//Determines To Constraints (Connection point) of the edge.
					toConstraint = new mxPoint(
							(endXY.getX() - absOriginTo.getX())
									/ dimentionTo.getX(),
							(endXY.getY() - absOriginTo.getY())
									/ dimentionTo.getY());

				}
				else
				{

					//Only one side connected.
					target = (mxCell) graph.insertVertex(parent, null, null,
							endXY.getX(), endXY.getY(), 0, 0);
					toConstraint = new mxPoint(0, 0);
				}
			}
			else
			{
				//Only one side connected.
				target = (mxCell) graph.insertVertex(parent, null, null,
						endXY.getX(), endXY.getY(), 0, 0);
				toConstraint = new mxPoint(0, 0);
			}

			//Adjust the constraints.
			fromConstraint = mxVdxUtils.adjustConstraint(fromConstraint);
			toConstraint = mxVdxUtils.adjustConstraint(toConstraint);

			//Defines the style of the edge.
			String style = edgeShape.getStyleFromEdgeShape(parentHeight);

			//Insert new edge and set constraints.
			edge = (mxCell) graph.insertEdge(parent, null, textLabel, source,
					target, style);
			graph.setConnectionConstraint(edge, source, true,
					new mxConnectionConstraint(fromConstraint, false));
			graph.setConnectionConstraint(edge, target, false,
					new mxConnectionConstraint(toConstraint, false));

			//Gets and sets routing points of the edge.
			mxGeometry edgeGeometry = edge.getGeometry();
			List<mxPoint> pointList = edgeShape.getRoutingPoints(parentHeight);
			edgeGeometry.setPoints(pointList);

			//Put cell in the map.
			cellsMap.put(new PageShapeIDKey(pageNumber, shapeConnect), edge);

		}
		return edge;
	}

	/**
	 * Adds a new edge not conected to any vertex to the graph.
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the edge to be imported.
	 * @param edgeShape Shape Element that represents an edge.
	 * @return The new edge added.
	 */
	private static Object addNotConnectedEdge(mxGraph graph, Object parent,
			mxVdxShape edgeShape)
	{
		mxCell edge = null;

		//Defines the label of the edge.
		String textLabel = edgeShape.getTextLabel();

		//Get begin and end of edge.
		double height = pageHeight;
		mxCell parentCell = (mxCell) parent;

		if (parentCell != null)
		{
			mxGeometry parentGeometry = parentCell.getGeometry();

			if (parentGeometry != null)
			{
				height = parentGeometry.getHeight();
			}
		}

		mxPoint beginXY = edgeShape.getBeginXY(height);
		mxPoint endXY = edgeShape.getEndXY(height);

		//Create the source and target cell of the edge.
		mxCell target = (mxCell) graph.insertVertex(parent, null, null,
				endXY.getX(), endXY.getY(), 0, 0);

		mxCell source = (mxCell) graph.insertVertex(parent, null, null,
				beginXY.getX(), beginXY.getY(), 0, 0);

		//Define style of the edge
		String style = edgeShape.getStyleFromEdgeShape(height);

		//Determines Constraints (Connection points) of the edge.
		mxPoint fromConstraint = new mxPoint(0, 0);
		mxPoint toConstraint = new mxPoint(0, 0);

		//Insert new edge and set constraints.
		edge = (mxCell) graph.insertEdge(source.getParent(), null, textLabel,
				source, target, style);
		graph.setConnectionConstraint(edge, source, true,
				new mxConnectionConstraint(fromConstraint, false));
		graph.setConnectionConstraint(edge, target, false,
				new mxConnectionConstraint(toConstraint, false));

		//Gets and sets routing points of the edge.
		mxGeometry edgeGeometry = edge.getGeometry();
		List<mxPoint> pointList = edgeShape.getRoutingPoints(height);
		edgeGeometry.setPoints(pointList);

		cellsMap.put(new PageShapeIDKey(pageNumber, edgeShape.getId()), edge);

		return edge;
	}

	/**
	 * Finds the connect element that corresponds with the connect param.
	 * @param connectList List that contains the connect elements
	 * @param connect Connect Element that references an edge shape.
	 * @param index Index where starts the search.
	 * @return The connect element that corresponds with the connect param. It is,
	 * both references to the same edge shape.
	 */
	private static Element findSigConnect(List<Node> connectList,
			Element connect, int index)
	{
		int length = connectList.size();
		String shapeConn1 = connect.getAttribute(mxVdxConstants.FROM_SHEET);
		Element sigConnect = null;
		boolean end = false;

		for (int i = index + 1; (i < length) && (!end); i++)
		{
			sigConnect = (Element) connectList.get(i);
			String shapeConn2 = sigConnect
					.getAttribute(mxVdxConstants.FROM_SHEET);

			if (shapeConn1.equals(shapeConn2))
			{
				end = true;
			}
			else
			{
				sigConnect = null;
			}
		}
		return sigConnect;
	}

	/**
	 * Adds to the graph all the subshapes included in a shape and recursively.
	 * @param shape Shape element from wich its subshapes will be imported.
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the subShapes to be imported.
	 */
	private static void decodeShape(Element shape, mxGraph graph, Object parent)
	{

		mxVdxShape shp = new mxVdxShape(shape);

		//If a shape is complex(formed by several shapes) its subshapes are not considered.
		//its subshapes have been considered already.
		if (!shp.isComplexShape())
		{
			NodeList childs = shape.getChildNodes();

			if (mxVdxUtils.nodeListHasTag(childs, mxVdxConstants.SHAPES))
			{
				Element shapes = mxVdxUtils.nodeListTag(childs,
						mxVdxConstants.SHAPES);
				NodeList shapeList = shapes.getChildNodes();

				List<Element> shpList = mxVdxUtils.nodeListTags(shapeList,
						mxVdxConstants.SHAPE);

				int shapeLength = shpList.size();

				//Get the masterShapes of shape
				double parentHeight = shp.getDimentions().getY();

				//Process the sub-shapes
				for (int j = 0; j < shapeLength; j++)
				{
					Element shapeInside = shpList.get(j);
					//Get the master of the sub-shape
					String Id = shapeInside.getAttribute(mxVdxConstants.ID);
					parentsMap.put(new PageShapeIDKey(pageNumber, Id), parent);
					Object vertex = addShape(graph, parent, shapeInside,
							parentHeight);

					if (vertex != null)
					{
						decodeShape(shapeInside, graph, vertex);
					}
				}
			}
		}
	}

	/**
	 * Imports a page of the document with the actual pageHeight.<br/>
	 * In .vdx, the Y-coordinate grows upward from the bottom of the page.<br/>
	 * The page height is used for calculate the correct position in JGraph using
	 * this formula: JGraph_Y_Coord = PageHeight - VDX_Y_Coord.
	 * @param page Actual page Element to be imported
	 * @param graph Graph where the parsed graph is included.
	 * @param parent The parent of the elements to be imported. This should be the default parent.
	 */
	private static void importPage(Element page, mxGraph graph, Object parent)
	{

		NodeList shapesList = page.getElementsByTagName(mxVdxConstants.SHAPES);

		//Updates the page number.
		pageNumber++;

		if (shapesList.getLength() > 0)
		{
			Element shapes = (Element) shapesList.item(0);
			NodeList shapeList = shapes.getChildNodes();

			List<Element> shpList = mxVdxUtils.nodeListTags(shapeList,
					mxVdxConstants.SHAPE);

			int shapeLength = shpList.size();

			for (int j = 0; j < shapeLength; j++)
			{
				Element shape = shpList.get(j);

				Object vertex = addShape(graph, parent, shape, pageHeight);
				//decodeShape(shape, graph, vertex);
			}
			//Process the Connects and add edges.
			NodeList connectsList = page
					.getElementsByTagName(mxVdxConstants.CONNECTS);

			if (connectsList.getLength() > 0)
			{
				Element connects = (Element) connectsList.item(0);
				NodeList connectList = connects
						.getElementsByTagName(mxVdxConstants.CONNECT);
				List<Node> list = mxVdxUtils.copyNodeList(connectList);

				for (int j = 0; j < list.size(); j++)
				{
					Element connect = (Element) list.get(j);
					Element sigConnect = findSigConnect(list, connect, j);
					list.remove(sigConnect);
					addConectedEdge(graph, connect, sigConnect);
				}
			}

			//Process not conected edges.
			Iterator<mxVdxShape> it = edgeShapeMap.values().iterator();

			while (it.hasNext())
			{
				mxVdxShape edgeShape = it.next();
				addNotConnectedEdge(graph, parentsMap.get(new PageShapeIDKey(
						pageNumber, edgeShape.getId())), edgeShape);

			}
		}
	}

	/**
	 * Recieves a xml document and parses it generating a new graph that is inserted in graph.
	 * @param document XML to be parsed
	 * @param graph Graph where the parsed graph is included.
	 */
	public static void decode(Document document, mxGraph graph)
	{

		Object parent = graph.getDefaultParent();

		graph.getModel().beginUpdate();
		graph.setHtmlLabels(true);
		Document doc = document;

		//Inicialize the Style Sheet Manager
		mxStyleSheetManager.getInstance().initialise(doc);

		//Inicialize the Master Manager
		mxMastersManager.getInstance().initialise(doc);

		//Inicialize the Properties Manager
		mxPropertiesManager.getInstance().initialise(doc);

		//Imports each page of the document.
		NodeList vdxPages = doc.getElementsByTagName(mxVdxConstants.PAGES);

		if (vdxPages.getLength() > 0)
		{
			Element pages = (Element) vdxPages.item(0);
			NodeList pageList = pages.getElementsByTagName(mxVdxConstants.PAGE);

			if (pageList.getLength() > 0)
			{
				//Retrieves the backgrounds pages
				for (int p = 0; p < pageList.getLength(); p++)
				{
					Element page = (Element) pageList.item(p);
					String back = page.getAttribute(mxVdxConstants.BACKGROUND);
					if ((back != null && back.equals(mxVdxConstants.TRUE)))
					{
						String id = page.getAttribute(mxVdxConstants.ID);
						backgroundsMap.put(id, page);
					}
				}
				//Import the pages that are not background.
				//If a page references a background page, the background is imported previously
				//to the actual page.
				for (int p = 0; p < pageList.getLength(); p++)
				{
					Element page = (Element) pageList.item(p);
					String back = page.getAttribute(mxVdxConstants.BACKGROUND);

					if (!(back != null && back.equals(mxVdxConstants.TRUE)))
					{
						actualPageHeight = getPageDimentions(page).getY();
						pageHeight += actualPageHeight;
						String backId = page
								.getAttribute(mxVdxConstants.BACK_PAGE);
						if (backId != null && !backId.equals(""))
						{
							//Import the background.
							Element background = backgroundsMap.get(backId);
							importPage(background, graph, parent);
						}
						//Import the actual page.
						importPage(page, graph, parent);
					}
				}
			}
		}
		Object[] order = mxVdxUtils.getOrderArray(shapeIDList, cellsMap);
		graph.orderCells(false, order);
		graph.getModel().endUpdate();
		cleanMaps();

	}
}
