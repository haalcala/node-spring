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

	describe("#getBean (singleton bean)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
						singleton: true
					}				
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean");
			var MyCustomBean = require("./beans/MyCustomBean");

			var initial_count = myBean.count;

			assert.notEqual(myBean, null);
			assert.equal(myBean instanceof MyCustomBean, true);
			assert.equal(myBean.count, initial_count);

			var myBean2 = ctx.getBean("MyBean");

			myBean2.addCount();

			assert.notEqual(myBean2, null);
			assert.equal(myBean2 === myBean, true);
			assert.equal(myBean.count, initial_count + 1);
			assert.equal(myBean2 instanceof MyCustomBean, true);
		});
	});

	describe("#getBean (requires primitive values)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
					},
					MyBean2: {
						path: "test/beans/MyCustomBean2",

						constuctor_args : [
							"Hello World!!! " + new Date()
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

	describe("#getBean (requires referenced bean)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
					},
					MyBean2: {
						path: "test/beans/MyCustomBean3",

						constuctor_args : [
							"ref:MyBean"
						]
					}
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean2 = ctx.getBean("MyBean2");
			var MyCustomBean = require("./beans/MyCustomBean3");

			assert.notEqual(myBean2, null);
			assert.equal(myBean2 instanceof MyCustomBean, true);
		});
	});

	describe("#getBean (requires singleton bean)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
						singleton: true
					},
					MyBean2: {
						path: "test/beans/MyCustomBean3",

						constuctor_args : [
							"ref:MyBean"
						]
					}
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean");
			var MyCustomBean = require("./beans/MyCustomBean");

			var initial_count = myBean.count;

			assert.notEqual(myBean, null);
			assert.equal(myBean instanceof MyCustomBean, true);
			assert.equal(myBean.count, initial_count);

			var myBean2 = ctx.getBean("MyBean");

			myBean2.addCount();

			assert.notEqual(myBean2, null);
			assert.equal(myBean2 === myBean, true);
			assert.equal(myBean.count, initial_count + 1);
			assert.equal(myBean2 instanceof MyCustomBean, true);

			var myBean3 = ctx.getBean("MyBean2");
			var MyCustomBean = require("./beans/MyCustomBean3");

			assert.notEqual(myBean3, null);
			assert.equal(myBean3 instanceof MyCustomBean, true);

			assert.equal(myBean3.getDependency() === myBean, true);

			assert.equal(myBean3.getDependency().count, initial_count + 1);
		});
	});

	describe("#getBean (requires singleton bean with constuctor_args)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
						singleton: true,

						constuctor_args: "Hello World!!!! " + new Date()
					},
					MyBean2: {
						path: "test/beans/MyCustomBean3",

						constuctor_args : [
							"ref:MyBean"
						]
					}
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean");
			var MyCustomBean = require("./beans/MyCustomBean");

			var initial_count = myBean.count;

			assert.notEqual(myBean, null);
			assert.equal(myBean instanceof MyCustomBean, true);
			assert.equal(myBean.count, initial_count);

			var myBean2 = ctx.getBean("MyBean");

			myBean2.addCount();

			assert.notEqual(myBean2, null);
			assert.equal(myBean2 === myBean, true);
			assert.equal(myBean.count, initial_count + 1);
			assert.equal(myBean2 instanceof MyCustomBean, true);

			var myBean3 = ctx.getBean("MyBean2");
			var MyCustomBean3 = require("./beans/MyCustomBean3");

			assert.notEqual(myBean3, null);
			assert.equal(myBean3 instanceof MyCustomBean3, true);

			assert.equal(myBean3.getDependency() === myBean, true);

			assert.equal(myBean3.getDependency().count, initial_count + 1);

			assert.equal(myBean3.getDependency().optional, config.beans.MyBean.constuctor_args);
		});
	});


});