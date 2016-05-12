import gens from '../generators'
import jsonfile from 'jsonfile'

const webdriver = require('webdriverio')

class TwitterApi {
  constructor(options, model, cb) {
    this.options = options
    this.model = model
    this.current = 0
    this.client = webdriver.remote(this.options)
    this.cb = cb
    this.timeout = null
  }

  loop() {
    this.current++

    if (this.current > this.model.length - 1) {
      return console.log('DONE WITH ALL!')
    } else {
      this.execute()
    }
  }

  execute() {
    clearTimeout(this.timeout)
    // if nothing happens for 2 minutes, exit process
    this.timeout = setTimeout(() => {
      console.log('HITTING TIMEOUT')
      this.clearAccount()
    }, 1000 * 60 * 2)

    console.log(this.current)
    console.log(this.model[this.current])

    if (this.model[this.current].creds) {
      console.log('ALREADY HAS CREDS!')
      this.loop()
    } else {
      this.client
        .init()
        .url('https://apps.twitter.com')
        .then(this.login.bind(this))
    }
  }

  clearAccount() {
    console.log('CLEARING ACCOUNT')
    this.client.end()

    const failed = this.model[this.current]
    const badAccts = require('../models/accounts-suspended')

    badAccts.push(failed)

    this.model = this.model.filter((m) => m.username !== this.model[this.current].username)
    jsonfile.writeFile('./models/accounts-suspended.json', badAccts, {spaces: 2}, (err) => {
      if (err) {
        console.log('JSON FILE ERROR')
        console.error(err)
        process.exit()
      } else {
        jsonfile.writeFile('./models/accounts.json', this.model, {spaces: 2}, (err) => {
          if (err) {
            console.log('JSON FILE ERROR')
            console.error(err)
          } else {
            console.log('OUTPUTED!')
          }
          process.exit()
        })
      }
    })
  }

  login() {
    this.client
      .waitForExist('.profile-menu', 30000)
      .click('.profile-menu a')
      .waitForExist('.js-username-field', 30000)
      .setValue('.js-username-field', this.model[this.current].username)
      .setValue('.js-password-field', this.model[this.current].password)
      .submitForm('.js-signin')
      .then(this.createNewApp.bind(this))
  }

  createNewApp() {
    this.client
      .waitForExist('.btn[href="/app/new"]', 30000)
      .click('.btn[href="/app/new"]')
      .waitForExist('input#edit-name', 30000)
      .setValue('input#edit-name', gens.generateName())
      .setValue('input#edit-description', gens.generateName())
      .setValue('input#edit-url', gens.generateUrl())
      .click('input#edit-tos-agreement')
      .submitForm('#twitter-apps-create-form')
      .then(this.createTokens.bind(this))
  }

  createTokens() {
    this.client
      .waitForExist('.nav-tabs', 30000)
      .click('.nav-tabs > *:nth-child(3) a')
      .waitForExist('#twitter-apps-form-owner-token', 30000)
      .submitForm('#twitter-apps-form-owner-token')
      .then(this.copyCreds.bind(this))
  }

  copyCreds() {
    const creds = {}

    this.client
      .waitForExist('.access', 30000)
      .getText('.app-settings > .row:first-child span:last-of-type')
      .then((t) => {
        creds.consumer_key = t
      })
      .getText('.app-settings > .row:nth-child(2) span:last-of-type')
      .then((t) => {
        creds.consumer_secret = t
      })
      .getText('.access > .row:first-child span:last-of-type')
      .then((t) => {
        creds.access_token_key = t
      })
      .getText('.access > .row:nth-child(2) span:last-of-type')
      .then((t) => {
        creds.access_token_secret = t
      })
      .then(this.placeCreds.bind(this, creds))
  }

  placeCreds(creds) {
    console.log('PLACING CREDS', creds)
    this.model[this.current].creds = creds

    jsonfile.writeFile('./models/accounts.json', this.model, {spaces: 2}, (err) => {
      if (err) {
        console.log('JSON FILE ERROR')
        console.error(err)
        process.exit()
      } else {
        console.log('OUTPUTED!')
      }

      this.client.end().then(() => {
        clearTimeout(this.timeout)
        setTimeout(() => {
          this.loop()
        }, 1000 * 120)
      })
    })
  }
}

export default TwitterApi
