import config from '../core/config'

const client = require('twilio')(config.get('TWILIO_SID'), config.get('TWILIO_AUTH_TOKEN'))

function sendSms(to, message, cb) {
  client.messages.create({
    body: message,
    to: to,
    from: config.get('TWILIO_NUMBER')
  }, cb)
}

export default {sendSms}
