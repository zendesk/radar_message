var assert = require('assert'),
    RadarMessage = require('../lib/index.js'),
    Response = RadarMessage.Response;

describe('Response', function() {
  it('message requires an "op"', function() {
    var message = { to: 'presence:/test/ticket/1' };
    var response = new Response(message);

    assert.deepEqual(
      response.getMessage(),
      {}
    );
    assert.equal(response.errMsg, 'missing op');
  });

  it('message with "ack" must also have "value"', function() {
    var message = { op: 'ack', to: 'presence:/test/ticket/1' };
    var response = new Response(message);

    assert.deepEqual(
      response.getMessage(),
      {}
    );
    assert.equal(response.errMsg, 'missing value');
  });

  it('message with "err" does not require a "to"', function() {
    var message = { op: 'err', value: 'server'};
    var response = new Response(message);

    assert.deepEqual(
      response.getMessage(),
      message
    );
  });

  it('convert v2 response to a v1 response', function() {
    var v2Message = { op: 'get', to: 'presence:/test/ticket/1',
                      value: {
                        100: { userType: 2, clients: {} },
                        200: { userType: 0, clients: {} }
                      }
                    };

    var v2Response = new Response(v2Message);
    v2Response.forceV1Response();

    assert.deepEqual(
      v2Response.getMessage(),
      { op: 'online',
        to: 'presence:/test/ticket/1',
        value: { 100: 2, 200: 0 }
      }
    );
  });

});
