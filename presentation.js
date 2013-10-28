/*
	Main Theme IE Sucks!
	javascript events: http://www.quackit.com/html_5/tags/html_5_event_handler_content_attributes.cfm
	events: things that happen
	nodes: places where things can happen
	event handler: does stuff with the event
	event listener: looks at the event and connects it to the handler

*/


function click(event) {
	// because IE stores the event in a global variable
	event = event || window.event;
  	var target = event.target || event.srcElement;
  	var pageX = event.pageX, pageY = event.pageY;
  	// because IE is stupid and different
  	if (pageX == undefined) {
    	pageX = event.clientX + document.body.scrollLeft;
    	pageY = event.clientY + document.body.scrollTop;
  	}
	document.getElementById("text").innerHTML = "X = " + pageX + "	Y = " + pageY;
}


function linkEventHandler(node, event, handler) {
  if (typeof node.addEventListener == "function")
  	// leave false because IE (priority boolean)
    node.addEventListener(event, handler, false);
  else
  	// Because IE
    node.attachEvent("on" + event, handler);
}

// linkEventHandler(document, "click", click);

function unlinkEventHandler(node, event, handler) {
  	if (typeof node.removeEventListener == "function")
    	node.removeEventListener(event, handler, false);
  	else
    	node.detachEvent("on" + event, handler);
}

// unregisterEventHandler(document, "click", click);


// WHY? Because IE!
function normaliseEvent(event) {
	// true if it doesn't exist
  	if (!event.stopPropagation) {
  		event.stopPropagation = function() {this.cancelBubble = true;};
  		event.preventDefault = function() {this.returnValue = false;};
  	}
  	if (!event.stop) {
    	event.stop = function() {
    		this.stopPropagation();
    		this.preventDefault();
    	};
  	}

  	if (event.srcElement && !event.target)
    	event.target = event.srcElement;
  	if ((event.toElement || event.fromElement) && !event.relatedTarget)
    	event.relatedTarget = event.toElement || event.fromElement;
  	if (event.clientX != undefined && event.pageX == undefined) {
    	event.pageX = event.clientX + document.body.scrollLeft;
    	event.pageY = event.clientY + document.body.scrollTop;
  	}
  	if (event.type == "keypress") {
    	if (event.charCode === 0 || event.charCode == undefined)
    		event.character = String.fromCharCode(event.keyCode);
    	else
      		event.character = String.fromCharCode(event.charCode);
  	}

  return event;
}

function addHandler(node, type, handler) {
	function wrapHandler(event) {
    	handler(normaliseEvent(event || window.event));
  	}
  	// Adds event listener
    linkEventHandler(node, type, wrapHandler);
    return {node: node, type: type, handler: wrapHandler};
}

function clickAnywhere(event) {
	document.getElementById("text").innerHTML = "X = " + event.pageX + "	Y = " + event.pageY;
}

var clickOn = addHandler(document, "click", clickAnywhere);

