Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var prompt = require('prompt');
var game = require('./game');


//Globals
currentPercentile = 0;
updatePercentile = false;

//Initialize empty hand and community hand
hand = new Hand.Hand(2);
communityHand = new Hand.Hand(5);
hand.fillSpecified(['as', 'ah']);
updatePercentile = true;
while(true){
	/*currentNode = Tree.getCurrentNode();
	if(currentNode == 'c'){//Get hole cards 
		prompt.get(['cards'], function (err, result) {
			cards = result.cards.match(/.{1,2}/g);
			hand.fillSpecified(cards);
			updatePercentile = true;
		});
		currentNode = '';
	}
	if(currentNode == 'f'){//Get Community Hand Cards
		prompt.get(['cards'], function (err, result) {
			cards = result.cards.match(/.{1,2}/g);
			communityHand.fillSpecified(cards);
			updatePercentile = true;
		});
		currentNode = '';
	}
	*/
	if(updatePercentile == true){
		game.calculatePercentile(hand, communityHand, function(err, percentile){
			currentPercentile = percentile;
			console.log(currentPercentile);
		});
		updatePercentile = false;
	}
	break;
}
      