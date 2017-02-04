function MyCustomBean2(dependency) {
	if (!dependency) {
		throw "required dependency missing";
	}
}

module.exports = MyCustomBean2;