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
			tree.navigateToNextNode(parseInt(result.nextNode));
			process.nextTick(function(){goThroughOptions('getCurrentNode', game, tree);});
		});
	}
	if (action == 'getHoleCards') {
		prompt.get(['cards'], function (err, result) {
			cards = result.cards.match(/.{1,2}/g);
			game.setHand(cards);
			process.nextTick(function(){goThroughOptions('displayChildren', game, tree);});
			process.nextTick(function(){goThroughOptions('updatePercentile', game, tree);});
		});
		
	}
	if(action == 'getCommunityCards'){//Get hole cards 
		prompt.get(['flop'], function (err, result) {
			cards = result.flop.match(/.{1,2}/g);
			process.nextTick(function(){game.setCommunityHand(cards);});
			goThroughOptions('displayChildren', game, tree);
		});
	}

	if(action == 'updatePercentile'){
		game.calculatePercentile();
	}
}
      