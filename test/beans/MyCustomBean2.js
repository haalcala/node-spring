function MyCustomBean2(dependency) {
	console.log("dependency", dependency);

	this.dependency = dependency;

	if (!dependency) {
		throw new Error("Missing required parameter dependency");
	}
}

MyCustomBean2.prototype.getDependency = function() {
	return this.dependency;
};

module.exports = MyCustomBean2;