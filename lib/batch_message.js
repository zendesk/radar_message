function Batch () {
  var messages = Array.prototype.slice.call(arguments)
  this.value = messages
}

Batch.prototype.op = 'batch'

Object.defineProperty(Batch.prototype, 'length', {
  get: function () {
    return this.value.length
  }
})

Batch.prototype.add = function (message) {
  this.value.push(message)
}

Batch.prototype.toJSON = function () {
  return {
    op: this.op,
    length: this.length,
    value: this.value
  }
}

module.exports = Batch
