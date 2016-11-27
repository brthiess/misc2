BuildTree = require("./build-tree");
const chalk = require('chalk');

const actionTranslator = {ra: 'All in', r3: 'Raise 3x', r2: 'Raise 2x', r1: 'Raise 1x', 'r0.5': 'Raise Half', 'c': 'Call', 'f': 'Fold'};

function Tree(data, callback){
	var instance = this;
	BuildTree.buildTree(data, function(tree){
		instance.tree = tree;
		instance.currentNode = tree.children[0];
		//console.log(instance.currentNode);
		callback();
	});
}



Tree.prototype.getCurrentNode = function() {
	return this.currentNode;
}

Tree.prototype.getChildren = function(){
	return this.currentNode.children;
}

function translateActionToHumanReadable(action){
	
}

Tree.prototype.displayChildren = function(){
	var optionNumber = 1;
	console.log("\n\n");
	console.log("*****************\nChildren:");
	for(var i = 0; i < this.currentNode.children.length; i++){
		process.stdout.write("(" + chalk.green.bold(i) + ") " + this.currentNode.children[i].name + chalk.gray(' : '));
	}
	process.stdout.write("\n");
}
//Expects an integer value
Tree.prototype.navigateToNextNode = function(nextNode){
	if (this.currentNode.children[nextNode] !== undefined) {
		this.currentNode = this.currentNode.children[nextNode];
		return true;
	}
	else {
		return false;
	}
}
module.exports.Tree = Tree;