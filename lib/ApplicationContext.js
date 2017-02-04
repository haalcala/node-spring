var path = require("path");

var _ = require("underscore");

function ApplicationContext(config) {
	var $ = this;

	$.config = config;

	console.log(config);
}

ApplicationContext.prototype.getBean = function(bean_id) {
	var $ = this;

	var bean = null;

	console.log("$", $);

	var _bean = ($.config.beans || 
					($.config.application && $.config.application.beans || {}))[bean_id];

	if (_bean) {
		bean = new (require(path.resolve(process.cwd(), _bean.path)))();
	}

	return bean;
};

module.exports = ApplicationContext;