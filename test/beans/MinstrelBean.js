var Promise = require("promise");

function MistrelBean(optional) {
	console.log("new MistrelBean");

	this.optional = optional;

	this.count = 0;
}

MistrelBean.prototype.addCount = function() {
	console.log("MistrelBean.prototype.addCount");

	return ++this.count;
};

MistrelBean.prototype.singBeforeQuest = function() {
	console.log("MistrelBean.prototype.singBeforeQuest:: Singing before quest! arguments", arguments);
};

MistrelBean.prototype.singAfterQuest = function() {
	console.log("MistrelBean.prototype.singAfterQuest:: Singing after quest! arguments", arguments);
};

MistrelBean.prototype.singBeforeQuestPromise = function() {
	return new Promise(function(resolve, reject) {
		console.log("MistrelBean.prototype.singBeforeQuestPromise:: Singing before quest! promise arguments", arguments);
		
		setTimeout(function() {
			resolve("singBeforeQuestPromise_return");
		}, 100);
	});
};

MistrelBean.prototype.singAfterQuestPromise = function() {
	return new Promise(function(resolve, reject) {
		console.log("MistrelBean.prototype.singAfterQuestPromise:: Singing after quest! promise arguments", arguments);
		
		setTimeout(function() {
			resolve("singAfterQuestPromise_return");
		}, 100);
	});
};

module.exports = MistrelBean;