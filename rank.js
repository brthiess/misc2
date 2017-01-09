const dataFolder = 'data/spin/raw/100/';
const fs = require('fs');
files = fs.readdirSync(dataFolder);

var players_3 = [];
var players_2 = [];

var games = [];

const seatPattern = /Seat [0-9]: /;
var numPlayers = 0;
var currentPlayers = [];

threePlayerInflectionPoints = [];
twoPlayerEndPoints = [];

for(var i = 0; i <= 1; i++){
	files.forEach(file => {
		if(file.includes("- Copy") && file.includes(".txt")){
			console.log(dataFolder + file);
			getRanks(dataFolder + file);	
		}
	});
}
/*
for(iter in threePlayerInflectionPoints){
	console.log("\n\n");
	console.log(threePlayerInflectionPoints[iter]);
	console.log("****************");
	console.log(threePlayerInflectionPoints[iter].players);
	console.log("\n\n");
}*/

/*
for(iter in twoPlayerEndPoints){
	console.log("\n\n");
	console.log(twoPlayerEndPoints[iter]);
	console.log("\n\n");
}*/

for(iter in threePlayerInflectionPoints){
	if(threePlayerInflectionPoints[iter].nextHandNumber != 999999999999999999999999999){
		for(player_iter in threePlayerInflectionPoints[iter].players){
			if(players_3[player_iter] === undefined){
				players_3[player_iter] = new Player();
			}
			players_3[player_iter].chipsDifferential += (threePlayerInflectionPoints[iter].players[player_iter].numChips - 500);
			players_3[player_iter].numGames += 1;
			players_3[player_iter].name = player_iter;
		}
	}
}

for(iter in twoPlayerEndPoints){
	var winner = twoPlayerEndPoints[iter].winner;
	if(threePlayerInflectionPoints[iter] !== undefined) {
		if(players_2[winner] === undefined){
			players_2[winner] = new Player();
		}
		players_2[winner].chipsDifferential += (1500 - threePlayerInflectionPoints[iter].players[winner].numChips);
		players_2[winner].numGames += 1;
		players_2[winner].name = winner;
	}
	
	if(threePlayerInflectionPoints[iter] !== undefined) {
		var loser = twoPlayerEndPoints[iter].loser;
		if(players_2[loser] === undefined){
			players_2[loser] = new Player();
		}
		players_2[loser].chipsDifferential += (0 - threePlayerInflectionPoints[iter].players[loser].numChips);
		players_2[loser].numGames += 1;
		players_2[loser].name = loser;
	}
}

players_2_arr = [];
for(iter in players_2){
	players_2_arr.push(players_2[iter]);
}


players_3_arr = [];
for(iter in players_3){
	players_3_arr.push(players_3[iter]);
}


function compare(a,b) {
  if (a.chipsDifferential / a.numGames < b.chipsDifferential / b.numGames)
    return -1;
  if (a.chipsDifferential / a.numGames > b.chipsDifferential / b.numGames)
    return 1;
  return 0;
}

players_2_arr.sort(compare);
players_3_arr.sort(compare);

console.log(players_2_arr);
console.log(players_3_arr);

var players_2_json = JSON.stringify(players_2_arr);
var players_3_json = JSON.stringify(players_3_arr);

fs.writeFile("bin/top_heads_up_players.json", players_2_json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
fs.writeFile("bin/top_3max_players.json", players_3_json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});


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


function Player(){
	this.chipsDifferential = 0;
	this.numGames = 0;
	this.numWins = 0;
	this.numChips = 0;
	this.name = '';
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
	this.nextHandNumber = 999999999999999999999999999;
	this.players = [];
}

function endPoint(){
	this.gameId = '';
	this.winner = '';
	this.loser = '';
}


function getRanks(data){
	//Go through each game
	handIsInflectionPoint = false;
	foundHandAfterInflectionPoint = false;
	foundSummary = false;
	gameId = -1;
	handNumber = -1;
	numPlayers = 0;
	currentPlayers = [];
			
	fs.readFileSync(data).toString().split('\n').forEach(function (line) {
		if (line.includes('PokerStars Hand #')) {
			//get the game number
			gameId = line.split(" ")[4];
			handNumber = line.split(" ")[2].match(/\d/g).join("");
			numPlayers = 0;
			currentPlayers = [];
			handIsInflectionPoint = false;
			foundHandAfterInflectionPoint = false;
			foundSummary = false;

			
			if(threePlayerInflectionPoints[gameId] !== undefined && handNumber > threePlayerInflectionPoints[gameId].handNumber && handNumber < threePlayerInflectionPoints[gameId].nextHandNumber){
				threePlayerInflectionPoints[gameId].nextHandNumber = handNumber;
				foundHandAfterInflectionPoint = true;
			}
		}
		
		if(line.includes("*** SUMMARY ***")){
			foundSummary = true;
		}
		
		if(seatPattern.test(line) && !foundSummary){
			numPlayers++;
			var player = new Player();
			player.name = line.split(" ")[2];
			//get number of chips from player
			player.numChips = getStackFromLine(line);
			//add to currentPlayers Array;
			currentPlayers[player.name] = player;
		}
		
		if(line.includes("finished the tournament in 3rd place")){
			handIsInflectionPoint = true;
		}
		
		if(line.includes(" wins the tournament and receives ")) {
			var varEndPoint = new endPoint();
			var winner = line.split(" ")[0];
			var loser = '';
			for(player_iter in currentPlayers){
				if(player_iter != winner){
					loser = player_iter;
				}
			}
			if(loser == ''){
				console.log("ERROR: COULDN'T FIND LOSER");
			}
			if(numPlayers == 3){
				var varInflectionPoint = new inflectionPoint();
				varInflectionPoint.gameId = gameId;
				varInflectionPoint.handNumber = handNumber;
				var foundWinner = false;
				for(player_iter in currentPlayers){
					if(player_iter != winner){
						currentPlayers[player_iter].numChips = 0;
					}
					else {
						foundWinner = true;
						currentPlayers[player_iter].numChips = 1500;
					}
				}
				if(!foundWinner){
					console.log("ERROR: DIDN'T FIND WINNER");
				}
				varInflectionPoint.players = currentPlayers;
				varInflectionPoint.nextHandNumber = 0;
				threePlayerInflectionPoints[varInflectionPoint.gameId] = varInflectionPoint;
			}
			else {
				varEndPoint.winner = winner;
				varEndPoint.loser = loser;
				varEndPoint.gameId = gameId;
				
				twoPlayerEndPoints[gameId] = varEndPoint;
			}
		}
		
		if(foundSummary && handIsInflectionPoint){
			if(threePlayerInflectionPoints[gameId] === undefined){
				var varInflectionPoint = new inflectionPoint();
				varInflectionPoint.gameId = gameId;
				varInflectionPoint.handNumber = handNumber;
				varInflectionPoint.players = currentPlayers;
				
				threePlayerInflectionPoints[varInflectionPoint.gameId] = varInflectionPoint;
			}
		}
		
		if(foundSummary && foundHandAfterInflectionPoint){
			if(numPlayers != 2){
				console.log("ERROR: " + numPlayers + " players");
			}
			for(player_iter in threePlayerInflectionPoints[gameId].players){
				threePlayerInflectionPoints[gameId].players[player_iter].numChips = 0;
			}
			for(player in currentPlayers){
				threePlayerInflectionPoints[gameId].players[player] = currentPlayers[player];
			}
			foundHandAfterInflectionPoint = false;
		}						
	});
}

function getStackFromLine(lineVar){
	if (lineVar.includes('(') && lineVar.includes(' in chips)')){
		var stackSize = lineVar.split(" ")[3].match(/\d/g).join("");
	}
	//console.log("STACK SIZE: " + stackSize);
	if(!isNormalInteger(stackSize) || stackSize > 1500 || stackSize < 0){
		console.log("************** ERROR *************");
		console.log("Stack Size Error: " + stackSize);
		console.log("LINE: " + lineVar);
	}
	return parseInt(stackSize);
}

function isNormalInteger(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}