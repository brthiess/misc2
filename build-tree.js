function storeHand(handHistoryTree, stateArray) {
    var index, state, children;
	var currentNode = handHistoryTree;
	currentNode.name = "Root";
	if(!currentNode.children){
		currentNode.children = [];
	}
    for (index = 0; index < stateArray.length; index++) {	
		
		//console.log("\n\n---------------------------");
		state = stateArray[index];
		if(state == ''){
			console.log("WHAT THE FUCK");
			console.log(stateArray);
		}
		//console.log("11");
		//console.log("State: " + state)
		//console.log("Current Node: ");
		//console.log(currentNode);		
		childExists = false;
		childIndex = -1;
		for(var i = 0; i < currentNode.children.length; i++){
			//console.log("NAME: " + currentNode.children[i].name);
			if (currentNode.children[i].name == state){
				childExists = true;
				childIndex = i;
			}
		}
		if (!childExists) {
			//console.log("24");
			//console.log(currentNode);
			var newNode = {};
			newNode.name = state;
			newNode.children = [];	
			newNode.frequency = 1;
			currentNode.children.push(newNode);			
			childIndex = currentNode.children.length - 1;
        }       
		else {
			//console.log("34");
			//console.log(currentNode);
			currentNode.children[childIndex].frequency += 1;
		}
		//console.log("38");
		//console.log(currentNode);
        currentNode = currentNode.children[childIndex];
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
		storeHand(handHistoryTree, line.trim().split(" ").filter(function(el) {return el.length != 0}));
	});
	rl.on('close', function(){
		callback(handHistoryTree);
	});
}


module.exports.buildTree = buildTree;
 

