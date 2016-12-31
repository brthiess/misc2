BuildTree = require("./build-tree");
const chalk = require('chalk');

const actionTranslator = {ra: 'All in', r3: 'Raise 3x', r2: 'Raise 2x', r1: 'Raise 1x', 'r0.5': 'Raise Half', 'c': 'Call', 'f': 'Fold'};

function Tree(data, callback){
	var instance = this;
	BuildTree.buildTree(data, function(tree){
		instance.tree = tree;
		instance.currentNode = tree;
		instance.root = instance.currentNode;
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
		while(this.currentNode.children.length == 1){
			this.currentNode = this.currentNode.children[0];
		}
		
		return true;
	}
	else {
		return false;
	}
}
Tree.prototype.navigateToRoot = function(){
	this.currentNode = this.root;
}
module.exports.Tree = Tree;