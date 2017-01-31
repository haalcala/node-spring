This project is to achieve similar functionality as SpringFramework for Java

# Project Status

	Under conceptualisation

# Roadmap

	1.0.0
		- Beans
		- Simple AOP

## ApplicationContext.json

	{
		application: {
			name:  "",
			version: "",

			import: ["beans/*"], // accepts plain string "beans/*"

			beans: {
				MyBean: {
					path: "./beans/MyCustomBean",

					constuctor: "MyCustomBean",

					singleton: false
				},

				MyBean2: {
					path: "./beans/MyCustomBean2",

					constuctor: "MyCustomBean2",

					constuctor-arg: ["ref:MyBean"] // accepts plain string "ref:MyBean"

					singleton: false
				}
			},

			aop: {
				aspect: [
					{
						ref: "MyBean2"

						pointcut: {
							id: "log",
							expression: "execution(* *.embarkOnQuest(..))",
						},

						before: {
							pointcut-ref: "log"
						},

						after: {
							pointcut-ref: "log"
						}
					}
				]
			},

			modules: {

			}
		}
	}

## <Bean File>.json

	{
		id: "MyBean3",

		path: "./beans/MyBean",

		constructor: "MyBean",

		constuctor-arg: "ref:MyBean2"
	}