// James Murphree
// Checkers js


var select;
var handlers = new Array();
var turn = 'red';
var board;
var pieces;

function init() {
	makeHTMLBoard();
	setBoard();
	document.getElementById('winner').innerHTML = 'Have fun playing checkers.  NOTE: You can\'t double jump!';
	pieces = new Array(12, 12);
	handlers.push(addHandler(document.getElementById('gamespace'), 'click', move));
}

function makeHTMLBoard() {
	for (var i = 1; i <= 8; i++) {
		addHTML('gamespace', 'div', 'row' + i, 'rows');
		for (var j = 1; j <= 8; j++) {
			if (i % 2 == j % 2) {
				addHTML('row' + i, 'div', 'col' + j, 'squarew');
			} else {
				addHTML('row' + i, 'div', 'col' + j, 'square');
			}
		}
	}
}

function setBoard() {
	board = new Array();
	for (var i = 0; i < 8; i++) {
		board[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
	}
	for (var i = 0; i < 12; i++) {
		if (i < 4 || i > 7) {
			if (i < 4) {
				addChip('red.png', i * 100, 0);
			} else {
				addChip('red.png', i % 4 * 100, 100);
			}
		} else {
			addChip('red.png', i % 4 * 100 + 50, 50);
		}
	}
	for (var i = 0; i < 12; i++) {
		if (i < 4 || i > 7) {
			if (i < 4) {
				addChip('black.png', i * 100 + 50, 250);
			} else {
				addChip('black.png', i % 4 * 100 + 50, 350);
			}
		} else {
			addChip('black.png', i % 4 * 100 , 300);
		}
	}
}

function addHTML(id, childType, childId, childClass) {
	var child = document.createElement(childType);
	child.setAttribute('id', childId);
	child.setAttribute('class', childClass);
	document.getElementById(id).appendChild(child);
}

function addChip(color, left, top) {
	var chip = document.createElement('img');
	chip.setAttribute('src', color);
	chip.style.left = left + 'px';
	chip.style.top = top + 'px';
	chip.style.position = 'absolute';
	board[top / 50][left / 50] = chip;
	handlers.push(addHandler(chip, 'click', selectChip));
	document.getElementById('gamespace').appendChild(chip);
}

function linkEventHandler(node, event, handler) {
	if (typeof node.addEventListener == 'function')
		node.addEventListener(event, handler, false);
	else
		node.attachEvent('on' + event, handler);
}

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
		handler(normaliseEvent(event || window.event), node);
	}
	linkEventHandler(node, type, wrapHandler);
	return {node: node, type: type, handler: wrapHandler};
}

function selectChip(event, node) {
	if (node.getAttribute('src') == turn + '.png' || node.getAttribute('src') ==  turn + 'k.png') {
		select = node;
		event.stopPropagation();
	}
}	

function move(event) {
	if (select != null) {
		var locationX = event.pageX - 100 - ((event.pageX - 100) % 50);
		var locationY = event.pageY - 100 - ((event.pageY - 100) % 50);
		if (validMove(locationX / 50, locationY / 50, Number(select.style.left.replace('px','')) / 50, Number(select.style.top.replace('px','')) / 50, select.getAttribute('src'))) {
			select.style.top = locationY + 'px';
			select.style.left = locationX + 'px';
			if (select.getAttribute('src') == 'red.png' && select.style.top == '350px') {
				remove(select);
				addChip('redk.png', locationX, 350);
			} else if (select.getAttribute('src') == 'black.png' && select.style.top == '0px') {
				remove(select);
				addChip('blackk.png', locationX, 0);
			}
			select = null;
			if (gameOver()) {
				if (pieces[0] == 0) {
					document.getElementById('winner').innerHTML = 'BLACK WON!  <button id="playagain">Play Again</button>';
					addHandler(document.getElementById('playagain'), 'click', reset);
				} else {
					document.getElementById('winner').innerHTML = 'RED WON!  <button id="playagain">Play Again</button>';
					addHandler(document.getElementById('playagain'), 'click', reset);
				}
			}
			if (turn == 'red') {
				turn = 'black';
			} else {
				turn = 'red';
			}
		}
	}
}

function validMove(toX, toY, fromX, fromY, src) {
	if (turn == 'red') {
		var upDown = toY - fromY;
		if (src == 'redk.png') {
			upDown = Math.abs(upDown);
		}
		if (Math.abs(toX - fromX) == 1 && upDown == 1 && board[toY][toX] == 0) {
			board[toY][toX] = board[fromY][fromX];
			board[fromY][fromX] = 0;
			return true;
		} else if (Math.abs(toX - fromX) == 2 && upDown == 2 &&
				(board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2].getAttribute('src') == 'black.png' ||
				board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2].getAttribute('src') == 'blackk.png') &&
				board[toY][toX] == 0) {
			remove(board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2]);
			board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2] = 0;
			pieces[1]--;
			board[toY][toX] = board[fromY][fromX];
			board[fromY][fromX] = 0;
			return true;
		}
	} else {
		var upDown = toY - fromY;
		if (src == 'blackk.png') {
			upDown = -1 * Math.abs(upDown);
		}
		if (Math.abs(toX - fromX) == 1 && upDown == -1 && board[toY][toX] == 0) {
			board[toY][toX] = board[fromY][fromX];
			board[fromY][fromX] = 0;
			return true;
		} else if (Math.abs(toX - fromX) == 2 && upDown == -2 &&
				(board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2].getAttribute('src') == 'red.png' ||
				board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2].getAttribute('src') == 'redk.png') &&
				board[toY][toX] == 0) {
			remove(board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2]);
			board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2] = 0;
			pieces[0]--;
			board[toY][toX] = board[fromY][fromX];
			board[fromY][fromX] = 0;
			return true;
		}
	}
	return false;
}

function remove(element) {
	element.parentNode.removeChild(element);
}

function gameOver() {
	if (pieces[0] == 0 || pieces[1] == 0) {
		return true;
	}
	return false;
}

function reset() {
	location.reload();
}