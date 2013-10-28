var black;
var red;
var square;
var board;
var squarew;
var player1;
var player2;
var turn;

function init() {
	black = 'black.png';
	red = 'red.png';
	square = 'square.png';
	squarew = 'squarew.png';
	board = new Array();
	makeHTMLBoard();

	play();
}

function play() {
	setUpBoard();
	turn = 1;
	while (!gameOver()) {
		render();
	}
}

function setUpBoard() {
	player1 = 12;
	player2 = 12;
	for (var i = 0; i < 8; i++) {
		var row = new Array();
		for (var j = 0; j < 8; j++) {
			row[j] = makeSquare(i, j);
		}
		board[i] = row;
	}
}

function makeSquare(rowNumber, colNumber) {
	var blockImg;
	var chip;
	var chipType;
	if ((rowNumber % 2 == 0 && colNumber % 2 == 0) ||
			(rowNumber & 2 == 1 && colNumber % 2 == 1)) {
		blockImg = squarew;
	} else {
		blockImg = square;
	}
	if ((rowNumber == 0 || rowNumber == 1) &&
			blockImg == squarew) {
		chip = red;
		chipType = 1;
	} else if ((rowNumber == 6 || rowNumber == 7) &&
			blockImg == squarew) {
		chip = black;
		chipType = 1;
	} else {
		chip = 'none';
		chipType = 0;
	}
	return {chip: chip, blockImg: blockImg};
}

function gameOver() {
	return player1 == 0 || player2 == 0;
}

function render() {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (board[i][j].blockImg == square) {
				document.getElementById('row' + (i + 1) + 'col' + (j + 1)).innerHTML = '<img src="square.png">';

			} else {
				document.getElementById('row' + (i + 1) + 'col' + (j + 1)).innerHTML = '<img src="squarew.png">';
			}
		}
	}
}

function makeHTMLBoard() {
	addRowDivs();
	for (var i = 1; i <= 8; i++) {
		addColDivs('row' + i);
	}
}

function addRowDivs() {
	document.getElementById('gamespace').innerHTML = '<div id="row1"></div><div id="row2"></div><div id="row3"></div><div id="row4"></div><div id="row5"></div><div id="row6"></div><div id="row7"></div><div id="row8"></div>';
}

function addColDivs(row) {
	document.getElementById(row).innerHTML = '<div id="' + row + 'col1"></div><div id="' + row + 'col2"></div><div id="' + row + 'col3"></div><div id="' + row + 'col4"></div><div id="' + row + 'col5"></div><div id="' + row + 'col6"></div><div id="' + row + 'col7"></div><div id="' + row + 'col8"></div>'
}












