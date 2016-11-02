Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var prompt = require('prompt');

var game = require('./game');

i = 0;
while(true){
	hand = new Hand.Hand(2);
	communityHand = new Hand.Hand(5);
	if (i == 0){
		prompt.get(['cards'], function (err, result) {
			// 
			// Log the results. 
			// 
			cards = result.cards.match(/.{1,2}/g);
			hand.fillSpecified(cards);
			console.log(game.calculatePercentile(hand, communityHand));
		});
	}
	break;
}
      