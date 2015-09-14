var assert = require('assert'),
    RadarMessage = require('../lib/index.js'),
    Request = RadarMessage.Request;

describe('Request', function() {
  it('build a given request, with a meaningless type', function() {
    var request = Request.buildGet('meaningless_type:/test/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      {});
    assert.equal(request.getType(), undefined);
  });

  it('build a get request, without options', function() {
    var request = Request.buildGet('status:/test/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      { op: 'get',
        to: 'status:/test/ticket/1'
      });
    assert.equal(request.getType(), 'status');
  });

  it('build a get request, with options', function() {
    var miscOptions = { key1 : 'a' };
    var request = Request.buildGet('status:/test/ticket/1', miscOptions);

    assert.deepEqual(
      request.getMessage(),
      { op: 'get',
        to: 'status:/test/ticket/1',
        options: { key1: 'a' }
      });
    assert.equal(request.getType(), 'status');
  });

  it('build a get request, with version 2 options', function() {
    var v2Options = { version : 2 };
    var request = Request.buildGet('status:/test/ticket/1', v2Options);

    assert.deepEqual(
      request.getMessage(),
      { op: 'get',
        to: 'status:/test/ticket/1',
        options: { version: 2 }
      });
    assert.equal(request.getType(), 'status');
  });

  it('build a set online request', function() {
    var request = Request.buildSet('presence:/test/ticket/1', 'online', 'key', '2');

    assert.deepEqual(
      request.getMessage(),
      { op: 'set',
        to: 'presence:/test/ticket/1',
        value: 'online',
        key: 'key',
        type: '2' 
      });
    assert.equal(request.getType(), 'presence');
  });

  it('build a sync request', function() {
    var request = Request.buildSync('message:/test/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      { op: 'sync',
        to: 'message:/test/ticket/1'
      });
    assert.equal(request.getType(), 'message');
  });

  it('build a subscribe request', function() {
    var request = Request.buildSubscribe('presence:/test/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      { op: 'subscribe',
        to: 'presence:/test/ticket/1'
      });
    assert.equal(request.getType(), 'presence');
  });

  it('build a subscribe request with options', function() {
    var miscOptions = { key1: 'a', key2: 'b' };
    var request = Request.buildSubscribe('presence:/test/ticket/1', miscOptions);

    assert.deepEqual(
      request.getMessage(),
      { op: 'subscribe',
        to: 'presence:/test/ticket/1',
        options: { key1: 'a', key2: 'b' }
      });
    assert.equal(request.getType(), 'presence');
  });

  it('build an unsubscribe request', function() {
    var request = Request.buildUnsubscribe('presence:/test/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      { op: 'unsubscribe',
        to: 'presence:/test/ticket/1'
      });
    assert.equal(request.getType(), 'presence');
  });

  it('build a nameSync request', function() {
    var request = Request.buildNameSync('control:/account/clientName');

    assert.deepEqual(
      request.getMessage(),
      { op: 'nameSync',
        to: 'control:/account/clientName'
      });
    assert.equal(request.getType(), 'control');
  });

  it('build a nameSync request with a meaningful, but mismatched type', function() {
    var request = Request.buildNameSync('status:/account/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      {});
    assert.equal(request.getType(), undefined);
  });

  it('build a publish request, without a value', function() {
    var request = Request.buildPublish('message:/test/ticket/1');

    assert.deepEqual(
      request.getMessage(),
      { op: 'publish',
        to: 'message:/test/ticket/1',
        value: undefined
      });
    assert.equal(request.getType(), 'message');
  });

  it('build a publish request, with a value', function() {
    var request = Request.buildPublish('message:/test/ticket/1', 'miscValue');

    //console.log('request:', request);
    assert.deepEqual(
      request.getMessage(),
      { op: 'publish',
        to: 'message:/test/ticket/1',
        value: 'miscValue'
      });
    assert.equal(request.getType(), 'message');
  });
});
