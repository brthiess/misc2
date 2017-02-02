'use strict';
const dataFolder = 'data/spin/raw/100/';
const fs = require('fs');
var files = fs.readdirSync(dataFolder);


var startedPrinting = false;
//Clear file
fs.writeFileSync("data/spin/refined/100/data.txt", "");

//import top players
var heads_up_players = JSON.parse(fs.readFileSync('bin/top_heads_up_players.json', 'utf8'));
var best_heads_up_players = [];
var rankIter = 0;
for(var i = heads_up_players.length - 1; i > heads_up_players.length * 0.66; i--){
	rankIter++;
	best_heads_up_players[heads_up_players[i].name] = {name: heads_up_players[i].name, rank: rankIter};
}
//import top players
var rankIter = 0;
var threemax_players = JSON.parse(fs.readFileSync('bin/top_3max_players.json', 'utf8'));
var best_threemax_players = [];
for(var i = threemax_players.length - 1; i > threemax_players.length * 0.66; i--){
	rankIter++;
	best_threemax_players[threemax_players[i].name] = {name: threemax_players[i].name, rank: rankIter};
}



var users_already_used2 = [];
var users_already_used_temp2 = [];
var users_already_used3 = [];
var users_already_used_temp3 = [];


files.forEach(file => {
	users_already_used3 = [];

	users_already_used2 = [];
	for(var i = 0; i < 3; i++) {
		users_already_used_temp3 = [];
		users_already_used_temp2 = [];
		if(file.includes("hh.com")  && file.includes(".txt")){
			console.log(dataFolder + file);
			interpret(dataFolder + file);	
			for(var k = 0; k < users_already_used_temp3.length; k++){
				if(users_already_used3[users_already_used_temp3[k].gameId] === undefined){
					users_already_used3[users_already_used_temp3[k].gameId] = [];
				}
				if(users_already_used3[users_already_used_temp3[k].gameId].indexOf(users_already_used_temp3[k].username) < 0) {
					users_already_used3[users_already_used_temp3[k].gameId].push(users_already_used_temp3[k].username);
				}
				else {
					console.log("ERROR.  Already used this user in this 3 player game");
					console.log("GAME ID: " + users_already_used_temp3[k].gameId);
					console.log(users_already_used3[users_already_used_temp3[k].gameId]);
					console.log("\n\n");
				}
			}
			for(var k = 0; k < users_already_used_temp2.length; k++){
				if(users_already_used2[users_already_used_temp2[k].gameId] === undefined){
					users_already_used2[users_already_used_temp2[k].gameId] = [];
				}
				if(users_already_used2[users_already_used_temp2[k].gameId].indexOf(users_already_used_temp2[k].username) < 0) {
					users_already_used2[users_already_used_temp2[k].gameId].push(users_already_used_temp2[k].username);
				}
				else {
					console.log("ERROR.  Already used this user in this 2 player game");
					console.log("GAME ID: " + users_already_used2[users_already_used_temp2[k].gameId]);
					console.log(users_already_used2[users_already_used_temp2[k].gameId]);
					console.log("\n\n");
				}
			}
		}
	}
});




function compare(a,b) {
  if (a.rank  < b.rank)
    return -1;
  if (a.rank > b.rank)
    return 1;
  return 0;
}


function interpret(data){
	var currentUser = ''
	var finishedRound = false;
	var foundNewRound = false;
	var finishedGame = false;
	var foundNewGame = false;
	var numPlayers = 0;
	var biggestStack = 0;
	var smallestStack = 9999;
	var currentBigBlind = 0;
	var currentSmallBlind = 0;
	var currentCallingSize = 0;
	var currentPotSize = 0;
	var usersContributions = {};
	var seatPattern = /Seat [0-9]: /;
	var currentPosition = 'pb';
	var handNumber = '';
	var myStack;
	var current2User = '';
	var current3User = '';
	var cantPlay = false;
	var preflop = false;
	var postflop = false;
	var bettingStarted = false;
	var printToFile = false;
	var tempUser2RankArr = [];
	var tempUser3RankArr = [];
	var gameId;
	var best2Rank = 9999999999;
	var best3Rank = 9999999999;
	var current2Stack = 0;
	var current3Stack = 0;
	var biggestUserStack;
	

	fs.readFileSync(data).toString().split('\n').forEach(function (line) {
		var fileOutput = '';
	
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
			//console.log("\n\n**************\n" + handNumber + "\n**************");
			//fileOutput = "\n\n***********************\n" + handNumber + "\n**********************\n";
			printToFile = false;
			currentSmallBlind = 0;
			currentBigBlind = 0;
			myStack = 0;
			currentUser = '';
			current2User = '';
			current3User = '';
			numPlayers = 0;
			cantPlay = false;
			tempUser2RankArr = [];
			tempUser3RankArr = [];
			gameId = line.split(" ")[2];
			best2Rank = 9999999999;
			best3Rank = 9999999999;
			current2Stack = 0;
			current3Stack = 0;
		}

		if (line.includes('Seat ') && isNormalInteger(line.substr(5,1)) && !finishedRound && foundNewRound){
			//console.log("\n******LINE*********");
			//console.log(line);
			numPlayers++;
			//console.log(line);
			var stackSize = getStackFromLine(line, gameId);
			if(stackSize === undefined || stackSize < 0 || stackSize > 1500){
				console.log("*****************ERROR********************");
				console.log("STACK SIZE: " + stackSize);
			}
	
			var tempUser2 = getUserFromLine(line, 2, gameId); //Only returns user if they are in the top of heads up
			//console.log("2USER: " + tempUser2);
			if(tempUser2 != ''){
				var tempUser2Rank = getRankFromUser(tempUser2, 2);
				//console.log("2RANK: " + tempUser2Rank);
				if (tempUser2Rank < best2Rank){
					best2Rank = tempUser2Rank;
					current2User = tempUser2;
					current2Stack = getStackFromLine(line, gameId);
				}
			}
			
			var tempUser3 = getUserFromLine(line, 3, gameId); //Only returns user if they are in the top of 3max
			//console.log("3USER: " + tempUser3);
			if(tempUser3 != ''){
				var tempUser3Rank = getRankFromUser(tempUser3, 3);
				//console.log("3RANK: " + tempUser3Rank);
				if (tempUser3Rank < best3Rank){
					best3Rank = tempUser3Rank;
					current3User = tempUser3;
					current3Stack = getStackFromLine(line, gameId);
				}
			}
			
				
		
			//console.log("STACK SIZE: " + stackSize);
			//console.log("SMALLEST STACK BEFORE: " + smallestStack);
			smallestStack = (stackSize < smallestStack ? stackSize : smallestStack);
			//console.log("SMALLEST :" + smallestStack);
			var tempUser = getUserFromLine(line);
			if(stackSize > biggestStack) {
				biggestStack = stackSize;
				biggestUserStack = tempUser;
				//console.log("biggestUserStack: " + biggestUserStack);
			}
			
			if(currentUser != '' && tempUser == currentUser){
				myStack = stackSize;
				//console.log("MY STACK: " + myStack);
			}
		
			//console.log("CURRENT USER: " + currentUser);
			
		}
		
		if(line.includes('posts small blind') && !bettingStarted){ //Get users small blind contribution
			//Get current user
			if(numPlayers == 2){
				if(current2User != ''){
					currentUser = current2User;
					users_already_used_temp2.push({username: current2User, gameId: gameId});
					myStack = current2Stack;
				}
				if(currentUser != '' && best_heads_up_players[currentUser] === undefined) {
					console.log("*****************ERROR************");
					console.log("BAD heads up USER");
					console.log("USER: " + currentUser);
				}
			}
			else if(numPlayers == 3){
				if(current3User != ''){
					currentUser = current3User;
					users_already_used_temp3.push({username: current3User, gameId: gameId});
					myStack = current3Stack;
				}
				//console.log(currentUser);
				if(currentUser != '' && best_threemax_players[currentUser] === undefined) {
					console.log("*****************ERROR************");
					console.log("BAD 3max USER");
					console.log("USER: " + currentUser);
					
			
				}
			}
			//console.log("CURRENT USER: " + currentUser);
			var biggestStackPosition;
			var smallBlindTemp = getSmallBlindFromLine(line);
			var userTemp = getUserFromBlindLine(line);
			usersContributions[userTemp] = smallBlindTemp;
			if(userTemp == biggestUserStack){
				biggestStackPosition = 'psb';
			}
			//console.log("USER: " + userTemp);
			//console.log("CONTRIB: " + smallBlindTemp);
			//console.log(usersContributions);
		}
		if(line.includes('posts big blind') && !bettingStarted){ //Get users big blind contribution
			var bigBlindTemp = getBigBlindFromLine(line, currentSmallBlind, gameId);
			var userTemp = getUserFromBlindLine(line);		
			usersContributions[userTemp] = bigBlindTemp;
			if(userTemp == biggestUserStack){
				biggestStackPosition = 'pbb';
			}
			//console.log("USER: " + userTemp);
			//console.log("CONTRIB: " + bigBlindTemp);
			//console.log(usersContributions);
		}
		if(line.includes("posts big blind")){
			currentBigBlind = getBigBlindFromLine(line, currentSmallBlind, gameId);
		}
		if(line.includes("posts small blind")){
			currentSmallBlind = getSmallBlindFromLine(line);
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
				cantPlay = true;
			}
		}
		if(line.includes("*** HOLE CARDS ***") && currentUser != '' && currentUser !== undefined){
			if(currentBigBlind == 0 || myStack == 0){
				console.log("ERROR FINDING BIG BLIND OR MY STACK");
				console.log("current big blind: " + currentBigBlind);
				console.log("myStack: " + myStack);
			}
			var stackSizeRelativeToBigBlind = getFileOutputStackSize(myStack, currentBigBlind, gameId);
			//console.log("Stack size relative to big blind: " + stackSizeRelativeToBigBlind);
			//console.log("CURRENT BIG bLIND: " + currentBigBlind);
			bettingStarted = true;
			preflop = true;
			if(startedPrinting == true){
				fileOutput = "\n";
			}
			else {
				fileOutput = "";
			}
			fileOutput += numPlayers + " " +  stackSizeRelativeToBigBlind + " " + currentPosition + " " + "c" + " ";
			if(cantPlay){
				fileOutput += " d";
			}
			startedPrinting = true;
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
			currentPotSize = getPotSize(usersContributions);
			//console.log("\n\n" + line);
			//console.log("\nBEFORE");
			//console.log(usersContributions);
			fileOutput = getAction(line, currentUser, currentPotSize, usersContributions);
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
			numPlayers = 0;
			biggestStack = 0;
			smallestStack = 9999;
			finishedRound = true;
			foundNewRound = false;
		}
		if ((fileOutput != '' && currentUser != '') || printToFile == true){
			//console.log(fileOutput);
			fs.appendFileSync('data/spin/refined/100/data.txt', fileOutput + ' ');
			printToFile = false;
		}
	});
}
function getStackFromLine(lineVar, gameId){
	if (lineVar.includes('(') && lineVar.includes(' in chips)')){
		try {
			var stackSize = lineVar.split(" ")[3].match(/\d/g).join("");
		}
		catch(e) {
			console.log(lineVar);
			console.log(gameId);
		}
	}
	//console.log("STACK SIZE: " + stackSize);
	return parseInt(stackSize);
}
function getRankFromUser(user, numPlayers){
	if(numPlayers == 2){
		return best_heads_up_players[user].rank;
	}
	else if(numPlayers == 3){
		return best_threemax_players[user].rank;
	}
}
function getUserFromLine(lineVar, numPlayers, gameId){
	var username = lineVar.split(" ")[2];

	if(numPlayers == 2){
		if(best_heads_up_players[username] !== undefined && ((users_already_used2[gameId] === undefined) || (users_already_used2[gameId] !== undefined && !isInArray(username, users_already_used2[gameId])))){
			return username;
		}
	}
	if(numPlayers == 3){
		if(best_threemax_players[username] !== undefined  && ((users_already_used3[gameId] === undefined) || (users_already_used3[gameId] !== undefined && !isInArray(username, users_already_used3[gameId])))){
			return username;
		}
	}
	if(numPlayers === undefined){
		return username;
	}
	//console.log("RETURNING blank username.  Username found: " + username);
	return '';
}
function getUserFromBlindLine(lineVar){
	var username = lineVar.split(" ")[0].replace(":", "");
	return username;
}

function isNormalInteger(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function getBigBlindFromLine(lineVar, smallBlind, gameId){
	var bigBlind = lineVar.split(" ")[4];
	if (parseInt(bigBlind) <= 19) {
		bigBlind = parseInt(smallBlind) * 2;
	}
	if(!isNormalInteger(bigBlind) || parseInt(bigBlind) > 1500 || parseInt(bigBlind) <= 19){
		console.log("*********ERROR*******");
		console.log("Big Blind is incorrect");
		console.log("big Blind: " + bigBlind);
		console.log(gameId);
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
		var raise = getPreflopRaise(lineVar, potBlind);
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
		if(lineVar.includes("is all-in")){
			betAmountInPots = 'a';
		}
		if(betAmountInPots < 0.65 && betAmountInPots > 0){
			betAmountInPots = 0.5;
		}
		else if (betAmountInPots >= 0.65 && betAmountInPots < 1.5){
			betAmountInPots = 1;
		}
		else if (betAmountInPots >= 1.5){
			betAmountInPots = Math.round(betAmountInPots);
		}
		if (betAmountInPots > 3){
			betAmountInPots = 2;
		}
		if(betAmountInPots == 3){
			betAmountInPots = 2;
		}
		if (betAmountInPots != 'a' && betAmountInPots != 0.5 && betAmountInPots != 1 && betAmountInPots != 2) {
			console.log("ERROR!.  Incorrect num of bet amounts");
			console.log(betAmountInPots);
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
	var raiseAmount = parseInt(lineVar.split(" ")[2]);
	if(!isNormalInteger(raiseAmount) || raiseAmount < 0 || raiseAmount > 1500){
		console.log("**************ERROR*****************")
		console.log("Incorrect Preflop Raise Amount");
	}
	var numberOfBigBlinds = raiseAmount / potBlind;
	if(!isNormalInteger(numberOfBigBlinds)) {
		console.log("**************ERROR*************");
		console.log("INCORRECT NUMBER OF BLINDS");
	}
	if(lineVar.includes("is all-in")){
		numberOfBigBlinds = 'a';
	}
	if (numberOfBigBlinds > 0.66 && numberOfBigBlinds < 0.67){
		numberOfBigBlinds = (Math.random() > 0.5 ? 1 : 0.5);
	}
	else if(numberOfBigBlinds < 0.66 && numberOfBigBlinds > 0){
		numberOfBigBlinds = 0.5;
		
	}
	else if (numberOfBigBlinds >= 0.66 && numberOfBigBlinds < 1.5){
		numberOfBigBlinds = 1;
	}
	if (numberOfBigBlinds > 3){
		numberOfBigBlinds = 2;
	}
	else if (numberOfBigBlinds >= 1.5){
		numberOfBigBlinds = Math.round(numberOfBigBlinds);
	}
	if(numberOfBigBlinds == 3){
		numberOfBigBlinds = 2;
	}
	if (numberOfBigBlinds != 'a' && numberOfBigBlinds != 0.5 && numberOfBigBlinds != 1 && numberOfBigBlinds != 2) {
		console.log("ERROR!.  Incorrect num of big blinds");
		console.log(numberOfBigBlinds);
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

function getFileOutputStackSize(stack, bigBlind, gameId){
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
		console.log("Stack: " + stack);
		console.log("Big Blind: " + bigBlind);
		console.log(gameId);
	}
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}