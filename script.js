var answer = Math.floor(Math.random() * 10 + 1);
var guess = 0;
var prevGuess = new Array();

function disp_prompt() {
	var newGuess = prompt("What number am I thinking of?","Number");
	prevGuess.push(newGuess);
	if (newGuess == answer) {
		document.getElementById("msg").innerHTML = "Correct, I was thinking of the number " + answer + " good guess! You guessed " + prevGuess;
	} else {
		if (Math.abs(answer - newGuess) < Math.abs(answer - guess)) {
			document.getElementById("msg").innerHTML = "Closer but not quite. Guess again. Previous Guesses = " + prevGuess + " <input type=\"button\" onclick = \"disp_prompt()\" value = \"guess\">";
		} else if (Math.abs(answer - newGuess) == Math.abs(answer - guess)) {
			document.getElementById("msg").innerHTML = "Same distance away. Guess again. Previous Guesses = " + prevGuess + " <input type=\"button\" onclick = \"disp_prompt()\" value = \"guess\">";
		} else {
			document.getElementById("msg").innerHTML = "Colder. Guess again Previous Guesses = " + prevGuess + ". <input type=\"button\" onclick = \"disp_prompt()\" value = \"guess\">";
		}
		guess = newGuess;
	}
}

function other() {
	
}