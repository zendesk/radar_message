const logger = require('minilog')('message:response')

class Response {
  constructor (message) {
    this.message = message

    if (!this._validate()) {
      logger.error('invalid response. message: ' + JSON.stringify(message))
      this.message = {}
    }
  }

  getMessage () {
    return this.message
  }

  _validate () {
    if (!this.message.op) {
      this.errMsg = 'missing op'
      return false
    }

    switch (this.message.op) {
      case 'ack':
        if (!this.message.value) {
          this.errMsg = 'missing value'
          logger.error(this.errMsg)
          return false
        }
        break

      default:
        if (this.message.op !== 'err' && !this.message.to) {
          this.errMsg = 'missing to'
          logger.error(this.errMsg)
          return false
        }
    }

    return true
  }

  isValid () {
    return !!this.message.to && !!this.message.value && !!this.message.time
  }

  isFor (request) {
    return this.getAttr('to') === request.getAttr('to')
  }

  isAckFor (request) {
    return this.getAttr('value') === request.getAttr('ack')
  }

  getAttr (attr) {
    return this.message[attr]
  }

  forceV1Response () {
    // Sync v1 for presence scopes is inconsistent: the result should be a 'get'
    // message, but instead is an 'online' message.  Take a v2 response and
    // massage it to v1 format prior to returning to the caller.
    const message = this.message
    const value = {}

    for (const userId in message.value) {
      if (Object.prototype.hasOwnProperty.call(message.value, userId)) {
        // Skip when not defined; causes exception in FF for 'Work Offline'
        if (!message.value[userId]) { continue }
        value[userId] = message.value[userId].userType
      }
    }
    message.value = value
    message.op = 'online'

    this.message = message
  }
}

module.exports = Response
