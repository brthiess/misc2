BuildTree = require("./build-tree");

function Tree(data, callback){
	var instance = this;
	BuildTree.buildTree(data, function(tree){
		instance.tree = tree;
		instance.currentNode = tree.children.c;
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

Tree.prototype.navigateToNextNode = function(){
	return console.log("NAVIGATING");
}
module.exports.Tree = Tree;