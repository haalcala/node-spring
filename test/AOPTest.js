var springframework = require("../");

var assert = require("assert");

describe("AOP", function() {
	describe("Before and after advice", function() {
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
});