This project is to achieve similar functionality as SpringFramework for Java

# Project Status

	SpringJS-core available

# Roadmap

	1.0.0
		- Beans
		- Simple AOP
	1.1.0
		- Remoting

# Installation:

```bash
npm install springjs
```

# Usage

```js
var springjs = require("springjs");

var ctx = new springjs.FileSystemJsonApplicationContext("path to ApplicationContext.json");

var myapp = ctx.getBean("MyBean2");

myapp.doSomething();

// see the test cases for more examples
```

## ApplicationContext.json

```js
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
```