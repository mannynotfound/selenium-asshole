require('dotenv-safe').load({
  silent: true,
  allowEmptyValues: true
})
require('babel-register')

var Recipe = null, model = null, options = null

try {
  Recipe = require('./recipes/' + process.argv[2]).default
  model = require('./recipes/' + process.argv[2] + '/models/main')
  options = require('./configs')[process.argv[3] || 'default']
} catch(e) {
  console.log('SOMETHING WENT WRONG ', e)
}

if (Recipe) {
  console.log('STARTING ', process.argv[2])
  new Recipe(options, model).execute()
} else {
  console.log('DIDNT FIND A VALID RECIPE!')
}

/*
 * SEND SERVER ERRORS TO TXT MESSAGE VIA TWILIO
 */
//var config = require('./core/config').default
//if (config.get('TWILIO_SID')) {
  //var twilio = require('./lib/twilio').default
  //process.stdin.resume()

  //function exitHandler(options, err) {
    //var text = ''
    //if (err) {
      //text = 'THERE WAS AN ERROR ' + JSON.stringify(err.stack).substring(0, 140)
    //}
    //if (options.exit) {
      //text += ' EXITING  ....'
    //}

    //twilio.sendSms(config.get('ADMIN_NUMBER'), text, function(err, resp) {
      //if (err) {
        //console.log('COULD NOT CONTRACT ADMINISTRATOR')
      //} else {
        //console.log('SENT TEXT TO ADMINISTRATOR')
      //}

      //if (options.exit) process.exit()
    //})
  //}

  //process.on('exit', exitHandler.bind(null,{cleanup:true}));
  //process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  //process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
//}

