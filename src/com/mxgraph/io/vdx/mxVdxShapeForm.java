package com.mxgraph.io.vdx;

import java.util.HashMap;
import java.util.logging.Logger;

import com.mxgraph.online.ShapeConstants;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;

/**
 * This class determines the form of a shape to be applied in the
 * property style-shape.
 */
public class mxVdxShapeForm
{
	/**
	 * Shape wrapped, to which the shape will be determinate.
	 */
	mxVdxShape shape;

	/**
	 * Master shape of the shape.
	 */
	mxMasterShape masterShape;

	/**
	 * Master element of the shape.
	 */
	mxMasterElement masterElement;

	/**
	 * Height of the parent cell of the shape.
	 */
	double parentHeight;
	
	private final static Logger LOGGER = Logger.getLogger(mxVdxShapeForm.class.getName());

	public static HashMap<String, String> shapeMappings;

	static
	{
		shapeMappings = new HashMap<String, String>();
		shapeMappings.put("Square",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Rectangle",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Process",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("External interactor",							mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("External entity 1",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Check 2",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Information/ Material",							mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Inspection/ measurement",						mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Metric",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Inspection",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Check 2 (audit)",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Compare 2",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Single line frame",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Reference rectangle",							mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Box",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Square stone",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Driveway",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Rectangular pool",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Lap pool",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Competition pool",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Equipment",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("PBX",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Radiator",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Rect. table",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Night stand",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Table",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Desk",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Slab",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Square label",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Page element",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Small site map node",							mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Object In State",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Process",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Function / subroutine",							mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Interface",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Byte or variable",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Actor reference",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Open/closed bar",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Command button",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Generating station",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Classifier Role",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Function w / invocation",						mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Bookshelf",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Boundary",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("PBX",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Masonry postpillar",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Text box (single-line)",							mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Callout 3",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Insert",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Backing/ spacer",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Thermostat",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Water meter",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Controller",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Mezzanine floor",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		
		shapeMappings.put("Circle",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Ellipse",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("On-page reference",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Process (circle)",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("XOR",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("OR",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("AND",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Enterprise area",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Operation",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("System support",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Connector (TQM)",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Fabrication",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("On-page reference",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Reference oval",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Colored shapes",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Circle, ellipse",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Label",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Circular table",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Round table",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Circle label",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Initial State",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Use Case",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Fabrication",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Water heater",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Racetrack table",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Substation",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Callout 2",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Spot",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);

		shapeMappings.put("Rounded square",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Rounded rectangle",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Rounded process",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Function",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Main process",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Component",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Issue",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Corner table",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Main object",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Web page",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Pop-up",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("State context",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
																				+ mxConstants.STYLE_ROUNDED + "=1");

		shapeMappings.put("Triangle",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Alternative",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Extract",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Merge",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Inbound goods",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Storage",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Move",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Store",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Manual file",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Reference triangle",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);
		shapeMappings.put("Correcting element",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE);

		shapeMappings.put("Hexagon",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
		shapeMappings.put("Decision 1",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
		shapeMappings.put("Event",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
		shapeMappings.put("Data transmission",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
		shapeMappings.put("Reference hexagon",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
		shapeMappings.put("Hex stone",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
		shapeMappings.put("6-phase hexagonal",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);

		shapeMappings.put("Object",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_CLOUD);
		shapeMappings.put("Circle callout",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_CLOUD);
		shapeMappings.put("Cloud",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_CLOUD);
		
		shapeMappings.put("Firewall",										"image;image=img/lib/clip_art/networking/Firewall_02_128x128.png");
		shapeMappings.put("Modem",											"image;image=img/lib/clip_art/networking/Modem_128x128.png");
		shapeMappings.put("Server",											"image;image=img/lib/clip_art/computers/Server_Tower_128x128.png");
		shapeMappings.put("Terminal",										"image;image=img/lib/clip_art/computers/Monitor_128x128.png");
		shapeMappings.put("PC",												"image;image=img/lib/clip_art/computers/Monitor_Tower_128x128.png");
		
		shapeMappings.put("Decision",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Entity relationship",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Decision 2",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Check",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Decision 1 (TQM)",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Decision 2 (TQM)",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Check 1 (audit)",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Diamond",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);

		shapeMappings.put("And gate",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.and");
		shapeMappings.put("AND gate",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.and");
		shapeMappings.put("Logic gate 2",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.and");

		// Mate did it from here on
		
		shapeMappings.put("Vertical holder",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_SWIMLANE);
		shapeMappings.put("Functional band",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_SWIMLANE);

		shapeMappings.put("Multiple process",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_DOUBLE_ELLIPSE);
		shapeMappings.put("Final State",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_DOUBLE_ELLIPSE);

		shapeMappings.put("Drum type",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_CYLINDER);
		shapeMappings.put("Datastore",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_CYLINDER);
		shapeMappings.put("Direct data",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_CYLINDER);

		shapeMappings.put("Or gate",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.or");
		shapeMappings.put("OR gate",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.or");

		shapeMappings.put("XOR (Exclusive Or)",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.xor");
		
		shapeMappings.put("Concentrating",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.abstract.mux-demux");
		shapeMappings.put("Signal generator",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.instruments.signal_generator");
		shapeMappings.put("Manual operation",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.trapezoid;direction=west");
		
		shapeMappings.put("Inverter",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.electrical.logic_gates.inverter");
		
		// once finished, delete the puts before this comment
		
		// General - Basic Shapes
		shapeMappings.put("Rectangle",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Square",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Circle",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Ellipse",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Rounded Rectangle",								mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("Triangle",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE + ";direction=north");
		shapeMappings.put("45 degree single",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_left");
		shapeMappings.put("45 degree double",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.two_way_arrow_horizontal");
		shapeMappings.put("Pentagon",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.pentagon");
		shapeMappings.put("Hexagon",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
//		shapeMappings.put("Heptagon",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Octagon",											mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Star 5",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.star");
		shapeMappings.put("Star 6",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.6_point_star");
//		shapeMappings.put("Star 7",												mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Center drag circle",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Right triangle",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.orthogonal_triangle");
		shapeMappings.put("Cross",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.cross");
		shapeMappings.put("Shadowed box",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";shadow=1");
		shapeMappings.put("3-D box",											mxConstants.STYLE_SHAPE + "=" + ShapeConstants.SHAPE_CUBE);
		shapeMappings.put("Rounded Square",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
				+ mxConstants.STYLE_ROUNDED + "=1");
		shapeMappings.put("60 degree single",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow");
		shapeMappings.put("Fancy arrow",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.sharp_edged_arrow");
		shapeMappings.put("60 degree double",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_two_way_arrow");
		shapeMappings.put("45 degree tail",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_wide_tailed_arrow");
		shapeMappings.put("60 degree tail",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_wide_tailed_arrow");
		shapeMappings.put("Flexi-arrow 1",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.stylised_notched_arrow;direction=west");
		shapeMappings.put("Flexi-arrow 2",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.left_sharp_edged_head_arrow");
		shapeMappings.put("Flexi-arrow 3",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_wide_tailed_arrow");
		shapeMappings.put("Double flexi-arrow",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_two_way_arrow");

		// General - Blocks
		shapeMappings.put("Box",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Diamond",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Arrow box",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.callout_up_arrow;direction=west");
		shapeMappings.put("1-D single",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_right");
		shapeMappings.put("1-D double",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_two_way_arrow");
		shapeMappings.put("2-D single",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_right");
		shapeMappings.put("2-D double",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_two_way_arrow");
//		shapeMappings.put("Curved arrow",										mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("1-D single, open",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_right");
		shapeMappings.put("2-D single, open",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_right");
		shapeMappings.put("Open/closed bar",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
//		shapeMappings.put("Button",												mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Concentric layer 1",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Concentric layer 2",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Concentric layer 3",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Concentric center",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
//		shapeMappings.put("Partial layer 1",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Partial layer 2",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Partial layer 3",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Partial layer 4",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Double tree square",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Double tree sloped",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Multi-tree square",									mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Multi-tree sloped",									mxConstants.STYLE_SHAPE + "=;");

		// General - Blocks raised
		shapeMappings.put("Square block",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";shadow=1");
		shapeMappings.put("Horizontal bar",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";shadow=1");
		shapeMappings.put("Vertical bar",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";shadow=1");
		shapeMappings.put("Left arrow",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;shadow=1");
		shapeMappings.put("Right arrow",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;direction=west;shadow=1");
		shapeMappings.put("Up arrow",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;direction=south;shadow=1");
		shapeMappings.put("Down arrow",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;direction=north;shadow=1");
		shapeMappings.put("Left / right arrow",									mxConstants.STYLE_SHAPE + "=" + "shape=mxgraph.arrows.slender_two_way_arrow;shadow=1");
		shapeMappings.put("Up / down arrow",									mxConstants.STYLE_SHAPE + "=" + "shape=mxgraph.arrows.slender_two_way_arrow;direction=north;shadow=1");
		shapeMappings.put("Up arrow, open",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;direction=south;shadow=1");
		shapeMappings.put("Down arrow, open",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;direction=north;shadow=1");
		shapeMappings.put("Left arrow, open",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;shadow=1");
		shapeMappings.put("Right arrow, open",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.slender_left_arrow;direction=west;shadow=1");
//		shapeMappings.put("Elbow 1",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Elbow 2",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Elbow 3",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Elbow 4",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Frame",												mxConstants.STYLE_SHAPE + "=;");
		
		// General - Blocks with perspective
		shapeMappings.put("Hole",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Shallow block",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("1-D Up / down arrow",								mxConstants.STYLE_SHAPE + "=" + "shape=mxgraph.arrows.slender_two_way_arrow;direction=north");
		shapeMappings.put("1-D Left / right arrow",								mxConstants.STYLE_SHAPE + "=" + "shape=mxgraph.arrows.slender_two_way_arrow");
		shapeMappings.put("Wireframe block 1",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Wireframe block 2",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		
		// Business - Brainstorming - Brainstorming shapes
		shapeMappings.put("Main topic",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		
		// Business - Brainstorming - Legend shapes
		shapeMappings.put("To do",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.form_elements.checkbox_off");
		shapeMappings.put("Done",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.form_elements.checkbox_on");
//		shapeMappings.put("Idea",												mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Needs follow up",									mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Important",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.misc.warning_icon");
		shapeMappings.put("Question",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.misc.help_icon");
		shapeMappings.put("High importance",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_up");
		shapeMappings.put("Low importance",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_down");
//		shapeMappings.put("Legend",												mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Good",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.smiley");
//		shapeMappings.put("Bad",												mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Priority 1",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Priority 2",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Priority 3",											mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Delete",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.x");
		shapeMappings.put("Do not do",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.x");
		shapeMappings.put("Meeting",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.calendars.calendar_1");
		shapeMappings.put("Information",										mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.misc.information_icon");
		shapeMappings.put("Star",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.star");
//		shapeMappings.put("Task",												mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Attention",											mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Time",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.bpmn.timer_start");
		shapeMappings.put("Warning",											mxConstants.STYLE_SHAPE + "=" + "mxgraph.mockup.misc.warning_icon");
//		shapeMappings.put("Note",												mxConstants.STYLE_SHAPE + "=;");
		
		// Business - Business process - Audit Diagram Shapes
		shapeMappings.put("Tagged process",										mxConstants.STYLE_SHAPE + "=" + ShapeConstants.SHAPE_NOTE);
		shapeMappings.put("Decision",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
//		shapeMappings.put("Tagged document",									mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("I/O",												mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.parallelepiped");
		shapeMappings.put("Manual operation",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.basic.trapezoid;direction=west");
//		shapeMappings.put("Terminator",											mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Manual file",										mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_TRIANGLE + ";direction=south");
//		shapeMappings.put("Display",											mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("On-page reference",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_ELLIPSE);
		shapeMappings.put("Off-page reference",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.signal-in_arrow;direction=south");
		shapeMappings.put("Divided process",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_SWIMLANE);
//		shapeMappings.put("Multi proc/doc",										mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Lined/Shaded process",								mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Lined document",										mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Multi document",										mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Database",											"image;image=img/lib/clip_art/computers/Database_128x128.png");
		shapeMappings.put("Disk storage",										"image;image=img/lib/clip_art/computers/Harddrive_128x128.png");
//		shapeMappings.put("Diskette 1",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Diskette 2",											mxConstants.STYLE_SHAPE + "=;");
//		shapeMappings.put("Magnetic tape",										mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Data transmission",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_HEXAGON);
//		shapeMappings.put("Manual input",										mxConstants.STYLE_SHAPE + "=;");
		shapeMappings.put("Check 1 (audit)",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Check 2 (audit)",									mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Compare 1",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RHOMBUS);
		shapeMappings.put("Reference point",									mxConstants.STYLE_SHAPE + "=" + "mxgraph.arrows.arrow_right");
		shapeMappings.put("Compare 2",											mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE);
		shapeMappings.put("Event",												mxConstants.STYLE_SHAPE + "=" + mxConstants.SHAPE_RECTANGLE + ";"
				+ mxConstants.STYLE_ROUNDED + "=1");
//		shapeMappings.put("Manual input",										mxConstants.STYLE_SHAPE + "=;");
		
	}
	
	/**
	 * Create a new instance of mxVdxShapeForm.
	 * @param shape Shape wrapped, to which the shape will be determinate.
	 * @param masterShape Master shape of the shape.
	 * @param masterElement Master element of the shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 */
	public mxVdxShapeForm(mxVdxShape shape, mxMasterShape masterShape,
			mxMasterElement masterElement, double parentHeight)
	{
		this.shape = shape;
		this.masterShape = masterShape;
		this.masterElement = masterElement;
		this.parentHeight = parentHeight;

	}

	/**
	 * Returns the constant that represents the Shape.
	 * @return String that represent the form.
	 */
	public String getForm()
	{
		String name = shape.getNameU();
//		System.out.println("main shape name = " + name);
		String shape = shapeMappings.get(name);

		if (shape != null)
		{
			return shape;
		}
		else if (masterElement != null)
		{
			String masterName = masterElement.getNameU();
			String mxMasterShape = shapeMappings.get(masterName);
//			System.out.println("main shape name = " + mxMasterShape);
			
			if (mxMasterShape != null)
			{
				return mxMasterShape;
			}
			
			LOGGER.warning("Unmatched shape name : " + name + " , master name : " + masterName);
		}

		return "text";
	}

	/**
	 * Checks if a shape has east direction by default.
	 * @return Returns <code>true</code> if a shape has east direction by default.
	 */
	public boolean isEastDirection()
	{
		boolean ret = false;
		if (masterElement != null)
		{
			if (masterElement.getNameU().equals("Direct data"))
			{
				ret = true;
			}
		}
		if (shape.getNameU().equals("Direct data"))
		{
			ret = true;
		}
		return ret;
	}

	/**
	 * Checks if a shape may to be imported like an Off page reference.
	 * @return Returns <code>true</code> if a shape may to be imported like an Off page reference.
	 */
	public boolean isOff_page_reference()
	{
		boolean ret = false;
		if (masterElement != null)
		{
			if (masterElement.getNameU().equals("Off-page reference")
					|| masterElement.getNameU().equals("Lined/Shaded process"))
			{
				ret = true;
			}
			if (shape.getNameU().equals("Off-page reference")
					|| shape.getNameU().equals("Lined/Shaded process"))
			{
				ret = true;
			}
		}

		return ret;
	}

	/**
	 * Checks if a shape may to be imported like an External process.
	 * @return Returns <code>true</code> if a shape may to be imported like an External process.
	 */
	public boolean isExternal_process()
	{
		boolean ret = false;
		if (masterElement != null)
		{
			if (masterElement.getNameU().equals("External process"))
			{
				ret = true;
			}
			if (shape.getNameU().equals("External process"))
			{
				ret = true;
			}
		}

		return ret;
	}


	/**
	 * Checks if a shape has south direction by default.
	 * @return Returns <code>true</code> if a shape has south direction by default.
	 */
	public boolean isSouthDirection()
	{
		boolean ret = false;
		if (masterElement != null)
		{
			if (masterElement.getNameU().equals("Move")
					|| masterElement.getNameU().equals("Correcting element")
					|| masterElement.getNameU().equals("Inbound Goods")
					|| masterElement.getNameU().equals("Kickoff")
					|| masterElement.getNameU().equals("Manual file")
					|| masterElement.getNameU().equals("Stop state 2"))
			{
				ret = true;
			}
			if (shape.getNameU().equals("Move")
					|| shape.getNameU().equals("Correcting element")
					|| shape.getNameU().equals("Inbound Goods")
					|| shape.getNameU().equals("Kickoff")
					|| shape.getNameU().equals("Manual file")
					|| shape.getNameU().equals("Stop state 2"))
			{
				ret = true;
			}
		}
		return ret;
	}

	/**
	 * Checks if a shape is Complex but may to be imported like a simple shape.
	 * @return Returns <code>true</code> if a shape is Complex but may to be
	 * imported like a simple shape.
	 */
	public boolean isSimpleComplex()
	{
		boolean ret = false;
		if (masterElement != null)
		{
			if (masterElement.getNameU().equals("Open/closed bar")
					|| masterElement.getNameU().equals("Command button")
					|| masterElement.getNameU().equals("Water heater")
					|| masterElement.getNameU().equals("Generating station")
					|| masterElement.getNameU().equals("Classifier Role")
					|| masterElement.getNameU().equals(
							"Function w / invocation")
					|| masterElement.getNameU().equals("6-phase hexagonal")
					|| masterElement.getNameU().equals("Boundary")
					|| masterElement.getNameU().equals("Rotating machine")
					|| masterElement.getNameU().equals("Substation")
					|| masterElement.getNameU().equals("Inverter")
					|| masterElement.getNameU().equals("Logic gate 2")
					|| masterElement.getNameU().equals("Amplifier")
					|| masterElement.getNameU().equals("Signal generator")
					|| masterElement.getNameU()
							.equals("Text box (single-line)")
					|| masterElement.getNameU().equals("Callout 2")
					|| masterElement.getNameU().equals("Callout 2")
					|| masterElement.getNameU().equals("Off-line storage")
					|| masterElement.getNameU().equals("Or")
					|| masterElement.getNameU().equals("Divided process")
					|| masterElement.getNameU().equals("Lined/Shaded process")
					|| masterElement.getNameU().startsWith("Document")
					|| masterElement.getNameU().startsWith("Node")
					|| masterElement.getNameU().startsWith("Note")
					|| masterElement.getNameU().startsWith("Constraint")
					|| masterElement.getNameU().startsWith("Main control")
					|| masterElement.getNameU().startsWith("Screening device")
					|| masterElement.getNameU().startsWith("Recorder")
					|| masterElement.getNameU().startsWith("Ceiling fan")
					|| masterElement.getNameU().startsWith("Thermostat")
					|| masterElement.getNameU().startsWith("System Boundary"))
			{
				ret = true;
			}
		}
		if (shape.getNameU().equals("Open/closed bar")
				|| shape.getNameU().equals("Command button")
				|| shape.getNameU().equals("Water heater")
				|| shape.getNameU().equals("Generating station")
				|| shape.getNameU().equals("Classifier Role")
				|| shape.getNameU().equals("Function w / invocation")
				|| shape.getNameU().equals("6-phase hexagonal")
				|| shape.getNameU().equals("Boundary")
				|| shape.getNameU().equals("Rotating machine")
				|| shape.getNameU().equals("Substation")
				|| shape.getNameU().equals("Inverter")
				|| shape.getNameU().equals("Logic gate 2")
				|| shape.getNameU().equals("Amplifier")
				|| shape.getNameU().equals("Signal generator")
				|| shape.getNameU().equals("Text box (single-line)")
				|| shape.getNameU().equals("Callout 3")
				|| shape.getNameU().equals("Callout 3")
				|| shape.getNameU().equals("Off-line storage")
				|| shape.getNameU().equals("Or")
				|| shape.getNameU().equals("Divided process")
				|| shape.getNameU().equals("Lined/Shaded process")
				|| shape.getNameU().startsWith("Document")
				|| shape.getNameU().equals("Data store")
				|| shape.getNameU().equals("Node")
				|| shape.getNameU().equals("Note")
				|| shape.getNameU().equals("Constraint")
				|| shape.getNameU().equals("Main control")
				|| shape.getNameU().equals("Screening device")
				|| shape.getNameU().equals("Recorder")
				|| shape.getNameU().equals("Ceiling fan")
				|| shape.getNameU().equals("Thermostat")
				|| shape.getNameU().equals("System Boundary"))
		{

			ret = true;
		}
		return ret;
	}

	/**
	 * Returns the constant that represents the Shape using the lines of the Shape.
	 * @return String representation of the shape.
	 */
	public String getAproxForm()
	{
		if (isEllipseAprox())
		{
			//The shape is a Ellipse
			return mxConstants.SHAPE_ELLIPSE;
		}
		else if (isRoundedAprox())
		{
			//The Shape is Rounded
			return mxConstants.SHAPE_RECTANGLE + ";"
					+ mxConstants.STYLE_ROUNDED + "=1";
		}
		else if (isTriangleAprox())
		{
			//The shape is a Triangle
			return mxConstants.SHAPE_TRIANGLE;
		}
		else if (isHexagonAprox())
		{
			//The Shape is a Hexagon
			return mxConstants.SHAPE_HEXAGON;
		}
		else if (isRhombusAprox())
		{
			//The Shape is a Rhombus
			return mxConstants.SHAPE_RHOMBUS;
		}
		else
		{
			return mxConstants.SHAPE_RECTANGLE;
		}

	}

	/**
	 * Returns the name of the function for calculate the perimeter.
	 * @param form Form of the shape.
	 * @return Perimeter function.
	 */
	public String getPerimeter(String form)
	{
		if (form.equals(mxConstants.SHAPE_ELLIPSE))
		{
			return mxConstants.PERIMETER_ELLIPSE;
		}
		else if (form.equals(mxConstants.SHAPE_RECTANGLE))
		{
			return mxConstants.PERIMETER_RECTANGLE;
		}
		else if (form.equals(mxConstants.SHAPE_TRIANGLE))
		{
			return mxConstants.PERIMETER_TRIANGLE;
		}
		else if (form.equals(mxConstants.SHAPE_HEXAGON))
		{
			return mxConstants.PERIMETER_HEXAGON;
		}
		else if (form.equals(mxConstants.SHAPE_RHOMBUS))
		{
			return mxConstants.PERIMETER_RHOMBUS;
		}
		return mxConstants.PERIMETER_RECTANGLE;
	}

	/**
	 * Returns the direction of the shape.
	 * @param form Form of the shape.
	 * @return Direction(south, north, east and south)
	 */
	public String getDirection(String form)
	{
		if (!isSouthDirection())
		{
			if (form.equals(mxConstants.SHAPE_TRIANGLE))
			{
				return mxConstants.DIRECTION_NORTH;
			}
			else
			{
				return mxConstants.DIRECTION_EAST;
			}

		}
		else
		{
			return mxConstants.DIRECTION_SOUTH;
		}

	}

	/**
	 * Checks if a shape may to be imported like a Rhombus.<br/>
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Rhombus.
	 */
	public boolean isRhombusAprox()
	{
		boolean isRhombus = false;

		if (shape.getAmountEllipticalArcTo() == 0)
		{
			isRhombus = shape.getAmountLineTo() == 4;

			if (isRhombus)
			{
				mxPoint[] points = shape.getVertexPoints(parentHeight);
				isRhombus &= (points[0].getX() == points[2].getX())
						&& (points[1].getY() == points[3].getY());
			}
		}
		if (masterShape != null && !isRhombus)
		{

			if (masterShape.getAmountEllipticalArcTo() == 0)
			{
				isRhombus = masterShape.getAmountLineTo() == 4;

				if (isRhombus)
				{
					mxPoint[] points = masterShape
							.getVertexPoints(parentHeight);
					isRhombus &= (points[0].getX() == points[2].getX())
							&& (points[1].getY() == points[3].getY());
				}
			}
		}
		return isRhombus;
	}

	/**
	 * Checks if a shape may to be imported like a Ellipse.<br/>
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Ellipse.
	 */
	private boolean isEllipseAprox()
	{
		boolean isEllipse = false;

		isEllipse = shape.hasEllipse();

		if (!isEllipse)
		{
			isEllipse = shape.getAmountEllipticalArcTo() > 0;
			isEllipse &= shape.getAmountLineTo() < 2;
		}

		if (masterShape != null && !isEllipse)
		{
			isEllipse = masterShape.hasEllipse();

			if (!isEllipse)
			{
				isEllipse = masterShape.getAmountEllipticalArcTo() > 0;
				isEllipse &= masterShape.getAmountLineTo() < 2;
			}
		}

		return isEllipse;
	}

	/**
	 * Checks if a shape may to be imported like a Rounded.<br/>
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Rounded.
	 */
	private boolean isRoundedAprox()
	{
		boolean isRounded = false;

		isRounded = (shape.getAmountLineTo() == 2)
				&& (shape.getAmountEllipticalArcTo() == 2);
		isRounded |= (shape.getAmountLineTo() == 4)
				&& (shape.getAmountArcTo() == 4);
		if (masterShape != null && !isRounded)
		{
			isRounded = (masterShape.getAmountLineTo() == 2)
					&& (masterShape.getAmountEllipticalArcTo() == 2);
			isRounded |= (masterShape.getAmountLineTo() == 4)
					&& (masterShape.getAmountArcTo() == 4);
		}

		return isRounded;
	}

	/**
	 * Checks if a shape may to be imported like a Triangle.<br/>
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Triangle.
	 */
	private boolean isTriangleAprox()
	{
		boolean isTriangle = false;

		if (shape.getAmountEllipticalArcTo() == 0)
		{
			isTriangle = shape.getAmountLineTo() == 3;
		}
		if (masterShape != null && !isTriangle)
		{

			if (masterShape.getAmountEllipticalArcTo() == 0)
			{
				isTriangle = masterShape.getAmountLineTo() == 3;
			}
		}

		return isTriangle;
	}

	/**
	 * Checks if a shape may to be imported like a Hexagon.
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Hexagon.
	 */
	private boolean isHexagonAprox()
	{
		boolean isHexagon = false;

		if (shape.getAmountEllipticalArcTo() == 0)
		{
			isHexagon = shape.getAmountLineTo() == 6;
		}
		if (masterShape != null && !isHexagon)
		{

			if (masterShape.getAmountEllipticalArcTo() == 0)
			{
				isHexagon = masterShape.getAmountLineTo() == 6;
			}
		}
		return isHexagon;
	}

	/**
	 * Checks if a shape may to be imported like a Swimlane.
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Swimlane.
	 */
	public boolean isSwimlane()
	{
		boolean isSwimlane = false;
		isSwimlane |= shape.getNameU().equals("Vertical holder");
		isSwimlane |= shape.getNameU().equals("Functional band");

		if ((masterElement != null) && !isSwimlane)
		{
			isSwimlane |= masterElement.getNameU().equals("Vertical holder");
			isSwimlane |= masterElement.getNameU().equals("Functional band");

		}
		return isSwimlane;
	}

	/**
	 * Checks if a shape may to be imported like a Subproces.
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Subproces.
	 */
	public boolean isSubproces()
	{
		boolean isSwimlane = false;
		isSwimlane |= shape.getNameU().equals("Subproces");

		if ((masterElement != null) && !isSwimlane)
		{
			isSwimlane |= masterElement.getNameU().equals("Subproces");

		}
		return isSwimlane;
	}
}
