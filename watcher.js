Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var Game = require('./game-watcher');
const fs = require('fs');
const chalk = require('chalk');


currentPercentile = 0;
//Initialize empty hand and community hand
hand = new Hand.Hand(2);
communityHand = new Hand.Hand(5);


//GLOBALS
var foundCommunityCards = false;
var foundHoleCards = false;
var foundFlopCards = false;
var foundTurnCards = false;
var foundRiverCards = false;
var foundNewRound = false;
var game;

startLoop();

function startLoop(){
	game = new Game.Game();
	game.calculatePercentile();
	loop(game);
}
	
function loop(game){
	if(isNewRound()){
		console.log("Found New Round.  Resetting...");
		resetGame();
	}
	else {	//Continue with current round
		if (!foundHoleCards){
			cards = getHoleCards();
			var pattern = /^([2-9aqkjt][chsd]){2}$/;
			if(pattern.test(cards)){
				console.log("My Cards: " + cards);
				cards = cards.match(/.{1,2}/g);
				game.setHand(cards);
				foundHoleCards = true;
			}
		}
		else if (foundHoleCards && !foundFlopCards){
			cards = getCommunityCards(game);
			var pattern = /^([2-9aqkjt][chsd]){1,3}$/;
			if(pattern.test(cards)){
				console.log("Flop: " + cards);
				console.log(cards);
				cards = cards.match(/.{1,2}/g);
				game.setCommunityHand(cards)
				foundFlopCards = true;
			}
		}
		else if (foundHoleCards && foundFlopCards && !foundTurnCards){
			cards = getCommunityCards(game);
			var pattern = /^([2-9aqkjt][chsd]){1,3}$/;
			if(pattern.test(cards)){
				console.log("Turn: " + cards);
				console.log(cards);
				cards = cards.match(/.{1,2}/g);
				game.setCommunityHand(cards)
				foundTurnCards = true;
			}
		}
		else if (foundHoleCards && foundFlopCards && foundTurnCards && !foundRiverCards){
			cards = getCommunityCards(game);
			var pattern = /^([2-9aqkjt][chsd]){1,3}$/;
			if(pattern.test(cards)){
				console.log("River: " + cards);
				console.log(cards);
				cards = cards.match(/.{1,2}/g);
				game.setCommunityHand(cards)
				foundRiverCards = true;
			}
		}
	}
	setTimeout(function(){loop(game)}, 200);
	console.log(game.getPercentile() + "%");
}



function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

function resetGame(){
	foundCommunityCards = false;
	foundHoleCards = false;
	foundFlopCards = false;
	foundTurnCards = false;
	foundRiverCards = false;
	foundNewRound = false;
	game.resetGame();
}




function getHoleCards(){
	content = fs.readFileSync('states/my-cards.txt');
	return content.toString();
}


function isNewRound(callback){
	content = fs.readFileSync('states/new-round.txt');
	if(content.toString() == 'true'){
		resetNewRound();
		return true;
	}
	else {
		return false;
	}
}

function resetNewRound(){
	fs.writeFile('states/new-round.txt', 'false', (err) => {
	  if (err) throw err;
	});
}

function getCommunityCards(game) {
	var file = '';
	if (game.handState == 'f'){
		file = 'flop.txt';
	}
	else if (game.handState == 't'){
		file = 'turn.txt';
	}
	else if (game.handState == 'r'){
		file = 'river.txt';
	}
	if (file == ''){
		console.log("ERROR Finding correct file in getCommunityCards");
	}
	data = fs.readFileSync('states/' + file);
	content = data.toString();
	return content;
}
      