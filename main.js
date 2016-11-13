Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var prompt = require('prompt');
var Game = require('./game');
var Tree = require('./tree');

var tree = new Tree.Tree('data.txt', startLoop);

currentPercentile = 0;
//Initialize empty hand and community hand
hand = new Hand.Hand(2);
communityHand = new Hand.Hand(5);
action = 'getCurrentNode';


function startLoop(){
	game = new Game.Game();
	goThroughOptions('getCurrentNode', game);
}

function goThroughOptions(action, game){
	if(action == 'getCurrentNode'){
		currentNode = tree.getCurrentNode();
		currentNodeName = currentNode.name;
		console.log(currentNodeName);
		if(currentNodeName = 'c'){
			action = 'getHoleCards';
		}
		else if (currentNodeName == 'f'){
			action = 'getCommunityCards';
		}
		else {
			action = 'displayChildren';
		}
	}
	if (action == 'displayChildren'){
		console.log("Children:");
		console.log(tree.getChildren());
		action = 'navigateToNextNode';
	}
	if (action == 'navigateToNextNode'){
		prompt.get(['nextNode'], function (err, result){
			tree.navigateToNextNode(result.nextNode);
			process.nextTick(function(){goThroughOptions('getCurrentNode', game);});
		});
		
	}
	if (action == 'getHoleCards') {
		prompt.get(['cards'], function (err, result) {
			cards = result.cards.match(/.{1,2}/g);
			game.setHand(cards);
			process.nextTick(function(){goThroughOptions('displayChildren');});
			process.nextTick(function(){goThroughOptions('updatePercentile', game);});
		});
		
	}
	if(action == 'getCommunityCards'){//Get hole cards 
		prompt.get(['cards'], function (err, result) {
			cards = result.cards.match(/.{1,2}/g);
			process.nextTick(function(){game.setCommunityHand(cards);});
		});
		goThroughOptions('displayChildren');
	}

	if(action == 'updatePercentile'){
		game.calculatePercentile();
	}
}
      