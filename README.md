This project is to achieve similar functionality as SpringFramework for Java

# Project Status

	Under conceptualisation

# Roadmap

	1.0.0
		- Beans
		- Simple AOP

# Installation:

	npm install springframework

# Usage

	var springframework = require("springframework");

	var ctx = new springframework.ClassPathJsonApplicationContext("path to ApplicationContext.json");

	var myapp = ctx.getBean("MyBean2");

	myapp.doSomething();

## ApplicationContext.json

	{
		"application": {
			"id":  "myapp",

			"version": "",

			"import": ["beans/*"], // accepts plain string "beans/*"

			"beans": {
				"MyBean": {
					"path": "./beans/MyCustomBean"
				},

				"MyBean2": {
					"path": "./beans/MyCustomBean2",

					"constuctor": "MyStaticConstructor",

					"constuctor_arg": ["ref:MyBean"] // accepts plain string "ref:MyBean"
				}
			},

			"aop": {
				"aspect": [
					{
						"ref": "MyBean2"

						"pointcut": {
							"id": "log",
							"expression": "execution(* *.embarkOnQuest(..))",
						},

						"before": {
							"pointcut-ref": "log"
						},

						"after": {
							"pointcut-ref": "log"
						}
					}
				]
			},

			"modules": {

			}
		}
	}

## <Bean File>.json

	{
		"id": "MyBean3",

		"path": "./beans/MyBean",

		"constructor": "MyBean",

		"constuctor-arg": "ref:MyBean2"
	}