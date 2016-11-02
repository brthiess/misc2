var PokerEvaluator = require("poker-evaluator");

function calculatePercentile(hand, communityHand){
	deck = new Deck.Deck();

	deck.removeCards(hand);
	var numWins = 0;	
	
	myWinningPercentage = getWinningPercentage(hand, communityHand);
	
	//2. Go through all other hole cards and get their winning percentage
	var numGames = 0;
	var rank = 0;
	var numTested = 0;
	deck.reshuffle();
	deck.removeCards(hand);

	for(var i = 0; i < deck.getNumCards(); i++){
		for(var j = i + 1; j < deck.getNumCards(); j++){					
			
			opponentCards = [deck.getRandomCard(), deck.getRandomCard()];
			opponentHand = new Hand.Hand(2);
			opponentHand.fillSpecified(opponentCards);
			
			
			winningPercentage = getWinningPercentage(opponentHand, communityHand);
			
			if (winningPercentage < myWinningPercentage) {
				rank += 1;
			}
			numTested++;
			//std::cout<<"\nWinning Percentage:";
			//std::cout<<winningPercentage << "\n\n";
			deck.reshuffle();
			deck.removeCards(hand);
		}
	}
			
	//4. Repeat		
	return rank / numTested;
	
}

function isBestHand(hand, opponentHand, communityHand){
	myValue = PokerEvaluator.evalHand(hand.cards.concat(communityHand.cards));
	opponentValue = PokerEvaluator.evalHand(opponentHand.cards.concat(communityHand.cards));
	
	if (myValue.value > opponentValue.value){
		return 1;
	}
	else if (myValue.value == opponentValue.value){
		return 0;
	}
	else {
		return -1;
	}
}


function getWinningPercentage(hand, communityHand){
	deck = new Deck.Deck();
	
	var numWins = 0;
	var numSimulations = 100;
	for(var n = 0; n < numSimulations; n++){
		deck.reshuffle();
		deck.removeCards(hand);
		//1. Fill up community hand with random cards from deck (if necessary)
		communityHandClone = communityHand.clone();
		for(var j = 0; j < 5 - communityHandClone.getNumberOfCardsInHand(); i++){				
			communityHandClone.addCard(deck.getRandomCard());					
		}
		
		
		//2. Get opponent cards
		opponentCards = [deck.getRandomCard(), deck.getRandomCard()];
		opponentHand = new Hand.Hand(2);
		opponentHand.fillSpecified(opponentCards);
		
		
		game = isBestHand(hand, opponentHand, communityHandClone);
		
		if(game == 1){
			numWins++;
		}
	}
	return numWins * 1.0 / numSimulations * 1.0;
}

module.exports.calculatePercentile = calculatePercentile;