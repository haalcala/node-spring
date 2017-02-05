var MyCustomBean = require("./MyCustomBean");
var MyCustomBean2 = require("./MyCustomBean2");

function MyCustomBean4(dependency, dependency2) {
	console.log("dependency", dependency);

	if (!(dependency instanceof MyCustomBean)) {
		throw "Not an instance of MyCustomBean";
	}

	if (!(dependency2 instanceof MyCustomBean2)) {
		throw "Not an instance of MyCustomBean2";
	}

	this.dependency = dependency;
	this.dependency2 = dependency2;
}

MyCustomBean4.prototype.getDependency = function() {
	return this.dependency;
};

MyCustomBean4.prototype.getDependency2 = function() {
	return this.dependency2;
};

module.exports = MyCustomBean4;