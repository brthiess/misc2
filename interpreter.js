var fs = require('fs');

data = 'data/spin/raw/data2.txt';

//Clear file
fs.writeFileSync("data/spin/refined/data.txt", "");




currentUser = ''
finishedRound = false;
foundNewFound = false;
roundNumber = 0;
finishedGame = false;
foundNewGame = false;
numPlayers = 0;
biggestStack = 0;
smallestStack = 9999;
currentBigBlind = 0;
currentSmallBlind = 0;
currentCallingSize = 0;
currentPotSize = 0;


fs.readFileSync(data).toString().split('\n').forEach(function (line) { 
	var fileOutput = '';
	if (line.includes('PokerStars Hand #')) { //New Round
		foundNewGame = true;
		fileOutput = "\nc";
		foundNewRound = true;
		finishedRound = false;
		currentPosition = 'pb';
		bettingStarted = false;
		preflop = false;
	}
	
	if (line.includes('Seat ') && isNormalInteger(line.substr(5,1)) && !finishedRound && foundNewRound){
		numPlayers++;
		//console.log(line);
		var stackSize = getStackFromLine(line);
		if(stackSize === undefined || stackSize < 0 || stackSize > 1500){
			console.log("*****************ERROR********************");
			console.log("STACK SIZE: " + stackSize);
		}
		if(roundNumber == 5){//Get the stack leader user name and use them for the rest of the game
			var tempUser = getUserFromLine(line);
			//console.log("Biggest Stack so far: " + biggestStack);
			//console.log("USER: " + tempUser);
			//console.log("STACK: " + stackSize);
			if(parseInt(stackSize) >  parseInt(biggestStack)) {
				currentUser = tempUser;
				//console.log("BEST USER: " + currentUser);
			}
			
		}
		smallestStack = (stackSize < smallestStack ? stackSize : smallestStack);
		biggestStack = (stackSize > biggestStack ? stackSize : biggestStack);
		//console.log(currentUser);
		
	}
	if(line.includes(currentUser) && currentUser != ''){
		if (line.includes('posts small blind')){
			currentPosition = 'psb';
			currentSmallBlind = getSmallBlindFromLine(line);
		}
		else if (line.includes('posts big blind')){
			currentPosition = 'pbb';
			currentBigBlind = getBigBlindFromLine(line);
		}		
	}
	if(line.includes("*** HOLE CARDS ***") && currentUser != ''){
		bettingStarted = true;
		preflop = true;
		fileOutput = numPlayers + " " + currentPosition;
	}
	if(bettingStarted && preflop == true && (line.includes("calls") || line.includes("bets") || line.includes("raises") || line.includes("folds"))){
		fileOutput = getPreflopAction(line, currentUser, currentBigBlind);
	}
	if(line.includes('*** SUMMARY ***')){
		roundNumber++;
		numPlayers = 0;
		biggestStack = 0;
		smallestStack = 9999;
		finishedRound = true;
		foundNewRound = false;
	}
	if ((fileOutput != '' && currentUser != '') || (roundNumber == 5 && fileOutput != '')){
		fs.appendFileSync('data/spin/refined/data.txt', fileOutput + ' ');
	}
	
});


function getStackFromLine(lineVar){
	if (lineVar.includes('(') && lineVar.includes(' in chips)')){
		var stackSize = lineVar.split(" ")[3].match(/\d/g).join("");
	}
	//console.log("STACK SIZE: " + stackSize);
	return stackSize;
}

function getUserFromLine(lineVar){
	var username = lineVar.split(" ")[2];
	return username;
}

function isNormalInteger(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function getBigBlindFromLine(lineVar){
	var bigBlind = lineVar.split(" ")[4];
	if(!isNormalInteger(bigBlind) || parseInt(bigBlind) > 1500 || parseInt(bigBlind <= 0)){
		console.log("*********ERROR*******");
		console.log("Big Blind is incorrect");
	} 	
	return parseInt(bigBlind);
}
function getSmallBlindFromLine(lineVar){
	var smallBlind = lineVar.split(" ")[4];
	if(!isNormalInteger(smallBlind) || smallBlind > 1500 || smallBlind <= 0){
		console.log("*********ERROR*******");
		console.log("small Blind is incorrect");
	}
	return parseInt(smallBlind);
}

function getPreflopAction(lineVar, currentUserVar, bigBlindVar){
	var fileOutput = '';
	if(lineVar.includes(currentUserVar)){
		fileOutput += 'm';
	}
	else {
		fileOutput += 'o';
	}
	
	if(line.includes("raises")){
		getPreflopRaise(lineVar, bigBlindVar);
	}
	else if (line.includes("calls")){
		fileOutput += 'c';
	}
	else if(line.includes("folds")){
		
	}
	else if (line.includes("bets")){
		
	}
	else if (line.includes("Uncalled bet")){
		
	}
	
}
