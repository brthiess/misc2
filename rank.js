const dataFolder = 'data/spin/raw/100/';
const fs = require('fs');
files = fs.readdirSync(dataFolder);

var players_3 = [];
var players_2 = [];

var games = [];

 files.forEach(file => {
	if(file.includes("- Copy") && file.includes(".txt")){
		console.log(dataFolder + file);
		getRanks(dataFolder + file, players);	
	}
});

console.log(players);


function Player(){
	this.chipsDifferential = 0;
	this.numGames = 0;
	this.numWins = 0;
}

function Game(){
	this.gameId = '';
	this.numPlayers = 3;
	this.first = '';
	this.second = '';
	this.third = '';
}

function inflectionPoint() {
	this.gameId = '';
	this.handNumber = '';
	this.nextHandNumber = '';
	this.players = [];
}

const seatPattern = /Seat [0-9]: /;
var numPlayers = 0;
var currentPlayers = [];

threePlayerInflectionPoints = [];

function getRanks(data, players){
	//Go through each game
	fs.readFileSync(data).toString().split('\n').forEach(function (line) {
		if (line.includes('PokerStars Hand #')) {
			//get the game number
			var gameId = line.split(" ")[4];
			var handNumber = line.split(" ")[2];
			numPlayers = 0;
			currentPlayers = [];
		}
		//get the number of players
		if(seatPattern.test(line)){
			numPlayers++;
			playerName = line.split(" ")[2];
			if (typeof players[playerName] === 'undefined') {
				players[playerName] = new Player();
			}
			//get number of chips from player
			
			//add to currentPlayers Array;
		}
		
		if(handIsInflectionPoint){
			var varInflectionPoint = new inflectionPoint();
			varInflectionPoint.gameId = gameId;
			varInflectionPoint.handNumber = handNumber;
			varInflectionPoint.players = currentPlayers;
			threePlayerInflectionPoints.push(varInflectionPoint);
		}
		
		//get number of chips for each player AT THE END OF THE ROUND AFTER THE 3rd player was eliminated (or 2nd if it was heads up)
		
		//if the game has 3 players, check for the string ' finished the tournament in 3rd place'
			//if that string exists, then put 
				//players_3[3rdplaceuser].chipsDifferential -= 500
				//players_3[3rdplaceuser].numGames += 1
				//players_3[2ndplaceuser].chipDifferential += currentNumberOfChips - 500 
				//players_3[2ndplaceuser].numGames += 1 
				//etc.
				//players[1stplaceuser].chipDifferential += currentNumberOfChips - 500
		//If the game has 2 players, check for the string ' wins the tournament and receives'
			//players_2[1stplaceuser].chipsDifferential += 1500 - numChipsAtStartOfHeadsUpPlay
			//players_2[1stplaceuser].numGames += 1
			//players_2[1stplaceuser].numWins += 1
			//players_2[2ndplaceuser].chipsDifferential += 0 - numChipsAtStartOfHeadsUpPlay
			//players_2[2ndplaceuser].numGames += 1 
	}
	
		
}