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

	var _class;

	if (_bean) {
		var constuctor_args = _bean.constuctor_args, _constuctor_args = [null];

		if (constuctor_args) {
			if (constuctor_args instanceof Array) {
				constuctor_args.forEach(function(arg_def) {
					if (typeof(arg_def) == "string") {
						_constuctor_args.push(arg_def);
					}
				});
			}
			else if (constuctor_args instanceof "string") {
				_constuctor_args.push(constuctor_args);
			}
		}

		_class = require(path.resolve(process.cwd(), _bean.path));

		// console.log("_constuctor_args", _constuctor_args);

		bean = new (Function.bind.apply(_class, _constuctor_args));
	}

	return bean;
};

module.exports = ApplicationContext;