var Request = require('./message_request.js'),
    Response = require('./message_response.js'),
    RadarMessage = function() {};

RadarMessage.Request = Request;
RadarMessage.Response = Response;

module.exports = RadarMessage;
