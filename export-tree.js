var Tree = require('./tree');
const treeFile = 'bin/tree.json';
const fs = require('fs');

const actionRankings = ['ra', 'r3', 'r2', 'r1', 'r0.5', 'c', 'f', 'ch'];
const actionTranslator = {ra: 'All in', r3: 'Raise 3x', r2: 'Raise 2x', r1: 'Raise 1x', 'r0.5': 'Raise Half', 'c': 'Call', 'f': 'Fold', 'ch': 'Check'};


var tree = new Tree.Tree('data/spin/refined/100/data.txt', function(){
		console.log(tree);
		fs.writeFile(treeFile, JSON.stringify(tree), function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	}, true);

