function Game(){
	this.percentile = 0;
	this.numRuns = 0;
	this.percentileAggregate = 0;
	this.communityHand = new Hand.Hand(5);
	this.hand = new Hand.Hand(2);
	this.reset = false;
}

Game.prototype.setCommunityHand = function(cards){
	this.communityHand.fillSpecified(cards);
	this.reset = true;
}

Game.prototype.setHand = function(cards){
	this.hand.fillSpecified(cards);
}


Game.prototype.getPercentile = function(){
	return this.percentile;
}

var PokerEvaluator = require("poker-evaluator");

Game.prototype.calculatePercentile = function(){	
	this.numRuns += 1;
	deck = new Deck.Deck();
	deck.removeCards(this.hand);
	var numWins = 0;	
	myWinningPercentage = getWinningPercentage(this.hand, this.communityHand);
	
	//2. Go through all other hole cards and get their winning percentage
	var numGames = 0;
	var rank = 0;
	var numTested = 0;
	deck.reshuffle();
	deck.removeCards(this.hand);

	for(var i = 0; i < 50; i++){					
		opponentCards = [deck.getRandomCard(), deck.getRandomCard()];
		opponentHand = new Hand.Hand(2);
		opponentHand.fillSpecified(opponentCards);
		
		winningPercentage = getWinningPercentage(opponentHand, this.communityHand);
		
		if (winningPercentage < myWinningPercentage) {
			rank += 1;
		}
		numTested++;
		//std::cout<<"\nWinning Percentage:";
		//std::cout<<winningPercentage << "\n\n";
		deck.reshuffle();
		deck.removeCards(this.hand);
	}
			
	newPercentile = rank / numTested;
	//console.log("\n\n**********************\nNew Percentile: " + newPercentile);
	//console.log("Num Runs: " + this.numRuns);
	this.percentile = (newPercentile + this.percentileAggregate) / this.numRuns;
	this.percentileAggregate += newPercentile;
	//console.log("Avg Percentile: " + this.percentile);
	var self = this;
	//console.log(this.numRuns);
	setTimeout(function(){ self.calculatePercentile();}, 100);
	//console.log("New Percentile: " + newPercentile);
	//console.log("Num Runs: " + this.numRuns);
	//console.log("Aggregate: " + this.percentileAggregate);
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
	var numSimulations = 200;
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

module.exports.Game = Game;