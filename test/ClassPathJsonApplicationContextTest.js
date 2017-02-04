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

	describe("#getBean", function() {
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

			assert.notEqual(ctx.getBean("MyBean"), null);
		});
	});
});