BuildTree = require("./build-tree");

function Tree(data, callback){
	var instance = this;
	BuildTree.buildTree(data, function(tree){
		instance.tree = tree;
		instance.currentNode = tree.children.c;
		callback();
	});
}



Tree.prototype.getCurrentNode = function() {
	return this.currentNode;
}


module.exports.Tree = Tree;