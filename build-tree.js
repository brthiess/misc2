function storeHand(handHistoryTree, stateArray) {
    var index, state, entry;
    for (index = 0; index < stateArray.length; index++) {
        state = stateArray[index];
        entry = handHistoryTree[state];
        if (!entry) {
            handHistoryTree[state] = entry = {};
        }
        handHistoryTree = entry;
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



 

