var springframework = require("../");

var assert = require("assert"); 
var Promise = require("promise"); 

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

	describe("Before and after advice with *.function sync", function() {
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
			var knight2 = ctx.getBean("knight");
			var quest = ctx.getBean("quest");
			var minstrel = ctx.getBean("minstrel");

			assert.equal(knight.count, 0);

			knight.embarkOnQuest();

			assert.equal(knight.count, 0);

			knight.addCount();

			assert.equal(knight.count, 1);

			knight.embarkOnQuest();

			assert.equal(knight.count, 1);

			knight.addCount();

			assert.equal(knight.count, 2);

			assert.equal(knight2.count, 0);

			setTimeout(function() {
				done();
			}, 1000);
		});
	});

	describe("Before and after advice with *.function async", function() {
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
								expression: "execution(* KnightBean.embarkOnQuestAsync(..))", 
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

			// console.log(knight.embarkOnQuestAsync.toString());

			assert.equal(knight.count, 0);

			knight.embarkOnQuestAsync("1st_time_param1", "1st_time_param2", function() {
				console.log("calling addCount");
				// console.log("calling addCount", new Error().stack);

				assert.equal(knight.count, 0);

				knight.addCount();

				assert.equal(knight.count, 1);
				
				knight.embarkOnQuestAsync("2nd_time_param1", "2nd_time_param2", function() {
					assert.equal(knight.count, 1);
				});
			});

			setTimeout(function() {
				done();
			}, 1000);
		});
	});

	describe("Before and after advice with *.function promise sync before sync after", function() {
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
								expression: "execution(* KnightBean.embarkOnQuestPromise(..))", 
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

			var second_call_result;

			// console.log(knight.embarkOnQuestAsync.toString());

			assert.equal(knight.count, 0);

			return knight.embarkOnQuestPromise("1st_time_param1", "1st_time_param2")
				.then(function(first_call_result) {
					console.log("calling addCount. first_call_result", first_call_result);
					// console.log("calling addCount", new Error().stack);

					assert.equal(knight.count, 0);

					knight.addCount();

					assert.equal(knight.count, 1);

					return new Promise(function(resolve) {
						setTimeout(function() {
							console.log("Simulating promise chaining after first call");
							resolve(first_call_result);
						}, 100);
					});
				})
				.then(function(_second_call_result) {
					console.log("Calling embarkOnQuestPromise for the second time, _second_call_result", _second_call_result);
					// console.log("Calling embarkOnQuestPromise for the second time, _second_call_result", _second_call_result, new Error().stack);

					second_call_result = _second_call_result;

					return knight.embarkOnQuestPromise("2nd_time_param1", "2nd_time_param2")
					.then(function() {
							assert.equal(knight.count, 1);
						})
						;
				})
				.then(function() {
					assert.equal(second_call_result, "embarkOnQuestPromise_resolved_return");
				})
				;
		});
	});

	describe("Before and after advice with *.function promise promise before promise after", function() {
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
								expression: "execution(* KnightBean.embarkOnQuestPromise(..))", 
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuestPromise"
							},

							after: {
								pointcut_ref: "log",
								method: "singAfterQuestPromise"
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

			var second_call_result;

			// console.log(knight.embarkOnQuestAsync.toString());

			assert.equal(knight.count, 0);

			return knight.embarkOnQuestPromise("1st_time_param1", "1st_time_param2")
				.then(function(first_call_result) {
					console.log("calling addCount. first_call_result", first_call_result);
					// console.log("calling addCount", new Error().stack);

					assert.equal(knight.count, 0);

					knight.addCount();

					assert.equal(knight.count, 1);

					return new Promise(function(resolve) {
						setTimeout(function() {
							console.log("Simulating promise chaining after first call");
							resolve(first_call_result);
						}, 100);
					});
				})
				.then(function(_second_call_result) {
					console.log("Calling embarkOnQuestPromise for the second time, _second_call_result", _second_call_result);
					// console.log("Calling embarkOnQuestPromise for the second time, _second_call_result", _second_call_result, new Error().stack);

					second_call_result = _second_call_result;

					knight.addCount();

					return knight.embarkOnQuestPromise("2nd_time_param1", "2nd_time_param2")
					.then(function() {
							assert.equal(knight.count, 2);
						})
						;
				})
				.then(function() {
					assert.equal(second_call_result, "embarkOnQuestPromise_resolved_return");
				})
				;
		});
	});

	describe("Before and after advice with *.function async promise after", function() {
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
								expression: "execution(* KnightBean.embarkOnQuestAsync(..))", 
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuest"
							},

							after: {
								pointcut_ref: "log",
								method: "singAfterQuestPromise"
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

			// console.log(knight.embarkOnQuestAsync.toString());

			assert.equal(knight.count, 0);

			knight.embarkOnQuestAsync("1st_time_param1", "1st_time_param2", function() {
				console.log("calling addCount");
				// console.log("calling addCount", new Error().stack);

				assert.equal(knight.count, 0);

				knight.addCount();
				knight.addCount();

				assert.equal(knight.count, 2);
				
				knight.embarkOnQuestAsync("2nd_time_param1", "2nd_time_param2", function() {
					assert.equal(knight.count, 2);
				});
			});

			setTimeout(function() {
				done();
			}, 1000);
		});
	});

	describe("Before and after advice with *.function async promise before", function() {
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
								expression: "execution(* KnightBean.embarkOnQuestAsync(..))", 
							},

							before: {
								pointcut_ref: "log",
								method: "singBeforeQuestPromise"
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

			// console.log(knight.embarkOnQuestAsync.toString());

			assert.equal(knight.count, 0);

			knight.embarkOnQuestAsync("1st_time_param1", "1st_time_param2", function() {
				console.log("calling addCount");
				// console.log("calling addCount", new Error().stack);

				assert.equal(knight.count, 0);

				knight.addCount();
				knight.addCount();

				assert.equal(knight.count, 2);
				
				knight.embarkOnQuestAsync("2nd_time_param1", "2nd_time_param2", function() {
					assert.equal(knight.count, 2);
				});
			});

			setTimeout(function() {
				done();
			}, 1000);
		});
	});
});