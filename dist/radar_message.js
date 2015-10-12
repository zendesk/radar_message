(function(){
var r=function(){var e="function"==typeof require&&require,r=function(i,o,u){o||(o=0);var n=r.resolve(i,o),t=r.m[o][n];if(!t&&e){if(t=e(n))return t}else if(t&&t.c&&(o=t.c,n=t.m,t=r.m[o][t.m],!t))throw new Error('failed to require "'+n+'" from '+o);if(!t)throw new Error('failed to require "'+i+'" from '+u);return t.exports||(t.exports={},t.call(t.exports,t,t.exports,r.relative(n,o))),t.exports};return r.resolve=function(e,n){var i=e,t=e+".js",o=e+"/index.js";return r.m[n][t]&&t?t:r.m[n][o]&&o?o:i},r.relative=function(e,t){return function(n){if("."!=n.charAt(0))return r(n,t,e);var o=e.split("/"),f=n.split("/");o.pop();for(var i=0;i<f.length;i++){var u=f[i];".."==u?o.pop():"."!=u&&o.push(u)}return r(o.join("/"),t,e)}},r}();r.m = [];
r.m[0] = {
"minilog": { exports: Minilog },
"index.js": function(module, exports, require){
var Request = require('./message_request.js'),
    Response = require('./message_response.js'),
    RadarMessage = function() {};

RadarMessage.Request = Request;
RadarMessage.Response = Response;

module.exports = RadarMessage;

},
"message_request.js": function(module, exports, require){
var logger = require('minilog')('message:request');

var opTable = {
  control: ['nameSync'],
  message: ['publish', 'subscribe', 'sync', 'unsubscribe'],
  presence: ['get', 'set', 'subscribe', 'sync', 'unsubscribe'],
  status: ['get', 'set', 'subscribe', 'sync', 'unsubscribe'],
  stream: ['get', 'push', 'subscribe', 'sync', 'unsubscribe']
};

var Request = function (message) {
  this.message = message;

  if (!this._isValid()) {
    logger.error('invalid request. op: ' + this.message.op + '; to: ' + this.message.to);
    this.message = {};
  }
};

Request.buildGet = function (scope, options) {
  var message = { op: 'get', to: scope};
  return new Request(message).setOptions(options);
};

Request.buildPublish = function (scope, value) {
  var message = { op: 'publish', to: scope};
  var request = new Request(message);
  request.setAttr('value', value);

  return request;
};

Request.buildPush = function (scope, resource, action, value) {
  var message = { op: 'push', to: scope};
  var request = new Request(message);
  request.setAttr('resource', resource);
  request.setAttr('action', action);
  request.setAttr('value', value);

  return request;
};

Request.buildNameSync = function (scope, options) {
  var message = { op: 'nameSync', to: scope};
  return new Request(message).setOptions(options);
};

Request.buildSet = function (scope, value, key, userType, clientData) {
  var message = { op: 'set', to: scope};
  var request = new Request(message);
  request.setAttr('value', value);
  request.setAttr('key', key);
  request.setAttr('type', userType);
  if (clientData) {
    request.setAttr('clientData', clientData);
  }

  return request;
};

Request.buildSync = function (scope, options) {
  var message = { op: 'sync', to: scope};
  var request = new Request(message).setOptions(options);
  if (request.isPresence()) {
    request.forceV2Sync(options);
  }
  return request;
};

Request.buildSubscribe = function (scope, options) {
  var message = { op: 'subscribe', to: scope};
  return new Request(message).setOptions(options);
};

Request.buildUnsubscribe = function (scope) {
  var message = { op: 'unsubscribe', to: scope};
  return new Request(message);
};

// Instance methods

Request.prototype.forceV2Sync = function (options) {
  options = options || {};
  options.version = 2;
  this.setAttr('options', options);
};

Request.prototype.setAuthData = function (configuration) {
  this.setAttr('userData', configuration.userData);
  if (configuration.auth) {
    this.setAttr('auth', configuration.auth);
    this.setAttr('userId', configuration.userId);
    this.setAttr('userType', configuration.userType);
    this.setAttr('accountName', configuration.accountName);
  }
};

Request.prototype.getMessage = function () {
  return this.message;
};

Request.prototype.setOptions = function (options) {
  // Keep check for options, since it is sometimes purposefully null
  if (options) {
    this.setAttr('options', options);
  }

  return this;
};

Request.prototype.isPresence = function () {
  return this.type === 'presence';
};

Request.prototype.setAttr = function (keyName, keyValue) {
  this.message[keyName] = keyValue;
};

Request.prototype.getAttr = function (keyName) {
  return this.message[keyName];
};

Request.prototype.payload = function () {
  return JSON.stringify(this.getMessage());
};

Request.prototype.getType = function () {
  return this.type;
};

// Private methods

Request.prototype._isValid = function () {
  if (!this.message.op || !this.message.to) {
    return false;
  }

  var type = this._getType();
  if (type) {
    if (this._isValidType(type) && this._isValidOperation(type)) {
      this.type = type;
      return true;
    }
  } else {
    logger.error('missing type');
  }
  return false;
};

Request.prototype._isValidType = function (type) {
  for (var key in opTable) {
    if (opTable.hasOwnProperty(key) && key === type) {
      return true;
    }
  }
  this.errMsg = 'invalid type: ' + type;
  logger.error(this.errMsg);
  return false;
};

Request.prototype._isValidOperation = function (type) {
  var ops = opTable[type];

  var isValid = ops && ops.indexOf(this.message.op) >= 0;
  if (!isValid) {
    this.errMsg = 'invalid operation: ' + this.message.op + ' for type: ' + type;
    logger.error(this.errMsg);
  }
  return isValid;
};

Request.prototype._getType = function () {
  return this.message.to.substring(0, this.message.to.indexOf(':'));
};

module.exports = Request;

},
"message_response.js": function(module, exports, require){
var logger = require('minilog')('message:response');

function Response (message) {
  this.message = message;

  if (!this._validate()) {
    logger.error('invalid response. message: ' + JSON.stringify(message));
    this.message = {};
  }
}

Response.prototype.getMessage = function () {
  return this.message;
};

Response.prototype._validate = function () {
  if (!this.message.op) {
    this.errMsg = 'missing op';
    return false;
  }

  switch(this.message.op) {
    case 'ack':
      if (!this.message.value) {
        this.errMsg = 'missing value';
        logger.error(this.errMsg);
        return false;
      }
      break;

    default:
      if (this.message.op !== 'err' && !this.message.to) {
        this.errMsg = 'missing to';
        logger.error(this.errMsg);
        return false;
      }
  }

  return true;
};

Response.prototype.isValid = function () {
  return !!this.message.to && !!this.message.value && !!this.message.time;
};

Response.prototype.isFor = function (request) {
  return this.getAttr('to') === request.getAttr('to');
};

Response.prototype.isAckFor = function (request) {
  return this.getAttr('value') === request.getAttr('ack');
};

Response.prototype.getAttr = function (attr) {
  return this.message[attr];
};

Response.prototype.forceV1Response = function () {
  // Sync v1 for presence scopes is inconsistent: the result should be a 'get'
  // message, but instead is an 'online' message.  Take a v2 response and
  // massage it to v1 format prior to returning to the caller.
  var message = this.message, value = {}, userId;
  for (userId in message.value) {
    if (message.value.hasOwnProperty(userId)) {
      // Skip when not defined; causes exception in FF for 'Work Offline'
      if (!message.value[userId]) { continue; }
      value[userId] = message.value[userId].userType;
    }
  }
  message.value = value;
  message.op = 'online';

  this.message = message;
};

module.exports = Response;

}
};
RadarMessage = r("index.js");}());
