export default class EventEmitter {
  constructor () {
    this.listeners = {}
  }

  addEventListener (type, listener) {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    this.listeners[type].push(listener)
  }

  removeEventListener (type, listener) {
    const stack = this.listeners[type] || []
    const i = stack.indexOf(listener)
    if (i !== -1) stack.splice(i, 1)
  }

  emit (type, payload) {
    ;(this.listeners[type] || []).forEach((listener) => {
      listener.call(this, payload)
    })
  }
}
