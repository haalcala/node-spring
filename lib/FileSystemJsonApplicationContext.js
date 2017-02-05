var ApplicationContext = require("./ApplicationContext");

function FileSystemJsonApplicationContext(config) {
	if (!config.application && config.beans) {
		config = {
			application : config
		}
	}

	var ctx = new ApplicationContext(config);

	return ctx;
}

module.exports = FileSystemJsonApplicationContext;