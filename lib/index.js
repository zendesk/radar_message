var Request = require('./message_request')
var Response = require('./message_response')
var Batch = require('./batch_message')
var RadarMessage = function () {}

RadarMessage.Batch = Batch
RadarMessage.Request = Request
RadarMessage.Response = Response

module.exports = RadarMessage
