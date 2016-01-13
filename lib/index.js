var Request = require('./message_request'),
    Response = require('./message_response'),
    Batch = require('./batch_message'),
    RadarMessage = function() {};

RadarMessage.Batch = Batch;
RadarMessage.Request = Request;
RadarMessage.Response = Response;

module.exports = RadarMessage;
