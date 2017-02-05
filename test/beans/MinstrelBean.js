function MistrelBean(optional) {
	console.log("MistrelBean");

	this.optional = optional;

	this.count = 0;
}

MistrelBean.prototype.addCount = function() {
	return ++this.count;
};

module.exports = MistrelBean;