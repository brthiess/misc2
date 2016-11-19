function TreeNode() {
	this.name = '';
	this.children = [];
	this.frequency = 1;
}

TreeNode.prototype.getChildren = function(){
	return this.children;
}