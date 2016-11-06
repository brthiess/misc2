function storeHand(handHistoryTree, stateArray) {
    var index, state, children;
	var currentNode = handHistoryTree;
	currentNode.name = "Root";
	currentNode.children = {};
    for (index = 0; index < stateArray.length; index++) {	
		state = stateArray[index];
		if (!currentNode.children[state]) {
			currentNode.children[state] = {};
			currentNode.children[state].name = state;
			currentNode.children[state].children = {};	
			currentNode.children[state].frequency = 1;
        }       
		else {
			currentNode.children[state].frequency += 1;
		}
        currentNode = currentNode.children[state];
    }
}


function buildTree(data, callback){
	const readline = require('readline');
	var fs = require('fs');
	const rl = readline.createInterface({
		input: fs.createReadStream(data)
	});

	var handHistoryTree = {};
	rl.on('line', function (line) {
		storeHand(handHistoryTree, line.trim().split(" "));
	});
	rl.on('close', function(){
		callback(handHistoryTree);
	});
}


module.exports.buildTree = buildTree;
 

