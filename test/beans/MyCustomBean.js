function MyCustomBean(optional) {
	console.log("MyCustomBean");

	this.optional = optional;

	this.count = 0;
}

MyCustomBean.prototype.addCount = function() {
	return ++this.count;
};

module.exports = MyCustomBean;