import EventEmitter from './EventEmitter'

const CHANGE = 'CHANGE'

export default class Store extends EventEmitter {
  constructor (dispatcher) {
    super()
    ;['__dispatch', '__emitChange']
    .forEach((fn) => { this[fn] = this[fn].bind(this) })
    dispatcher.addEventListener(dispatcher.token, (payload) => {
      dispatcher.lock = true
      this.__dispatch(payload)
      dispatcher.lock = false
    })
  }

  addListener (callback) {
    this.addEventListener(CHANGE, callback)
    return {
      remove: () => this.removeEventListener(CHANGE, callback)
    }
  }

  __emitChange () {
    setImmediate(() => this.emit(CHANGE))
  }

  __dispatch (payload) {
    throw new Error('needs implementation')
  }
}
