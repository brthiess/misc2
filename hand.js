function Hand(maxHandSize) {
	this.cards = [];
	this.maxHandSize = maxHandSize;
	
}

Hand.prototype.fillRandom = function() {
	for(i = this.cards.length; i < this.maxHandSize; i++) {
		this.cards.push(randomCard());
	}
};

Hand.prototype.addCard = function(card){
	this.cards.push(card);
}


Hand.prototype.fillSpecified = function(cards){
	for(i = 0; i < cards.length; i++) {
		this.cards.push(cards[i]);
	}
}

Hand.prototype.clone = function(){
	clone = new Hand(5);
	clone.fillSpecified(this.cards);
	return clone;
}

Hand.prototype.reset = function(){
	this.cards = [];
}
		
Hand.prototype.getNumberOfCardsInHand = function(){
	return this.cards.length;
}

Hand.prototype.getCard = function(cardNumber){
	return this.cards[cardNumber];
}

Hand.prototype.printHand = function(){
	console.log(this.cards);
}
module.exports.Hand = Hand;