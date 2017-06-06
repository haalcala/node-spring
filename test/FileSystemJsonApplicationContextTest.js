var assert = require("assert");

var springframework = require("../");

var ApplicationContext = require("../lib/ApplicationContext");

describe("FileSystemJsonApplicationContext", function() {
	describe("#FileSystemJsonApplicationContext", function() {
		it("should return an ApplicationContext", function() {
			var ctx = new springframework.FileSystemJsonApplicationContext({beans: {}});

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);
		});
	});

	describe("#getBean", function() {
		it("should not return a bean", function() {
			var ctx = new springframework.FileSystemJsonApplicationContext({beans: {}});

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

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

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

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

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

						constructor_args : [
							"Hello World!!! " + new Date()
						]
					}
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean2");
			var MyCustomBean = require("./beans/MyCustomBean2");

			assert.notEqual(myBean, null);
			assert.equal(myBean instanceof MyCustomBean, true);
			assert.equal(typeof(myBean.getDependency) == "function", true);

			assert.equal(myBean.getDependency(), config.beans.MyBean2.constructor_args[0]);
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

						constructor_args : [
							"ref:MyBean"
						]
					}
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean2 = ctx.getBean("MyBean2");
			var MyCustomBean = require("./beans/MyCustomBean3");

			assert.notEqual(myBean2, null);
			assert.equal(myBean2 instanceof MyCustomBean, true);
		});
	});

	describe("#getBean (requires multi referenced bean)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
					},
					MyBean2: {
						path: "test/beans/MyCustomBean2",

						constructor_args: "Hello World!!!! " + new Date()
					},
					MyBean3: {
						path: "test/beans/MyCustomBean4",

						constructor_args : [
							"ref:MyBean",
							"ref:MyBean2"
						]
					}
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);
			assert.equal(ctx instanceof ApplicationContext, true);

			var myBean = ctx.getBean("MyBean");
			var myBean2 = ctx.getBean("MyBean2");
			var myBean3 = ctx.getBean("MyBean3");
			var MyCustomBean = require("./beans/MyCustomBean");
			var MyCustomBean2 = require("./beans/MyCustomBean2");
			var MyCustomBean3 = require("./beans/MyCustomBean4");

			assert.notEqual(myBean, null);
			assert.notEqual(myBean2, null);
			assert.notEqual(myBean3, null);

			assert.equal(myBean instanceof MyCustomBean, true);
			assert.equal(myBean2 instanceof MyCustomBean2, true);
			assert.equal(myBean3 instanceof MyCustomBean3, true);

			assert.equal(myBean3.getDependency() instanceof MyCustomBean, true);
			assert.equal(myBean3.getDependency2() instanceof MyCustomBean2, true);
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

						constructor_args : [
							"ref:MyBean"
						]
					}
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

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

	describe("#getBean (requires singleton bean with constructor_args)", function() {
		it("should return a bean", function() {
			var config = {
				beans: {
					MyBean: {
						path: "test/beans/MyCustomBean",
						singleton: true,

						constructor_args: "Hello World!!!! " + new Date()
					},
					MyBean2: {
						path: "test/beans/MyCustomBean3",

						constructor_args : [
							"ref:MyBean"
						]
					}
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

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

			assert.equal(myBean3.getDependency().optional, config.beans.MyBean.constructor_args);
		});
	});
});