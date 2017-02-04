var path = require("path");

var _ = require("underscore");

function ApplicationContext(config) {
	var $ = this;

	$.config = config;
}

ApplicationContext.prototype.addBean = function(bean_info) {
};

ApplicationContext.prototype.getBean = function(bean_id) {
	var $ = this;

	var bean = null;

	var _bean = ($.config.beans || 
					($.config.application && $.config.application.beans || {}))[bean_id];

	if (_bean) {
		var constuctor_args = _bean["constuctor-arg"], _constuctor_args = [];
		if (constuctor_args) {
			if (constuctor_args instanceof Array) {

			}
			else if (constuctor_args instanceof "string") {

			}
		}

		bean = new (require(path.resolve(process.cwd(), _bean.path)))();
	}

	return bean;
};

module.exports = ApplicationContext;