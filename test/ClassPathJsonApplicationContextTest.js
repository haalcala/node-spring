var assert = require("assert");

var springframework = require("../");

var ApplicationContext = require("../lib/ApplicationContext");

describe("ClassPathJsonApplicationContext", function() {
	describe("#ClassPathJsonApplicationContext", function() {
		it("should return an ApplicationContext", function() {
			var ctx = new springframework.ClassPathJsonApplicationContext({});

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);
		});
	});

	describe("#getBean", function() {
		it("should not return a bean", function() {
			var ctx = new springframework.ClassPathJsonApplicationContext({});

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			assert.equal(ctx.getBean("unknown_bean"), null);
		});
	});

	describe("#getBean (simple bean)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean"
					}				
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean");
			var MyCustomBean = require("./beans/MyCustomBean");

			assert.notEqual(myBean, null);
			assert.equal(myBean instanceof MyCustomBean, true);
		});
	});

	describe("#getBean (requires primitive values)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean"
					},
					MyBean2: {
						path: "test/beans/MyCustomBean2",

						constuctor_args : [
							"Hello World!!!"
						]
					}
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean2");
			var MyCustomBean = require("./beans/MyCustomBean2");

			assert.notEqual(myBean, null);
			assert.equal(myBean instanceof MyCustomBean, true);
			assert.equal(typeof(myBean.getDependency) == "function", true);

			assert.equal(myBean.getDependency(), config.beans.MyBean2.constuctor_args[0]);
		});
	});
});