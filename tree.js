BuildTree = require("./build-tree");
const chalk = require('chalk');

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

Tree.prototype.displayChildren = function(){
	var optionNumber = 1;
	console.log("\n\n");
	console.log("*****************\nChildren:");
	for(var i = 0; i < this.currentNode.children.length; i++){
		process.stdout.write("(" + chalk.green.bold(i) + ") " + this.currentNode.children[i].name + chalk.gray(' : '));
	}
	process.stdout.write("\n");
}

Tree.prototype.navigateToNextNode = function(nextNode){
	console.log(this.currentNode.children[0]);
	console.log("NEXT NODE: " + nextNode);
	this.currentNode = this.currentNode.children[nextNode];
	console.log("NEXT NODE: " + this.currentNode);
}
module.exports.Tree = Tree;