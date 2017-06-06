function KnightBean(optional) {
	var $ = this;

	console.log("new KnightBean");

	this.optional = optional;

	this.count = 0;

	setInterval(function() {
		$.embarkOnQuest();
	}, 500);
}

KnightBean.prototype.addCount = function() {
	return ++this.count;
};

KnightBean.prototype.embarkOnQuest = function() {
	console.log("Embarking on quest!!!! count: " + this.count);
};

module.exports = KnightBean;