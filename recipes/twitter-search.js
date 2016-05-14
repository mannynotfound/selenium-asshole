import jsonfile from 'jsonfile'

const webdriver = require('webdriverio')

class TwitterSearch {
  constructor(options, model, cb) {
    this.options = options
    this.model = model
    this.current = 0
    this.client = webdriver.remote(this.options)
    this.cb = cb
  }

  //loop() {
    //this.current++

    //if (this.current > this.model.length - 1) {
      //return console.log('DONE WITH ALL!')
    //} else {
      //this.execute()
    //}
  //}

  execute() {
    this.client
      .init()
      .then(this.createUrl.bind(this))
  }

  createUrl() {
    const inputs = this.model[this.current].inputs
    let url = `https://twitter.com/search?f=${this.model[this.current].type}&q=`

    Object.keys(inputs).forEach((i) => {
      const input = inputs[i]
      if (input.val) {
        let inpUrl = input.pre || ''
        inpUrl += input.val
        inpUrl += input.post || ''

        url += inpUrl
      }
    })

    url += "&src=typd"

    this.openSearch(url)
  }

  openSearch(url) {
    this.client
      .url(url)
      .waitForExist('.js-stream-item', 30000)
      .elements('.js-stream-item')
      .then(this.logTweets.bind(this))
  }

  logTweets({value}) {
    const elmCfg = {
      "text": ".js-tweet-text",
      "fullname": ".fullname",
      "username": ".username",
      "created_at": "._timestamp",
    }

    const allTweets = []

    function getInfo(e) {
      const info = {}
      const base = `.js-stream-item:nth-child(${parseInt(e.ELEMENT, 10) + 1})`

      function gen(fn, args, key) {
        if (!args) {
          return fn.apply(this, arguments)
        }

        return function(fn2) {
          fn.apply(fn, args).then((val) => {
            info[key] = val

            if (fn2) {
              fn2()
            } else if (Object.keys(elmCfg).length === Object.keys(info).length) {
              allTweets.push(info)
              if (allTweets.length === value.length) {
                console.log(allTweets)
              }
            }
          })
        }
      }

      //let curry = null
      Object.keys(elmCfg).forEach((div) => {
        gen(gen(this.client.getText, [`${base} ${elmCfg[div]}`], div))
        //if (!curry) {
          //curry = gen(this.client.getText, [`${base} ${elmCfg[div]}`], div)
        //} else {
        //}
      })
    }

    value.forEach(getInfo.bind(this))
  }

      //function curry(fn) {
        //return function () {
          //if (fn === null) return;
          //var callFn = fn;
          //fn = null;
          //callFn.apply(this, arguments);
        //};
      //}



  //copyCreds() {
    //const creds = {}

    //this.client
      //.waitForExist('.access', 30000)
      //.getText('.app-settings > .row:first-child span:last-of-type')
      //.then((t) => {
        //creds.consumer_key = t
      //})
      //.getText('.app-settings > .row:nth-child(2) span:last-of-type')
      //.then((t) => {
        //creds.consumer_secret = t
      //})
      //.getText('.access > .row:first-child span:last-of-type')
      //.then((t) => {
        //creds.access_token_key = t
      //})
      //.getText('.access > .row:nth-child(2) span:last-of-type')
      //.then((t) => {
        //creds.access_token_secret = t
      //})
      //.then(this.placeCreds.bind(this, creds))
  //}

  //placeCreds(creds) {
    //console.log('PLACING CREDS', creds)
    //this.model[this.current].creds = creds

    //jsonfile.writeFile('./models/accounts.json', this.model, {spaces: 2}, (err) => {
      //if (err) {
        //console.log('JSON FILE ERROR')
        //console.error(err)
        //process.exit()
      //} else {
        //console.log('OUTPUTED!')
      //}

      //this.client.end().then(() => {
        //clearTimeout(this.timeout)
        //setTimeout(() => {
          //this.loop()
        //}, 1000 * 120)
      //})
    //})
  //}
}

export default TwitterSearch
