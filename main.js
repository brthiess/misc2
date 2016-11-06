Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var prompt = require('prompt');
var game = require('./game');
var Tree = require('./tree');

var tree = new Tree.Tree('data.txt', startLoop);
//Globals
currentPercentile = 0;
updatePercentile = false;


function startLoop(){
	//Initialize empty hand and community hand
	hand = new Hand.Hand(2);
	communityHand = new Hand.Hand(5);
	updatePercentile = false;
	console.log(tree.getCurrentNode());
	
	while(true){
		currentNode = tree.getCurrentNode();
		currentNodeName = currentNode.name;
		if(currentNodeName == 'c'){//Get hole cards 
			prompt.get(['cards'], function (err, result) {
				cards = result.cards.match(/.{1,2}/g);
				hand.fillSpecified(cards);
				updatePercentile = true;
			});
			currentNodeName = '';
		}
		if(currentNodeName == 'f'){//Get Community Hand Cards
			prompt.get(['cards'], function (err, result) {
				cards = result.cards.match(/.{1,2}/g);
				communityHand.fillSpecified(cards);
				updatePercentile = true;
			});
			currentNodeName = '';
		}
		
		if(updatePercentile == true){
			game.calculatePercentile(hand, communityHand, function(err, percentile){
				currentPercentile = percentile;
				console.log(currentPercentile);
			});
			updatePercentile = false;
		}
	}
	
}
      