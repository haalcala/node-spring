var path = require("path");
var shortid = require("shortid");

var _ = require("underscore");

var Promise = require("bluebird");

function ApplicationContext(config) {
	var $ = this;

	$.application = config.application;

	$.beans = {};

	$.aop_target_classes = {};

	// TODO: lots and lots of check/validation on the json structure

	if ($.application.aop && $.application.aop.aspect && $.application.aop.aspect.length > 0) {
		$.application.aop.aspect.forEach(function(aspect) {
			if (aspect) {
				if (aspect.pointcut.expression) {
					var _target = aspect.pointcut.expression.substring("execution(* ".length, aspect.pointcut.expression.indexOf("(..))")); // TODO: find a better parser

					// console.log("_target", _target);

					_target = _target.split(".");

					var target_class = _target[0], target_method = _target[1];

					// console.log("target_class", target_class, " target_method", target_method);

					if (!$.aop_target_classes[_target[0]]) {
						$.aop_target_classes[_target[0]] = [];
					}

					$.aop_target_classes[target_class].push({bean_id: aspect.ref, method: target_method, before: aspect.before && aspect.before.method, after: aspect.after && aspect.after.method});
				}
			}
		});
	}

	// console.log("$.aop_target_classes", $.aop_target_classes);
}

ApplicationContext.prototype.setBaseBeanPath = function(base_path) {
	this.base_path = base_path;
};

ApplicationContext.prototype.addBean = function(bean_info) {
};

ApplicationContext.prototype.getBean = function(bean_id) {
	var $ = this;

	var bean = $.beans[bean_id];

	if (bean) {
		return bean;
	}

	// console.log("bean_id", bean_id);

	var _bean = $.application.beans[bean_id];

	// console.log("_bean", _bean);

	var _class;

	if (_bean) {
		var constructor_args = _bean.constructor_args, _constructor_args = [null];

		// console.log("constructor_args", constructor_args);

		if (constructor_args) {
			if (constructor_args instanceof Array) {
				constructor_args.forEach(function(arg_def) {
					if ((typeof(arg_def) == "string" && arg_def.indexOf("ref:") != 0)
						|| (arg_def instanceof Date)
					) {
						_constructor_args.push(arg_def);
					}
					else if (typeof(arg_def) == "string" && arg_def.indexOf("ref:") == 0) {
						var __bean = $.getBean(arg_def.substring("ref:".length));

						_constructor_args.push(__bean);
					}
				});
			}
			else if (typeof(constructor_args) == "string" && constructor_args.indexOf("ref:") != 0) {
				_constructor_args.push(constructor_args);
			}
			else if (typeof(constructor_args) == "string" && constructor_args.indexOf("ref:") == 0) {
				var __bean = $.getBean(constructor_args.substring("ref:".length)); // TODO: cyclic check

				_constructor_args.push(__bean);
			}
		}

		var __class = path.resolve($.base_path || process.cwd(), _bean.path);

		// console.log("__class", __class);
		// console.log("_constructor_args", _constructor_args);

		_class = require(__class);

		// console.log("_bean", _bean);

		bean = new (Function.bind.apply(_class, _constructor_args));

		// console.log("bean", bean);

		advice("*");
		advice(_bean.path.split("/").pop());

		function advice(_class) {
			// console.log("$.aop_target_classes[_class]", $.aop_target_classes[_class]);

			if ($.aop_target_classes[_class]) {
				for (var prop in bean) {
					// console.log("prop", prop);

					(function(prop) {
						// console.log("prop", prop);

						var aspect = _.findWhere($.aop_target_classes[_class], {method: prop});

						if (!aspect) {
							aspect = _.findWhere($.aop_target_classes[_class], {method: "*"});
						}

						// console.log("aspect", aspect);

						if (typeof(bean[prop]) == "function" && aspect) {
							var ___bean_id = aspect.bean_id;

							var aspect_bean = $.getBean(___bean_id);

							var new_prop = "__" + prop + "__";

							// console.log("new_prop", new_prop);

							bean[new_prop] = bean[prop];

							bean[prop] = function() {
								var request_context = {method_name: prop, method: bean[new_prop], _class: _class, _request_id_: "req-" + shortid.generate()};
								var aspect_args = [request_context].concat(Array.prototype.slice.call(arguments));

								var ret;

								if (aspect.before) {
									// console.log("calling before ... ");
									ret = aspect_bean[aspect.before].apply(aspect_bean, aspect_args);
								}

								var has_callback, _arguments = Array.prototype.slice.call(arguments), callback_fn, callback_i;

								if (aspect.after) {
									for (var i in _arguments) {
										if (typeof(_arguments[i]) == "function") { // wrap the call back if there's aspect.after
											// console.log("callback detected!");

											has_callback = true;

											(function(i) {
												var callback = _arguments[i];

												callback_i = i;

												callback_fn = _arguments[i] = function() {
													var __arguments = arguments;

													// if (ret && ret.then) {
													// 	ret = ret.then(function(result) {
													// console.log("Callback called!! __arguments", __arguments);
													// console.log("Callback called!! ", new Error().stack);

													// 		return new Promise(function(resolve, reject) {

													// 			aspect_bean[aspect.after].apply(null, aspect_args);

													// 			resolve(callback.apply(null, __arguments));
													// 		})
													// 		.then(Promise.resolve(__arguments))
													// 		;
													// 	});
													// }
													// else {
													return new Promise(function(resolve, reject) {
														request_context.callback_args = __arguments;

														// console.log("Calling after ...");

														aspect_bean[aspect.after].apply(aspect_bean, aspect_args);

														// console.log("Calling callback ...");

														callback.apply(null, __arguments);

														// console.log("Calling promise.resolve ...");

														resolve.apply(null, __arguments);
													});
													// }
												};
											})(i);

											break; // only support one callback and it's the first function
										}
									}
								}

								// console.log("has_callback", has_callback);

								if (ret && ret.then) {
									// console.log("The before seems to be a promise return ... new_prop " + new_prop);
									ret = Promise.resolve(bean[new_prop].apply(bean, _arguments));
									// console.log("aaaaa");
								}
								else {
									// console.log("The before is not a promise return ... new_prop " + new_prop, _arguments);

									if (callback_fn) {
										ret = new Promise(function(resolve, reject) {
											_arguments[callback_i] = function() {
												// console.log("callback patch arguments", arguments);

												var __arguments = arguments;

												resolve(callback_fn.apply(null, arguments));

												// if (ret && ret.then) {
												// 	ret.then(Promise.resolve(__arguments));
												// }

												// return ret;
											};

											// console.log("bean[new_prop]", bean[new_prop].toString());

											var _ret = bean[new_prop].apply(bean, _arguments);

											// if (_ret && _ret.then) {
											// 	console.log("The function seems to return a promise");
											// }
											// else {
											// 	console.log("The function return is not a promise");
											// }
										});
									}
									else {
										// console.log("calling bean method", prop, "(", new_prop, ") before promise");

										ret = new Promise(function(resolve, reject) {
											// console.log("calling bean method", prop, "(", new_prop, ")");

											// call the real function!!!
											var _ret = bean[new_prop].apply(bean, _arguments);

											if (_ret && _ret.then && typeof(_ret.then) == "function") {
												_ret =  _ret.then(function (ret) {
													// console.log("It's a promise return!!!");

													request_context.function_return = ret;

													return ret;
												});
											}

											resolve(_ret);
										});
									}

								}

								if (!has_callback && aspect.after) {
									if (ret && ret.then) {
										// console.log("The function seems to be a promise return ...");

										ret = ret.then(function(function_return) {
												// console.log("Calling after aspect. function_return", function_return);
	
												request_context.callback_args = [function_return];
	
												var _ret = aspect_bean[aspect.after].apply(aspect_bean, aspect_args);
	
												if (_ret && _ret.then) {
													// console.log("After aspect is a promise return");
	
													return _ret.then(function() {
														return function_return;
													});
												}
												else {
													// console.log("After aspect is not a promise return, function_return", function_return);
	
													return function_return;
												}
											})
											.catch(function (err) {
												request_context.callback_args = [err];
												
												request_context.relatedException = err;
												
												var _ret = aspect_bean[aspect.after].apply(aspect_bean, aspect_args);
												
												if (_ret && _ret.then) {
													// console.log("After aspect is a promise return");
													
													return Promise.reject(err);
												}
												else {
													// console.log("After aspect is not a promise return, function_return", err);
													
													throw function_return;
												}
											});
									}
									else {
										// console.log("The function is not a promise return ...");

										ret = aspect_bean[aspect.after].apply(aspect_bean, aspect_args);
									}
								}

								return ret;
							};
						}
					})(prop);
				}
			}
		}

		if (_bean.singleton) {
			$.beans[bean_id] = bean;
		}
	}

	return bean;
};

module.exports = ApplicationContext;