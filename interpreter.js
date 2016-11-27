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
usersContributions = {};


fs.readFileSync(data).toString().split('\n').forEach(function (line) { 
	var fileOutput = '';
	if(line.includes('***NEW GAME***')){ //NEW GAME
		foundNewGame = true;
		fileOutput = '';
		preflop = false;
		postflop = false;
		roundNumber = 0;
		finishedGame = false;
		currentUser = '';
	}
	if (line.includes('PokerStars Hand #')) { //New Round
		foundNewGame = true;
		//fileOutput = "\nc";
		foundNewRound = true;
		finishedRound = false;
		currentPosition = 'pb';
		bettingStarted = false;
		preflop = false;
		postflop = false;
		usersContributions = {};
		handNumber = line.split(" ")[2];
		console.log("\n\n***********************\n" + handNumber + "\n******************");
		//fileOutput = "\n\n***********************\n" + handNumber + "\n**********************\n";
		printToFile = true;
		currentBigBlind = 0;
		myStack = 0;
		cantPlay = false;
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
		//console.log("STACK SIZE: " + stackSize);
		//console.log("SMALLEST STACK BEFORE: " + smallestStack);
		smallestStack = (stackSize < smallestStack ? stackSize : smallestStack);
		//console.log("SMALLEST :" + smallestStack);
		biggestStack = (stackSize > biggestStack ? stackSize : biggestStack);
		var tempUser = getUserFromLine(line);
		if(currentUser != '' && tempUser == currentUser){
			myStack = stackSize;
			//console.log("MY STACK: " + myStack);
		}
	
		//console.log("CURRENT USER: " + currentUser);
		
	}
	if(line.includes('posts small blind') && !bettingStarted){ //Get users small blind contribution
		var smallBlindTemp = getSmallBlindFromLine(line);
		var userTemp = getUserFromBlindLine(line);
		usersContributions[userTemp] = smallBlindTemp;
		//console.log("USER: " + userTemp);
		//console.log("CONTRIB: " + smallBlindTemp);
		//console.log(usersContributions);
	}
	if(line.includes('posts big blind') && !bettingStarted){ //Get users big blind contribution
		var bigBlindTemp = getBigBlindFromLine(line);
		var userTemp = getUserFromBlindLine(line);		
		usersContributions[userTemp] = bigBlindTemp;
		//console.log("USER: " + userTemp);
		//console.log("CONTRIB: " + bigBlindTemp);
		//console.log(usersContributions);
	}
	if(line.includes("posts big blind")){
		currentBigBlind = getBigBlindFromLine(line);
	}
	if(line.includes(currentUser) && currentUser != ''){
		if (line.includes('posts small blind')){
			currentPosition = 'psb';
			currentSmallBlind = getSmallBlindFromLine(line);
		}
		else if (line.includes('posts big blind')){
			currentPosition = 'pbb';
		}
		
		if(currentPosition == 'pbb' && myStack != 0 && currentBigBlind != 0 && (myStack <= currentBigBlind)){
			cantPlay = true;
		}
		else if (currentPosition == 'psb' && myStack != 0 && currentSmallBlind != 0 && (myStack <= currentSmallBlind)){
			console.log("CANT PLAY");
			cantPlay = true;
		}
	}
	if(line.includes("*** HOLE CARDS ***") && currentUser != ''){
		if(currentBigBlind == 0 || myStack == 0){
			console.log("ERROR FINDING BIG BLIND OR MY STACK");
			console.log("current big blind: " + currentBigBlind);
			console.log("myStack: " + myStack);
		}
		var stackSizeRelativeToBigBlind = getFileOutputStackSize(myStack, currentBigBlind);
		//console.log("Stack size relative to big blind: " + stackSizeRelativeToBigBlind);
		//console.log("CURRENT BIG bLIND: " + currentBigBlind);
		bettingStarted = true;
		preflop = true;
		fileOutput = "\nc " + numPlayers + " " +  stackSizeRelativeToBigBlind + " " + currentPosition;
		if(cantPlay){
			fileOutput += " d";
		}
	}
	if(line.includes("*** FLOP ***") && preflop == true && bettingStarted == true && !cantPlay){
		postflop = true;
		preflop = false;
		fileOutput = 'f'
	}
	if((line.includes("*** TURN ***") || line.includes("*** RIVER ***")) && postflop == true && !cantPlay){
		fileOutput = 'f'
	}
	if(bettingStarted && preflop == true && (line.includes(" calls ") || line.includes(" bets ") || line.includes(" raises ") || line.includes(" folds ") || line.includes(" checks "))){
		//console.log("\n\n" + line);
		//console.log("\nBEFORE");
		//console.log(usersContributions);
		fileOutput = getAction(line, currentUser, currentBigBlind, usersContributions);
		//console.log("AFTER");
		//console.log(usersContributions);
	}
	if(bettingStarted && postflop == true && (line.includes(" calls ") || line.includes(" bets ") || line.includes(" raises ") || line.includes(" folds ") || line.includes(" checks "))){
		currentPotSize = getPotSize(usersContributions);
		//console.log(usersContributions);
		//console.log("\n\n" + line);
		//console.log("\nBEFORE");
		//console.log(usersContributions);
		fileOutput = getAction(line, currentUser, currentPotSize, usersContributions);
		//console.log("AFTER");
		//console.log(usersContributions);
	}
	if(line.includes('*** SUMMARY ***')){
		roundNumber++;
		numPlayers = 0;
		biggestStack = 0;
		smallestStack = 9999;
		finishedRound = true;
		foundNewRound = false;
	}
	if ((fileOutput != '' && currentUser != '') || (roundNumber == 5 && fileOutput != '') || printToFile == true){
		fs.appendFileSync('data/spin/refined/data.txt', fileOutput + ' ');
		printToFile = false;
	}
	
});


function getStackFromLine(lineVar){
	if (lineVar.includes('(') && lineVar.includes(' in chips)')){
		var stackSize = lineVar.split(" ")[3].match(/\d/g).join("");
	}
	//console.log("STACK SIZE: " + stackSize);
	return parseInt(stackSize);
}

function getUserFromLine(lineVar){
	var username = lineVar.split(" ")[2];
	return username;
}
function getUserFromBlindLine(lineVar){
	var username = lineVar.split(" ")[0].replace(":", "");
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

function getAction(lineVar, currentUserVar, potBlind, usersContributions){
	var fileOutput = '';
	if(lineVar.includes(currentUserVar)){
		fileOutput += 'm';
	}
	else {
		fileOutput += 'o';
	}
	
	if(lineVar.includes(" raises ")){
		raise = getPreflopRaise(lineVar, potBlind);
		var amountToCall = getRaiseToCall(lineVar);
		var tempUser = getUserFromActionLine(lineVar);
		if(usersContributions[tempUser] !== undefined){
			usersContributions[tempUser] += (amountToCall - usersContributions[tempUser]);
		}
		else {
			usersContributions[tempUser] = amountToCall;
		}
		fileOutput += 'r' + raise;
	}
	else if (lineVar.includes(" calls ")){
		fileOutput += 'c';
		var callAmount = getCallAmount(lineVar);
		var tempUser = getUserFromActionLine(lineVar);
		if(usersContributions[tempUser] !== undefined){
			usersContributions[tempUser] += callAmount;
		}
		else {
			usersContributions[tempUser] = callAmount;
		}
	}
	else if(lineVar.includes(" folds ")){
		fileOutput += 'f';
	}
	else if (lineVar.includes(" bets ")){		
		var betAmount = getBetAmount(lineVar);
		var tempUser = getUserFromActionLine(lineVar);
		if(usersContributions[tempUser] !== undefined){
			usersContributions[tempUser] += betAmount;
		}
		else {
			usersContributions[tempUser] = betAmount;
		}
		var betAmountInPots = betAmount / potBlind;
		if(betAmountInPots < 0.8 && betAmountInPots > 0){
			betAmountInPots = 0.5;
		}
		else if (betAmountInPots >= 0.8 && betAmountInPots < 1.5){
			betAmountInPots = 1;
		}
		if(lineVar.includes("is all-in")){
			betAmountInPots = 'a';
		}
		fileOutput += 'r' + betAmountInPots;
	}
	else if (lineVar.includes("Uncalled bet")){
		
	}
	else if (lineVar.includes(" checks ")){
		fileOutput += 'ch';
	}
	return fileOutput;
}

function getPreflopRaise(lineVar, potBlind){
	raiseAmount = parseInt(lineVar.split(" ")[2]);
	if(!isNormalInteger(raiseAmount) || raiseAmount < 0 || raiseAmount > 1500){
		console.log("**************ERROR*****************")
		console.log("Incorrect Preflop Raise Amount");
	}
	numberOfBigBlinds = raiseAmount / potBlind;
	if(!isNormalInteger(numberOfBigBlinds)) {
		console.log("**************ERROR*************");
		console.log("INCORRECT NUMBER OF BLINDS");
	}
	if(lineVar.includes("is all-in")){
		numberOfBigBlinds = 'a';
	}
	if(numberOfBigBlinds < 0.8 && numberOfBigBlinds > 0){
		numberOfBigBlinds = 0.5;
	}
	else if (numberOfBigBlinds >= 0.8 && numberOfBigBlinds < 1.5){
		numberOfBigBlinds = 1;
	}
	return numberOfBigBlinds;
}
function getPotSize(usersContributions){
	var potSize = 0;
	for(var key in usersContributions){
		potSize += usersContributions[key];
	}
	if(!isNormalInteger(potSize) || potSize > 4500 || potSize < 0){
		console.log("************** ERROR *************");
		console.log("POT SIZE ERROR");
	}
	return potSize;
}

function getCallAmount(lineVar){
	var callAmount = lineVar.split(" ")[2];
	if(!isNormalInteger(callAmount) || callAmount > 1500 || callAmount < 0){
		console.log("************** ERROR *************");
		console.log("CALL AMOUNT ERROR");
	}
	return parseInt(callAmount);
}
function getBetAmount(lineVar){
	var betAmount = lineVar.split(" ")[2];
	if(!isNormalInteger(betAmount) || betAmount > 1500 || betAmount < 0){
		console.log("************** ERROR *************");
		console.log("BET AMOUNT ERROR");
	}
	return parseInt(betAmount);
}
function getUserFromActionLine(lineVar){
	return lineVar.split(" ")[0].replace(":", "");
}

function getRaiseToCall(lineVar){
	var callAmount = lineVar.split(" ")[4];
	if(!isNormalInteger(callAmount) || callAmount > 1500 || callAmount < 0){
		console.log("************** ERROR *************");
		console.log("RAISE TO CALL AMOUNT ERROR");
	}
	return parseInt(callAmount);
}

function getFileOutputStackSize(stack, bigBlind){
	if((stack / bigBlind) < 9 ){
		return 'ss';
	}
	else if (stack / bigBlind < 20){
		return 'sm';
	}
	else if (stack / bigBlind < 75) {
		return 'sl';
	}
	else {
		console.log("Stack / BigBlind error");
	}
}