/*
 * $Id: Devel.js,v 1.5 2012-07-27 05:22:25 mate Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
// This provides an indirection to make sure the mxClient.js
// loads before the dependent classes below are loaded. This
// is used for development mode where the JS is in separate
// files and the mxClient.js loads other files.

// Uses grapheditor from devhost
mxscript(geBasePath +'/Editor.js');
mxscript(geBasePath +'/Graph.js');
mxscript(geBasePath +'/Shapes.js');
mxscript(geBasePath +'/EditorUi.js');
mxscript(geBasePath +'/Actions.js');
mxscript(geBasePath +'/Menus.js');
mxscript(geBasePath +'/Sidebar.js');
mxscript(geBasePath +'/Toolbar.js');
mxscript(geBasePath +'/Dialogs.js');

// Loads main class
mxscript('/js/diagramly/Dialogs.js');
mxscript('/js/diagramly/Sharing.js');
mxscript('/js/diagramly/Diagramly.js');

//For developers
if (urlParams['test'] == '1')
{
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/bpmn/mxBpmnShape.js');
	
	// don't change the order of mockup scripts except if you know what you are doing
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/MockupInit.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Buttons.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Containers.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Forms.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Graphics.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Misc.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Navigation.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Markup.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Test.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/Text.js');
	mxscript(mxDevUrl + '/mxgraph/etc/javascript/mockup/MockupFinal.js');
}
