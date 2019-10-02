const Request = require('./message_request')
const Response = require('./message_response')
const Batch = require('./batch_message')
const RadarMessage = {}

RadarMessage.Batch = Batch
RadarMessage.Request = Request
RadarMessage.Response = Response

module.exports = RadarMessage
