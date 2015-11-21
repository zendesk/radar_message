const chai = require('chai')
chai.should()

const Batch = require('../lib/batch_message')

describe('Batch', function () {
	describe('new', function () {
		it('constructs a new Batch', function () {
			const batch = new Batch()
			batch.should.be.instanceof(Batch)
		})
		it('takes a variadic number of messages as args', function () {
			const message1 = {}
			const message2 = {}
			const batch = new Batch(message1, message2)
			batch.value.should.deep.equal([message1, message2])
		})
	})
	describe('#length', function () {
		it('returns the number of messages in the batch', function () {
			const batch1 = new Batch()
			batch1.length.should.equal(0)

			const batch2 = new Batch({})
			batch2.length.should.equal(1)
		})
		it('is serialized in json', function () {
			const batch1 = new Batch()
			batch1.toJSON().length.should.equal(0)
		})
	})
	describe('#add()', function () {
		it('adds a message to the batch', function () {
			const batch = new Batch()
			batch.length.should.equal(0)
			const message = {}
			batch.add(message)
			batch.length.should.equal(1)
		})
	})

})