function storeHand(handHistoryTree, stateArray) {
    var index, state, children;
	var currentNode = handHistoryTree;
	currentNode.name = "Root";
	if(!currentNode.children){
		currentNode.children = {};
	}
    for (index = 0; index < stateArray.length; index++) {	
		//console.log("---------------------------");
		state = stateArray[index];
		//console.log("10");
		//console.log("State: " + state)
		//console.log("Current Node: ");
		//console.log(currentNode);
		if (!currentNode.children[state]) {
			//console.log("16");
			//console.log(currentNode);
			currentNode.children[state] = {};
			currentNode.children[state].name = state;
			currentNode.children[state].children = {};	
			currentNode.children[state].frequency = 1;
        }       
		else {
			//console.log("24");
			//console.log(currentNode);
			currentNode.children[state].frequency += 1;
		}
		//console.log("27");
		//console.log(currentNode);
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
 

