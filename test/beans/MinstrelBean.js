function MistrelBean(optional) {
	console.log("MistrelBean");

	this.optional = optional;

	this.count = 0;
}

MistrelBean.prototype.addCount = function() {
	return ++this.count;
};

MistrelBean.prototype.singBeforeQuest = function() {
	console.log("Singing before quest!");
};

MistrelBean.prototype.singAfterQuest = function() {
	console.log("Singing after quest!");
};

module.exports = MistrelBean;