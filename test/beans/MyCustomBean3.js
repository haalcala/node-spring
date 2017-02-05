var MyCustomBean = require("../beans/MyCustomBean");

function MyCustomBean3(dependency) {
	console.log("dependency", dependency);
	if (!(dependency instanceof MyCustomBean)) {
		throw "Not an instance of MyCustomBean";
	}

	this.dependency = dependency;
}

MyCustomBean3.prototype.getDependency = function() {
	return this.dependency;
};

module.exports = MyCustomBean3;