
/*
	Node = Event location aka the id of the thing you want to apply the event to
	Event = the event you want to track, ie clicks or keypresses
	Handler = the function handling the event
*/

function registerEventHandler(node, event, handler) {
  if (typeof node.addEventListener == "function")
    node.addEventListener(event, handler, false);
  else
    node.attachEvent("on" + event, handler);
}


/*
	Same as registerEventhandler except it unregisters it
	not sure when you would want to use this
*/

function unregisterEventHandler(node, event, handler) {
  if (typeof node.removeEventListener == "function")
    node.removeEventListener(event, handler, false);
  else
    node.detachEvent("on" + event, handler);
}


/*
	Example of a click event function

function reportClick(event) {
  event = event || window.event;
  var target = event.target || event.srcElement;
  var pageX = event.pageX, pageY = event.pageY;
  if (pageX == undefined) {
    pageX = event.clientX + document.body.scrollLeft;
    pageY = event.clientY + document.body.scrollTop;
  }

  document.getElementById("msg").innerHTML = "Mouse clicked at " + pageX + ", " + pageY + ".";
}
registerEventHandler(document, "click", reportClick);

function printKeyCode(event) {
  event = event || window.event;
  var charCode = event.charCode;
  if (charCode == undefined || charCode === 0)
    charCode = event.keyCode;
  document.getElementById("msg").innerHTML = "Clicked at: " + charCode;
}

registerEventHandler(document, "keydown", printKeyCode);
*/

/*
	takes event characteristics and changes them so that they're the same for all browsers
	event now has fields and methods
		stopPropagation
		preventDefault
		stop
		target
		relatedTarget
		pageX
		pageY
		if keypress
			character
*/
function normaliseEvent(event) {
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
  registerEventHandler(node, type, wrapHandler);
  return {node: node, type: type, handler: wrapHandler};
}

function removeHandler(object) {
  unregisterEventHandler(object.node, object.type, object.handler);
}

var blockQ = addHandler(document, "keypress", press);
  /*
  if (event.character.toLowerCase() == "q")
    event.stop();
  else
  	document.getElementById("msg").innerHTML = "Clicked at: " + event.character;
});
*/

function press(event) {
	document.getElementById("msg").innerHTML = "Clicked at: " + event.character;
}


function dom(name, attributes, value) {
  var node = document.createElement(name);
  if (attributes) {
    forEachIn(attributes, function(name, value) {
      setNodeAttribute(node, name, value);
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

var newP = dom("P", null, "It's a Paragraph");
document.body.appendChild(newP);



