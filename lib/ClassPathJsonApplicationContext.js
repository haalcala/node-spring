var ApplicationContext = require("./ApplicationContext");

function ClassPathJsonApplicationContext(config) {
	var ctx = new ApplicationContext(config);

	return ctx;
}

module.exports = ClassPathJsonApplicationContext;