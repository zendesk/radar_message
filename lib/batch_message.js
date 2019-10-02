class Batch {
  constructor () {
    const messages = [...arguments]
    this.value = messages
    this.op = 'batch'
  }

  add (message) {
    this.value.push(message)
  }

  get length () {
    return this.value.length
  }

  toJSON () {
    return {
      op: this.op,
      length: this.length,
      value: this.value
    }
  }
}

module.exports = Batch
