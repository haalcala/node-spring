function QuestBean(optional) {
	console.log("new QuestBean");

	this.optional = optional;

	this.count = 0;
}

QuestBean.prototype.addCount = function() {
	return ++this.count;
};

module.exports = QuestBean;