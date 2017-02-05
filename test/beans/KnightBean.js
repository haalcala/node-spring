function KnightBean(optional) {
	console.log("KnightBean");

	this.optional = optional;

	this.count = 0;
}

KnightBean.prototype.addCount = function() {
	return ++this.count;
};

module.exports = KnightBean;