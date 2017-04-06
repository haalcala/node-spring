var path = require("path");

var _ = require("underscore");

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

        _class = require(path.resolve($.base_path || process.cwd(), _bean.path));

        // console.log("_bean", _bean);

        bean = new (Function.bind.apply(_class, _constuctor_args));

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
                                var request_context = {method_name: prop, method: bean[new_prop], _class: _class};
                                var aspect_args = [request_context].concat(Array.prototype.slice.call(arguments));

                                if (aspect.before) {
                                    aspect_bean[aspect.before].apply(null, aspect_args);
                                }

                                bean[new_prop].apply(bean, arguments);

                                if (aspect.after) {
                                    aspect_bean[aspect.after].apply(null, aspect_args);
                                }
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
