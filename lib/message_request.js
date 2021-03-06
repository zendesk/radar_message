const logger = require('minilog')('message:request')

const opTable = {
  control: ['nameSync', 'disconnect'],
  message: ['publish', 'subscribe', 'sync', 'unsubscribe'],
  presence: ['get', 'set', 'subscribe', 'sync', 'unsubscribe'],
  status: ['get', 'set', 'subscribe', 'sync', 'unsubscribe'],
  stream: ['get', 'push', 'subscribe', 'sync', 'unsubscribe']
}

const Request = function (message) {
  this.message = message

  if (!this._isValid()) {
    logger.error('invalid request. op: ' + this.message.op + '; to: ' + this.message.to)
    this.message = {}
  }
}

Request.buildGet = function (scope, options, message = { op: 'get', to: scope }) {
  return new Request(message).setOptions(options)
}

Request.buildPublish = function (scope, value, message = { op: 'publish', to: scope }) {
  const request = new Request(message)
  request.setAttr('value', value)

  return request
}

Request.buildPush = function (scope, resource, action, value, message = { op: 'push', to: scope }) {
  const request = new Request(message)
  request.setAttr('resource', resource)
  request.setAttr('action', action)
  request.setAttr('value', value)

  return request
}

Request.buildNameSync = function (scope, options, message = { op: 'nameSync', to: scope }) {
  return new Request(message).setOptions(options)
}

Request.buildSet = function (scope, value, key, userType, clientData, message = { op: 'set', to: scope }) {
  const request = new Request(message)
  request.setAttr('value', value)
  request.setAttr('key', key)
  request.setAttr('type', userType)
  if (clientData) {
    request.setAttr('clientData', clientData)
  }

  return request
}

Request.buildSync = function (scope, options, message = { op: 'sync', to: scope }) {
  const request = new Request(message).setOptions(options)
  if (request.isPresence()) {
    request.forceV2Sync(options)
  }
  return request
}

Request.buildSubscribe = function (scope, options, message = { op: 'subscribe', to: scope }) {
  return new Request(message).setOptions(options)
}

Request.buildUnsubscribe = function (scope, message = { op: 'unsubscribe', to: scope }) {
  return new Request(message)
}

// Instance methods

Request.prototype.forceV2Sync = function (options = {}) {
  options = options || {} // options is sometimes null, which would cause an exception on the next line
  options.version = 2
  this.setAttr('options', options)
}

Request.prototype.setAuthData = function (configuration) {
  this.setAttr('userData', configuration.userData)
  if (configuration.auth) {
    this.setAttr('auth', configuration.auth)
    this.setAttr('userId', configuration.userId)
    this.setAttr('userType', configuration.userType)
    this.setAttr('accountName', configuration.accountName)
  }
}

Request.prototype.getMessage = function () {
  return this.message
}

Request.prototype.setOptions = function (options) {
  // Keep check for options, since it is sometimes purposefully null
  if (options) {
    this.setAttr('options', options)
  }

  return this
}

Request.prototype.isPresence = function () {
  return this.type === 'presence'
}

Request.prototype.setAttr = function (keyName, keyValue) {
  this.message[keyName] = keyValue
}

Request.prototype.getAttr = function (keyName) {
  return this.message[keyName]
}

Request.prototype.payload = function () {
  return JSON.stringify(this.getMessage())
}

Request.prototype.getType = function () {
  return this.type
}

// Private methods

Request.prototype._isValid = function () {
  if (!this.message.op || !this.message.to) {
    return false
  }

  const type = this._getType()
  if (type) {
    if (this._isValidType(type) && this._isValidOperation(type)) {
      this.type = type
      return true
    }
  } else {
    logger.error('missing type')
  }
  return false
}

Request.prototype._isValidType = function (type) {
  for (const key in opTable) {
    if (Object.prototype.hasOwnProperty.call(opTable, key) && key === type) {
      return true
    }
  }
  this.errMsg = 'invalid type: ' + type
  logger.error(this.errMsg)
  return false
}

Request.prototype._isValidOperation = function (type, ops = opTable[type]) {
  const isValid = ops && ops.indexOf(this.message.op) >= 0
  if (!isValid) {
    this.errMsg = 'invalid operation: ' + this.message.op + ' for type: ' + type
    logger.error(this.errMsg)
  }
  return isValid
}

Request.prototype._getType = function () {
  return this.message.to.substring(0, this.message.to.indexOf(':'))
}

module.exports = Request
