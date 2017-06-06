var springframework = require("../");

var assert = require("assert");

describe("AOP", function() {
	describe("Before and after advice with *.function", function() {
		it("should run as expected", function() {
			var config = {
				beans: {
					knight: {
						path: "test/beans/KnightBean",

						constructor_args: "ref:quest"
					},
					quest: {
						path: "test/beans/QuestBean",
					},
					minstrel: {
						path: "test/beans/MinstrelBean",
					},
				},
				aop: {
					aspect: [
						{
							ref: "minstrel",

							pointcut: {
								id: "log",
								expression: "execution(* *.embarkOnQuest(..))",
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuest"
							},

							after: {
								pointcut_ref: "log",
								method: "singAfterQuest"
							}
						}
					]
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);

			var knight = ctx.getBean("knight");
			var quest = ctx.getBean("quest");
			var minstrel = ctx.getBean("minstrel");

			knight.embarkOnQuest();
			knight.addCount();
			knight.embarkOnQuest();
		});
	});

	describe("Before and after advice with *.function", function() {
		it("should run as expected", function(done) {
			var config = {
				beans: {
					knight: {
						path: "test/beans/KnightBean",

						constructor_args: "ref:quest"
					},
					quest: {
						path: "test/beans/QuestBean",
					},
					minstrel: {
						path: "test/beans/MinstrelBean",
					},
				},
				aop: {
					aspect: [
						{
							ref: "minstrel",

							pointcut: {
								id: "log",
								expression: "execution(* KnightBean.embarkOnQuest(..))",
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuest"
							},

							after: {
								pointcut_ref: "log",
								method: "singAfterQuest"
							}
						}
					]
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);

			var knight = ctx.getBean("knight");
			var quest = ctx.getBean("quest");
			var minstrel = ctx.getBean("minstrel");

			knight.embarkOnQuest();
			knight.addCount();
			knight.embarkOnQuest();

			setTimeout(function() {
				done();
			}, 1000);
		});
	});

	describe("Before and after advice with *.function with Promise pointcut", function() {
		it("should run as expected", function() {
			var config = {
				beans: {
					knight: {
						path: "test/beans/KnightBean",

						constructor_args: "ref:quest"
					},
					quest: {
						path: "test/beans/QuestBean",
					},
					minstrel: {
						path: "test/beans/MinstrelPromiseBean",
					},
				},
				aop: {
					aspect: [
						{
							ref: "minstrel",

							pointcut: {
								id: "log",
								expression: "execution(* *.embarkOnQuest(..))",
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuest"
							},

							after: {
								pointcut_ref: "log",
								method: "singAfterQuest"
							}
						}
					]
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);

			console.log("1111 getting knight ... ");
			var knight = ctx.getBean("knight");
			console.log("1111 getting quest ... ");
			var quest = ctx.getBean("quest");
			console.log("1111 getting minstrel ... ");
			var minstrel = ctx.getBean("minstrel");

			console.log("1111 calling embarkOnQuest ...");
			knight.embarkOnQuest();
			console.log("1111 calling addCount ...");
			knight.addCount();
			// console.log("calling embarkOnQuest ...");
			// knight.embarkOnQuest();
		});
	});

	describe("Before and after advice with *.function", function() {
		it("should run as expected", function(done) {
			var config = {
				beans: {
					knight: {
						path: "test/beans/KnightBean",

						constructor_args: "ref:quest"
					},
					quest: {
						path: "test/beans/QuestBean",
					},
					minstrel: {
						path: "test/beans/MinstrelBean",
					},
				},
				aop: {
					aspect: [
						{
							ref: "minstrel",

							pointcut: {
								id: "log",
								expression: "execution(* KnightBean.embarkOnQuest(..))",
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuest"
							},

							after: {
								pointcut_ref: "log",
								method: "singAfterQuest"
							}
						}
					]
				}
			};

			var ctx = new springframework.FileSystemJsonApplicationContext(config);

			assert.notEqual(ctx, null);

			var knight = ctx.getBean("knight");
			var quest = ctx.getBean("quest");
			var minstrel = ctx.getBean("minstrel");

			knight.embarkOnQuest();
			knight.addCount();
			knight.embarkOnQuest();

			setTimeout(function() {
				done();
			}, 1000);
		});
	});
});