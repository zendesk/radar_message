const assert = require('assert')
const RadarMessage = require('../lib/index.js')
const Request = RadarMessage.Request

describe('Request', function () {
  it('build a given request, with a meaningless type', function () {
    const request = Request.buildGet('meaningless_type:/test/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {})
    assert.strictEqual(request.getType(), undefined)
  })

  it('build a get request, without options', function () {
    const request = Request.buildGet('status:/test/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'get',
        to: 'status:/test/ticket/1'
      })
    assert.strictEqual(request.getType(), 'status')
  })

  it('build a get request, with options', function () {
    const miscOptions = { key1: 'a' }
    const request = Request.buildGet('status:/test/ticket/1', miscOptions)

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'get',
        to: 'status:/test/ticket/1',
        options: { key1: 'a' }
      })
    assert.strictEqual(request.getType(), 'status')
  })

  it('build a get request, with version 2 options', function () {
    const v2Options = { version: 2 }
    const request = Request.buildGet('status:/test/ticket/1', v2Options)

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'get',
        to: 'status:/test/ticket/1',
        options: { version: 2 }
      })
    assert.strictEqual(request.getType(), 'status')
  })

  it('build a set online request', function () {
    const request = Request.buildSet('presence:/test/ticket/1', 'online', 'key', '2')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'set',
        to: 'presence:/test/ticket/1',
        value: 'online',
        key: 'key',
        type: '2'
      })
    assert.strictEqual(request.getType(), 'presence')
  })

  it('build a sync request', function () {
    const request = Request.buildSync('message:/test/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'sync',
        to: 'message:/test/ticket/1'
      })
    assert.strictEqual(request.getType(), 'message')
  })

  it('build a subscribe request', function () {
    const request = Request.buildSubscribe('presence:/test/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'subscribe',
        to: 'presence:/test/ticket/1'
      })
    assert.strictEqual(request.getType(), 'presence')
  })

  it('build a subscribe request with options', function () {
    const miscOptions = { key1: 'a', key2: 'b' }
    const request = Request.buildSubscribe('presence:/test/ticket/1', miscOptions)

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'subscribe',
        to: 'presence:/test/ticket/1',
        options: { key1: 'a', key2: 'b' }
      })
    assert.strictEqual(request.getType(), 'presence')
  })

  it('build an unsubscribe request', function () {
    const request = Request.buildUnsubscribe('presence:/test/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'unsubscribe',
        to: 'presence:/test/ticket/1'
      })
    assert.strictEqual(request.getType(), 'presence')
  })

  it('build a nameSync request', function () {
    const request = Request.buildNameSync('control:/account/clientName')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'nameSync',
        to: 'control:/account/clientName'
      })
    assert.strictEqual(request.getType(), 'control')
  })

  it('build a nameSync request with a meaningful, but mismatched type', function () {
    const request = Request.buildNameSync('status:/account/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {})
    assert.strictEqual(request.getType(), undefined)
  })

  it('build a publish request, without a value', function () {
    const request = Request.buildPublish('message:/test/ticket/1')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'publish',
        to: 'message:/test/ticket/1',
        value: undefined
      })
    assert.strictEqual(request.getType(), 'message')
  })

  it('build a publish request, with a value', function () {
    const request = Request.buildPublish('message:/test/ticket/1', 'miscValue')

    assert.deepStrictEqual(
      request.getMessage(),
      {
        op: 'publish',
        to: 'message:/test/ticket/1',
        value: 'miscValue'
      })
    assert.strictEqual(request.getType(), 'message')
  })

  it('build a disconnect request', function () {
    const request = new Request({ to: 'control:/acct/clientName', op: 'disconnect', value: { reason: undefined } })
    assert.deepStrictEqual({
      op: 'disconnect',
      to: 'control:/acct/clientName',
      value: { reason: undefined }
    }, request.getMessage())
  })
})
