const assert = require('assert')
const RadarMessage = require('../lib/index.js')
const Response = RadarMessage.Response

describe('Response', function () {
  it('message requires an "op"', function () {
    const message = { to: 'presence:/test/ticket/1' }
    const response = new Response(message)

    assert.deepStrictEqual(
      response.getMessage(),
      {}
    )
    assert.strictEqual(response.errMsg, 'missing op')
  })

  it('message with "ack" must also have "value"', function () {
    const message = { op: 'ack', to: 'presence:/test/ticket/1' }
    const response = new Response(message)

    assert.deepStrictEqual(
      response.getMessage(),
      {}
    )
    assert.strictEqual(response.errMsg, 'missing value')
  })

  it('message with "err" does not require a "to"', function () {
    const message = { op: 'err', value: 'server' }
    const response = new Response(message)

    assert.deepStrictEqual(
      response.getMessage(),
      message
    )
  })

  it('convert v2 response to a v1 response', function () {
    const v2Message = {
      op: 'get',
      to: 'presence:/test/ticket/1',
      value: {
        100: { userType: 2, clients: {} },
        200: { userType: 0, clients: {} }
      }
    }

    const v2Response = new Response(v2Message)
    v2Response.forceV1Response()

    assert.deepStrictEqual(
      v2Response.getMessage(),
      {
        op: 'online',
        to: 'presence:/test/ticket/1',
        value: { 100: 2, 200: 0 }
      }
    )
  })
})
