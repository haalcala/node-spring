var MyCustomBean = require("./MyCustomBean");

function MyCustomBean2(dependency) {
	if (!(dependency instanceof MyCustomBean)) {
		throw "Not an instance of MyCustomBean";
	}
}

module.exports = MyCustomBean2;