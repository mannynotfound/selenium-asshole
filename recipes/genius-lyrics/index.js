import gens from '../../generators'
import jsonfile from 'jsonfile'

const webdriver = require('webdriverio')

class GeniusLyrics {
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
    }, 1000 * 60 * 2)

    console.log(this.current)
    console.log(this.model[this.current])

    if (this.model[this.current].lyrics) {
      console.log('ALREADY HAS LYRICS!')
      this.loop()
    } else {
      this.client
        .init()
        .url(this.model[this.current].url)
        .then(this.getLyrics.bind(this))
    }
  }

  getLyrics() {
    console.log('Getting Lyrics')
    this.client
      .waitForExist('.lyrics', 30000)
      .getText('.lyrics', 30000)
      .then(this.parseLyrics.bind(this))
  }

  parseLyrics(lyrics) {
    console.log('Parsing Lyrics')
    const regex = /\[(.*?)\]/
    const lyricLines = lyrics.split('\n').filter((l) => {
      if (!l) return false
      const matched = regex.exec(l)
      return !matched;
    }).map((l) => {
      const adlibRegex = /\((.*?)\)/
      const adlibMatched = adlibRegex.exec(l)

      if (adlibMatched) {
        console.log(adlibMatched)
        l = l.replace(adlibMatched[0], '')
      }

      return l;
    });

    this.placeLyrics(lyricLines);
    console.log('~~~~~~~~~~~~~~~')
    console.log(lyricLines)
  }

  placeLyrics(lyricLines) {
    this.model[this.current].lyrics = lyricLines

    jsonfile.writeFile('./recipes/genius-lyrics/models/main.json', this.model, {spaces: 2}, (err) => {
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

export default GeniusLyrics
