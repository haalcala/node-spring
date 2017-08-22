var Promise = require("promise");

function MistrelPromiseBean(optional) {
	console.log("new MistrelPromiseBean");

	this.optional = optional;

	this.count = 0;
}

MistrelPromiseBean.prototype.addCount = function() {
	return ++this.count;
};

MistrelPromiseBean.prototype.singBeforeQuest = function() {
	return new Promise(function(resolve) {
		console.log("Singing before quest!"); 

		setTimeout(resolve, 1000);
	});
};

MistrelPromiseBean.prototype.singAfterQuest = function() {
	return new Promise(function(resolve) {
		console.log("Singing after quest!"); 

		resolve();
	});
};

module.exports = MistrelPromiseBean;