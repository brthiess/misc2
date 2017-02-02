function Game(){
	this.percentile = 0;
	this.numRuns = 0;
	this.percentileAggregate = 0;
	this.communityHand = new Hand.Hand(5);
	this.hand = new Hand.Hand(2);
	this.reset = false;
	this.handState = 'f';  //Start at flop (f), goes to turn (t), then to river (r)
}

Game.prototype.setCommunityHand = function(cards){
	this.communityHand.fillSpecified(cards);
	this.numRuns = 0;
	this.percentile = 0;
	this.percentileAggregate = 0;
	
	if(this.handState == 'f'){
		this.handState = 't'
	}
	else if (this.handState == 't') {
		this.handState = 'r';
	}
	else if (this.handState == 'r'){
		this.handState = 'f';
	}
}

Game.prototype.setHand = function(cards){
	this.hand.fillSpecified(cards);
}

Game.prototype.resetGame = function(){
	this.percentile = 0;
	this.numRuns = 0;
	this.percentileAggregate = 0;
	this.communityHand = new Hand.Hand(5);
	this.hand = new Hand.Hand(2);
	this.reset = true;
	this.handState = 'f'
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
	//console.log("My Winning Percentage: " + myWinningPercentage);
	//2. Go through all other hole cards and get their winning percentage
	var numGames = 0;
	var rank = 0;
	var numTested = 0;
	deck.reshuffle();
	deck.removeCards(this.hand);

	for(var i = 0; i < 10; i++){					
		opponentCards = [deck.getRandomCard(), deck.getRandomCard()];
		opponentHand = new Hand.Hand(2);
		opponentHand.fillSpecified(opponentCards);
		
		winningPercentage = getWinningPercentage(opponentHand, this.communityHand);
		
		if (winningPercentage <= myWinningPercentage) {
			rank += 1;
		}
		
		//console.log(opponentHand);
		//console.log(winningPercentage);

		
		numTested++;
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
	if(this.reset == false){
		setTimeout(function(){ self.calculatePercentile();}, 100);
	}
	else {
		this.percentile = 0;
		this.numRuns = 0;
		this.percentileAggregate = 0;
		this.communityHand = new Hand.Hand(5);
		this.hand = new Hand.Hand(2);
		this.reset = false;
	}
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
	var numSimulations = 1200;
	for(var n = 0; n < numSimulations; n++){
		deck.reshuffle();
		deck.removeCards(hand);
		deck.removeCards(communityHand);
		//1. Fill up community hand with random cards from deck (if necessary)
		communityHandClone = communityHand.clone();
		for(var j = 0; j < 5 - communityHandClone.getNumberOfCardsInHand(); i++){				
			communityHandClone.addCard(deck.getRandomCard());					
		}
		
		
		//2. Get opponent cards
		opponentCards = [deck.getRandomCard(), deck.getRandomCard()];
		var opponentHand = new Hand.Hand(2);
		opponentHand.fillSpecified(opponentCards);
		
		
		game = isBestHand(hand, opponentHand, communityHandClone);
		
		if(game == 1){
			numWins++;
		}
		else {
			/*
			console.log("\n\n");
			console.log("HAND: ");
			console.log(hand);
			console.log("Opponent");
			console.log(opponentHand);
			console.log("Community");
			console.log(communityHandClone);
			*/
		}
	}
	//console.log("WINNING PERCENTAGE");
	//console.log(numWins * 1.0 / numSimulations * 1.0);
	return numWins * 1.0 / numSimulations * 1.0;
}

module.exports.Game = Game;