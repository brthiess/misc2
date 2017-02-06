Deck = require("./deck");
Card = require("./card");
Hand = require("./hand");
var prompt = require('prompt');
const fs = require('fs');
var Tree = require('./tree');

const actionRankings = ['ra', 'r2', 'r1.7', 'r1.5', 'r1.3', 'r1', 'r0.7', 'r0.6', 'r0.5', 'r0.3', 'r0.2', 'c', 'f', 'ch'];
const actionTranslator = {ra: 'All in', r3: 'Raise 3x', r2: 'Raise 2x', r1: 'Raise 1x', 'r0.5': 'Raise Half', 'c': 'Call', 'f': 'Fold', 'ch': 'Check'};


//var tree = new Tree.Tree('data/spin/refined/data.txt', true, startLoop);
var tree = new Tree.Tree(JSON.parse(fs.readFileSync('bin/tree.json', 'utf8')), false, startLoop);

currentPercentile = 0;
//Initialize empty hand and community hand
hand = new Hand.Hand(2);
communityHand = new Hand.Hand(5);
action = 'getCurrentNode';

function startLoop(tree){
	goThroughOptions('getCurrentNode', tree);
}

function goThroughOptions(action, tree){
	if(action == 'getCurrentNode'){
		currentNode = tree.getCurrentNode();
		currentNodeName = currentNode.name;
		//console.log("CURRENT NODE NAME: " + currentNodeName)
		
		if (nextNodeIsMe(tree)){
			process.nextTick(function(){showActions(tree);});
		}
		else {
			action = 'displayChildren';
		}
	
	}
	if (action == 'displayChildren'){
		tree.displayChildren();
		action = 'navigateToNextNode';
	}
	if (action == 'navigateToNextNode'){
		prompt.get(['nextNode'], function (err, result){
			if(result.nextNode == 'r'){
				tree.navigateToRoot();
				process.nextTick(function(){goThroughOptions('getCurrentNode',  tree);});
			}
			else if (tree.navigateToNextNode(parseInt(result.nextNode))){
				process.nextTick(function(){goThroughOptions('getCurrentNode',  tree);});
			}
			else {
				process.nextTick(function(){goThroughOptions('displayChildren', tree);});
			}
		});
	}
}


function showActions(tree){
	var children = tree.getChildren();
	var total = 0;
	actionPercentiles = [];
	for(var i = 0; i < children.length; i++){
		total += children[i].frequency;
	}
	var percentilePointer = total;
	for(var k = 0; k < actionRankings.length; k++){
		for(var i = 0; i < children.length; i++){
			if(actionRankings[k] == children[i].name.substr(1)){
				percentilePointer = percentilePointer - children[i].frequency;
				actionPercentile = {};
				actionPercentile.percentile = percentilePointer / total;
				actionPercentile.name = children[i].name.substr(1);
				actionPercentile.id = i;
				actionPercentiles.push(actionPercentile);
		
			}
		}
	}
	console.log(actionPercentiles);
	process.nextTick(function(){goThroughOptions('displayChildren', tree);});
}


function nextNodeIsMe(tree){
	var children = tree.getChildren();
	for(var i = 0; i < children.length; i++){
		if(children[i].name.startsWith('m')){
			return true;
		}
	}
	return false;
}



   