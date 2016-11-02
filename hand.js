function Hand(maxHandSize) {
	
	this.cards = [];
	this.maxHandSize = maxHandSize;
	
}

Hand.prototype.fillRandom = function() {
	for(i = this.cards.length; i < this.maxHandSize; i++) {
		this.cards.push(randomCard());
	}
};

Hand.prototype.fillSpecified = function(cards){
	for(i = 0; i < cards.length; i++) {
		this.cards.push(cards[i]);
	}
}

Hand.prototype.reset = function(){
	this.cards = [];
}
		
