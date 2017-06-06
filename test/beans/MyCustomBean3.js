var MyCustomBean = require("./MyCustomBean");

function MyCustomBean3(dependency) {
	console.log("dependency", dependency);
	if (!(dependency instanceof MyCustomBean)) {
		throw new Error("Not an instance of MyCustomBean");
	}

	this.dependency = dependency;
}

MyCustomBean3.prototype.getDependency = function() {
	return this.dependency;
};

module.exports = MyCustomBean3;