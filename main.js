var PokerEvaluator = require("poker-evaluator");
var prompt = require('prompt');

i = 0;
while(true){
	if (i == 0){
		prompt.get(['cards'], function (err, result) {
			// 
			// Log the results. 
			// 
			cards = result.cards.match(/.{1,2}/g);
			console.log(cards);
			console.log(PokerEvaluator.evalHand(cards));
		});
	}
	break;
}
      