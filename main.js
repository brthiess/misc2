Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var prompt = require('prompt');
var Game = require('./game');
var Tree = require('./tree');

const actionRankings = ['ra', 'r3', 'r2', 'r1', 'r0.5', 'c', 'f', 'ch'];
const actionTranslator = {ra: 'All in', r3: 'Raise 3x', r2: 'Raise 2x', r1: 'Raise 1x', 'r0.5': 'Raise Half', 'c': 'Call', 'f': 'Fold', 'ch': 'Check'};


var tree = new Tree.Tree('data/spin/refined/data.txt', startLoop);

currentPercentile = 0;
//Initialize empty hand and community hand
hand = new Hand.Hand(2);
communityHand = new Hand.Hand(5);
action = 'getCurrentNode';


function startLoop(){
	game = new Game.Game();
	goThroughOptions('getCurrentNode', game, tree);
}

function goThroughOptions(action, game, tree){
	if(action == 'getCurrentNode'){
		currentNode = tree.getCurrentNode();
		currentNodeName = currentNode.name;
		if(currentNodeName == 'c'){
			action = 'getHoleCards';
		}
		else if (currentNodeName == 'f'){
			action = 'getCommunityCards';
		}
		else if (nextNodeIsMe(tree)){
			process.nextTick(function(){goToBestAction(tree, game);});
		}
		else {
			action = 'displayChildren';
		}
	}
	if (action == 'displayChildren'){
		tree.displayChildren();
		action = 'navigateToNextNode';
	}
	if (action == 'navigateToNextNode'){
		prompt.get(['nextNode'], function (err, result){
			if(result.nextNode == 'r'){
				tree.navigateToRoot();
				game.resetGame();
				
				process.nextTick(function(){goThroughOptions('getCurrentNode', game, tree);});
			}
			else if (tree.navigateToNextNode(parseInt(result.nextNode))){
				process.nextTick(function(){goThroughOptions('getCurrentNode', game, tree);});
			}
			else {
				process.nextTick(function(){goThroughOptions('displayChildren', game, tree);});
			}
		});
	}
	if (action == 'getHoleCards') {
		prompt.get(['cards'], function (err, result) {
			var pattern = /^([2-9aqkjt][chsd]){1,3}$/;
			if(pattern.test(result.cards)) {
				cards = result.cards.match(/.{1,2}/g);				
				game.setHand(cards);
				process.nextTick(function(){goThroughOptions('updatePercentile', game, tree);});
				if(nextNodeIsMe(tree)){
					console.log("Calculating Best Move...");
					setTimeout(function(){goToBestAction(tree, game)}, 5000);
				}else {
					process.nextTick(function(){goThroughOptions('displayChildren', game, tree);});	
				}
				
			}else {
				console.log("Error Entering Cards.  Try Again");
				process.nextTick(function(){goThroughOptions('getCurrentNode', game, tree);});
			}
		});
		
	}
	if(action == 'getCommunityCards'){//Get hole cards 
		prompt.get(['flop'], function (err, result) {
			var pattern = /^([2-9aqkjt][chsd]){1,3}$/;
			if(pattern.test(result.flop)){
				cards = result.flop.match(/.{1,2}/g);
				process.nextTick(function(){game.setCommunityHand(cards);});
				if(nextNodeIsMe(tree)){
					console.log("Calculating Best Move...");
					setTimeout(function(){goToBestAction(tree, game)}, 5000);
				}else {
					goThroughOptions('displayChildren', game, tree);
				}
			}
			else {
				console.log("Error Entering Cards.  Try Again");
				process.nextTick(function(){goThroughOptions('getCurrentNode', game, tree);});
			}
		});
	}

	if(action == 'updatePercentile'){
		game.calculatePercentile();
	}
}

function nextNodeIsMe(tree){
	var children = tree.getChildren();
	for(var i = 0; i < children.length; i++){
		if(children[i].name.startsWith('m')){
			return true;
		}
	}
	return false;
}

function getBestAction(children, game){
	var currentPercentile = game.getPercentile();
	console.log("Current Percentile: " + currentPercentile);
	console.log("Children");
	console.log(children);
	var total = 0;
	actionPercentiles = [];
	for(var i = 0; i < children.length; i++){
		total += children[i].frequency;
	}
	var percentilePointer = total;
	for(var k = 0; k < actionRankings.length; k++){
		for(var i = 0; i < children.length; i++){
			if(actionRankings[k] == children[i].name.substr(1)){
				percentilePointer = percentilePointer - children[i].frequency;
				actionPercentile = {};
				actionPercentile.percentile = percentilePointer / total;
				actionPercentile.name = children[i].name.substr(1);
				actionPercentile.id = i;
				actionPercentiles.push(actionPercentile);
		
			}
		}
	}
	console.log(actionPercentiles);
	for(var i = 0; i < actionPercentiles.length; i++){
		if (currentPercentile >= actionPercentiles[i].percentile){
			console.log("\n**********************\nBEST ACTION: " + translateActionToHumanReadable(actionPercentiles[i].name));
			//console.log(actionPercentiles[i]);
			return actionPercentiles[i].id;
			break;
		}
	}
	//console.log(actionPercentiles);
}

function translateActionToHumanReadable(action){
	for(var actionKey in actionTranslator){
		if(actionKey == action){
			return actionTranslator[actionKey];
		}
	}
	return action; //No translation found
}

function goToBestAction(tree, game){
	//console.log(tree);
	var nextAction = getBestAction(tree.getChildren(), game);
	tree.navigateToNextNode(nextAction);
	process.nextTick(function(){goThroughOptions('getCurrentNode', game, tree);});
}
      