// This file

//Register shape
mxCellRenderer.prototype.defaultShapes['bpmn'] = mxBpmnShape;

//Adds context menu
var menusInit = Menus.prototype.init;
Menus.prototype.init = function()
{
	menusInit.apply(this, arguments);

	mxResources.parse('bpmnPosition=BPMN Position');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.START_STANDARD + '=Standard');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT + '=Event Interrupted');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT + '=Event Non-Interrupted');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.CATCHING + '=Catching');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.BOUND_INT + '=Bounds Interrupted');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT + '=Bounds Non-Interrupted');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.THROWING + '=Throwing');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.END + '=End');
	mxResources.parse(mxBpmnShape.prototype.eventTypeEnum.GATEWAY + '=Gateway');

	this.put('bpmnPosition', new Menu(mxUtils.bind(this, function(menu, parent)
			{
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.START_STANDARD), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.START_STANDARD], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.CATCHING), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.CATCHING], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.BOUND_INT), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.BOUND_INT], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.THROWING), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.THROWING], null, parent);
		this.styleChange(menu, mxResources.get(mxBpmnShape.prototype.eventTypeEnum.END), [mxBpmnShape.prototype.eventTypeParam], [mxBpmnShape.prototype.eventTypeEnum.END], null, parent);
			})));
};

(function()
{
	var menusCreatePopupMenu = Menus.prototype.createPopupMenu;
	
	Menus.prototype.createPopupMenu = function(menu, cell, evt)
	{
		menusCreatePopupMenu.apply(this, arguments);
		var graph = this.editorUi.editor.graph;
	
		if (graph.getSelectionCount() == 1)
		{
			var state = graph.view.getState(graph.getSelectionCell());
	
			if (state.style['shape'] == 'bpmn')
			{
				this.addSubmenu('bpmnPosition', menu);
			}
		}
	};
	
	//Adds custom shape library
	var SidebarInit = Sidebar.prototype.init;
	Sidebar.prototype.init = function()
	{
		SidebarInit.apply(this, arguments);
		this.addCustomPalette(false);
	};
	
	Sidebar.prototype.addCustomPalette = function(expand)
	{
		this.addPalette('bpmn', 'BPMN (Test)', expand || false, mxUtils.bind(this, function(content){
			content.appendChild(this.createVertexTemplate('swimlane;horizontal=0;', 300, 160, 'Pool'));
	
			var classCell = new mxCell('Process', new mxGeometry(0, 0, 140, 60),
			'rounded=1');
			classCell.vertex = true;
			var classCell1 = new mxCell('', new mxGeometry(1, 1, 30, 30), 'shape=bpmn;' + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD + ';perimeter=ellipsePerimeter;');
			classCell1.vertex = true;
			classCell1.geometry.relative = true;
			classCell1.geometry.offset = new mxPoint(-40, -15);
			classCell.insert(classCell1);
	
			content.appendChild(this.createVertexTemplateFromCells([classCell], 140, 60));
	
			var classCell = new mxCell('Process', new mxGeometry(0, 0, 140, 60),
			'rounded=1');
			classCell.vertex = true;
			var classCell1 = new mxCell('', new mxGeometry(0.5, 1, 12, 12), 'shape=plus');
			classCell1.vertex = true;
			classCell1.connectable = false;
			classCell1.geometry.relative = true;
			classCell1.geometry.offset = new mxPoint(-6, -12);
			classCell.insert(classCell1);
	
			content.appendChild(this.createVertexTemplateFromCells([classCell], 140, 60));
	
			var classCell = new mxCell('Process', new mxGeometry(0, 0, 140, 60),
			'rounded=1');
			classCell.vertex = true;
			var classCell1 = new mxCell('', new mxGeometry(0, 0, 20, 14), 'shape=message');
			classCell1.vertex = true;
			classCell1.connectable = false;
			classCell1.geometry.relative = true;
			classCell1.geometry.offset = new mxPoint(5, 5);
			classCell.insert(classCell1);
	
			content.appendChild(this.createVertexTemplateFromCells([classCell], 140, 60));
	
			var classCell = new mxCell('', new mxGeometry(0, 0, 60, 40), 'shape=message');
			classCell.vertex = true;
	
			content.appendChild(this.createEdgeTemplateFromCells([classCell], 60, 40));
	
			var assoc = new mxCell('Sequence', new mxGeometry(0, 0, 0, 0), 'endArrow=block;endFill=1;endSize=6');
			assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			assoc.edge = true;
	
			content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0));
	
			var assoc = new mxCell('Default', new mxGeometry(0, 0, 0, 0), 'startArrow=dash;startSize=8;endArrow=block;endFill=1;endSize=6');
			assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			assoc.edge = true;
	
			content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0));
	
			var assoc = new mxCell('Conditional', new mxGeometry(0, 0, 0, 0), 'startArrow=diamondThin;startFill=0;startSize=14;endArrow=block;endFill=1;endSize=6');
			assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			assoc.edge = true;
	
			content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0));
	
			var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1');
			assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			assoc.edge = true;
	
			content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0));
	
			var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1');
			assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			assoc.edge = true;
	
			var sourceLabel = new mxCell('', new mxGeometry(0, 0, 20, 14), 'shape=message');
			sourceLabel.geometry.relative = true;
			sourceLabel.setConnectable(false);
			sourceLabel.vertex = true;
			sourceLabel.geometry.offset = new mxPoint(-10, -7);
			assoc.insert(sourceLabel);
	
			content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0));
	
			var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'shape=link');
			assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			assoc.edge = true;
	
			content.appendChild(this.createEdgeTemplateFromCells([assoc], 160, 0));
	
			var w = 60;
			var h = 60;
			var s = 'shape=bpmn;verticalLabelPosition=bottom;verticalAlign=top;';
			var sgw = s + mxBpmnShape.prototype.eventTypeEnum.GATEWAY + '=1;';
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.LINK + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.LINK + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ERROR + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ERROR + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ERROR + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CANCEL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CANCEL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TERMINATE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MESSAGE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TIMER + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ESCALATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CONDITIONAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.LINK + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.LINK + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ERROR + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ERROR + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.ERROR + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CANCEL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.CANCEL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.COMPENSATION + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.SIGNAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.THROWING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.MULTIPLE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.START_STANDARD, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.EVENT_SP_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.CATCHING, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_INT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.PAR_MULTI + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.BOUND_NONINT, w, h, ''));
			content.appendChild(this.createVertexTemplate( sgw + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.TERMINATE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.END, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GENERAL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.GATEWAY, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GW_EXCLUSIVE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.GATEWAY, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GW_PARALLEL + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.GATEWAY, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GW_INCLUSIVE + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.GATEWAY, w, h, ''));
			content.appendChild(this.createVertexTemplate( s + mxBpmnShape.prototype.eventParam + '=' + mxBpmnShape.prototype.eventEnum.GW_COMPLEX + ';' + mxBpmnShape.prototype.eventTypeParam + '=' + mxBpmnShape.prototype.eventTypeEnum.GATEWAY, w, h, ''));}));
	};
})();