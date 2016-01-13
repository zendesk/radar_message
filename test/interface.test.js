/* globals describe, it */
var chai = require('chai')
var expect = chai.expect
chai.use(require('chai-interface'))

var RadarMessage = require('../.')

describe('RadarMessage', function () {
  it('should have interface', function () {
    expect(RadarMessage).to.have.interface({
      Request: Function,
      Response: Function,
      Batch: Function
    })
  })

  describe('.Request', function () {
    it('should have interface', function () {
      expect(RadarMessage.Request).to.have.interface({
        buildGet: Function,
        buildPublish: Function,
        buildPush: Function,
        buildNameSync: Function,
        buildSet: Function,
        buildSync: Function,
        buildUnsubscribe: Function
      })
    })
  })
})
