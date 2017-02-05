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
								// method: "embarkOnQuest"
							},

							before: {
								"pointcut-ref": "log"
							},

							after: {
								"pointcut-ref": "log"
							}
						}
					]
				}
			};

			var ctx = new springframework.ClassPathJsonApplicationContext(config);

			assert.notEqual(ctx, null);

			var knight = ctx.getBean("knight");
			var quest = ctx.getBean("quest");
			var minstrel = ctx.getBean("minstrel");
		});
	});
});