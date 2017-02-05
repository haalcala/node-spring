function MyCustomBean() {
	console.log("MyCustomBean");

	this.count = 0;
}

MyCustomBean.prototype.addCount = function() {
	return ++this.count;
};

module.exports = MyCustomBean;