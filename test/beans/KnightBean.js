var Promise = require("promise");

function KnightBean(optional) {
	var $ = this;

	console.log("new KnightBean");

	this.optional = optional;

	this.count = 0;

	// setInterval(function() {
	// 	$.embarkOnQuest();
	// }, 500);
}

KnightBean.prototype.addCount = function() {
	console.log("KnightBean.prototype.addCount:: this.count", this.count);

	return ++this.count;
};

KnightBean.prototype.embarkOnQuest = function() {
	console.log("Embarking on quest!!!! count: " + this.count);
};

KnightBean.prototype.embarkOnQuestAsync = function(param1, param2, callback) {
	// console.log("embarkOnQuestAsync:: Embarking on quest async!!!! count: " + this.count, "arguments", arguments, "callback", callback);
	console.log("embarkOnQuestAsync:: Embarking on quest async!!!! count: " + this.count, "arguments", arguments);

	callback("callback_param1", "callback_param2"); 
};

KnightBean.prototype.embarkOnQuestPromise = function() {
	console.log("KnightBean.prototype.embarkOnQuestPromise:: before promise");

	var $ = this;

	return new Promise(function(resolve, reject) {
		console.log("Embarking on quest promise!!!! count: " + $.count, "arguments", arguments);

		setTimeout(function() {
			console.log("Simulating slow response.");
			
			resolve("embarkOnQuestPromise_resolved_return");
		}, 100);
	});
};

module.exports = KnightBean;