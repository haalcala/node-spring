var path = require("path");

var _ = require("underscore");

function ApplicationContext(config) {
	var $ = this;

	$.application = config.application;

	$.beans = {};

	$.aop_target_classes = {};

	if ($.application.aop && $.application.aop.aspect && $.application.aop.aspect.length > 0) {
		$.application.aop.aspect.forEach(function(aspect) {
			if (aspect) {
				if (aspect.pointcut.expression) {
					var _target = aspect.pointcut.expression.substring("execution(* ".length, aspect.pointcut.expression.indexOf("(..))")); // TODO: find a better parser

					_target = _target.split(".");

					if (!$.aop_target_classes[_target[0]]) {
						$.aop_target_classes[_target[0]] = [];
					}

					$.aop_target_classes[_target[0]].push(_target[1]);
				}
			}
		});
	}

	console.log("$.aop_target_classes", $.aop_target_classes);
}

ApplicationContext.prototype.addBean = function(bean_info) {
};

ApplicationContext.prototype.getBean = function(bean_id) {
	var $ = this;

	var bean = $.beans[bean_id];

	if (bean) {
		return bean;
	}

	var _bean = $.application.beans[bean_id];

	var _class;

	if (_bean) {
		var constuctor_args = _bean.constuctor_args, _constuctor_args = [null];

		if (constuctor_args) {
			if (constuctor_args instanceof Array) {
				constuctor_args.forEach(function(arg_def) {
					if ((typeof(arg_def) == "string" && arg_def.indexOf("ref:") != 0)
							|| (arg_def instanceof Date)
						) {
						_constuctor_args.push(arg_def);
					}
					else if (typeof(arg_def) == "string" && arg_def.indexOf("ref:") == 0) {
						var __bean = $.getBean(arg_def.substring("ref:".length));

						_constuctor_args.push(__bean);
					}
				});
			}
			else if (typeof(constuctor_args) == "string" && constuctor_args.indexOf("ref:") != 0) {
				_constuctor_args.push(constuctor_args);
			}
			else if (typeof(constuctor_args) == "string" && constuctor_args.indexOf("ref:") == 0) {
				var __bean = $.getBean(constuctor_args.substring("ref:".length)); // TODO: cyclic check

				_constuctor_args.push(__bean);
			}
		}

		_class = require(path.resolve(process.cwd(), _bean.path));

		bean = new (Function.bind.apply(_class, _constuctor_args));

		if ($.aop_target_classes["*"]) {
			for (var prop in bean) {
				
			}
		}

		if (_bean.singleton) {
			$.beans[bean_id] = bean;
		}
	}

	return bean;
};

module.exports = ApplicationContext;