# selenium asshole

[selenium](www.seleniumhq.org) powered by [webdriver.io](http://webdriver.io) for everything but integration tests.


## usage

Every script is stored as a 'recipe' and expects to be in a folder with the recipe name as `index.js`, any needed configuration
should be placed in a `main.json` in a corresponding `models` folder. See the current recipes for examples.

cli usage:

```bash
node index.js [recipe name]
```

eg:

```bash
node index.js twitter-api
```

to get text messages on errors:

```bash
ALERTS=true node index.js twitter-api
```

