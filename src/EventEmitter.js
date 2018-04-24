export default class EventEmitter {
  constructor () {
    this.listeners = {}
  }

  addEventListener (type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }

  removeEventListener (type, callback) {
    const stack = this.listeners[type] || []
    const i = stack.indexOf(callback)
    if (i !== -1) stack.splice(i, 1)
  }

  emit (type, payload) {
    ;(this.listeners[type] || []).forEach((callback) => {
      callback.call(this, payload)
    })
  }
}
