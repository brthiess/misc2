function Deck(){
	this.cards = [
    "2c",
    "2d",
    "2h",
    "2s",
    "3c",
    "3d",
    "3h",
    "3s",
    "4c",
    "4d",
    "4h",
    "4s",
    "5c",
    "5d",
    "5h",
    "5s",
    "6c",
    "6d",
    "6h",
    "6s",
    "7c",
    "7d",
    "7h",
    "7s",
    "8c",
    "8d",
    "8h",
    "8s",
    "9c",
    "9d",
    "9h",
    "9s",
    "tc",
    "td",
    "th",
    "ts",
    "jc",
    "jd",
    "jh",
    "js",
    "qc",
    "qd",
    "qh",
    "qs",
    "kc",
    "kd",
    "kh",
    "ks",
    "ac",
    "ad",
    "ah",
    "as"
  ];
}

Deck.prototype.reshuffle = function(){
	this.cards = [
    "2c",
    "2d",
    "2h",
    "2s",
    "3c",
    "3d",
    "3h",
    "3s",
    "4c",
    "4d",
    "4h",
    "4s",
    "5c",
    "5d",
    "5h",
    "5s",
    "6c",
    "6d",
    "6h",
    "6s",
    "7c",
    "7d",
    "7h",
    "7s",
    "8c",
    "8d",
    "8h",
    "8s",
    "9c",
    "9d",
    "9h",
    "9s",
    "tc",
    "td",
    "th",
    "ts",
    "jc",
    "jd",
    "jh",
    "js",
    "qc",
    "qd",
    "qh",
    "qs",
    "kc",
    "kd",
    "kh",
    "ks",
    "ac",
    "ad",
    "ah",
    "as"
  ];
}

Deck.prototype.getRandomCard = function(){
	length = this.cards.length;
	index = Math.floor(Math.random() * (length));
	card = this.cards[index];
	this.cards.splice(index, 1);
	return card;
}

Deck.prototype.getCardAt = function(cardNumber){
	return this.cards[cardNumber];
}

Deck.prototype.getNumCards = function(){
	return this.cards.length;
}


Deck.prototype.removeCards = function(hand){
	for(var i = 0; i < hand.getNumberOfCardsInHand(); i++){
		this.removeCard(hand.getCard(i));
	}
}

Deck.prototype.removeCard = function(card) {			
	for(var i = 0; i < this.cards.length; i++) {
		if (card == this.cards[i]) {
			this.removeCardByIndex(i);
		}
	}	
}

Deck.prototype.removeCardByIndex = function(index){
	this.cards.splice(index,1);
}

Deck.prototype.printDeck = function(){
	console.log(this.cards);
}

module.exports.Deck = Deck;

