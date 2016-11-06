function storeHand(handHistoryTree, stateArray) {
    var index, state, entry;
	console.log(stateArray);
    for (index = 0; index < stateArray.length; index++) {
        state = stateArray[index];
        entry = handHistoryTree[state];
        if (!entry) {
            handHistoryTree[state] = entry = {};
        }
        handHistoryTree = entry;
    }
}

function printTree(tree){
	
}


const readline = require('readline');
var fs = require('fs');
 
const rl = readline.createInterface({
	input: fs.createReadStream('data.txt')
});

var handHistoryTree = {};
rl.on('line', function (line) {
	storeHand(handHistoryTree, line.trim().split(" "));
});
rl.on('close', function(){
	console.log(handHistoryTree);
	printTree(handHistoryTree);
});
line = "t a s s a t w x";
//storeHand(handHistoryTree, line.split(" "));
