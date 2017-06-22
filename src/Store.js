import EventEmitter from './EventEmitter'

const CHANGE = 'CHANGE'

export default class Store extends EventEmitter {
  constructor (dispatcher, opts) {
    super()
    this.opts = opts || {}
    this.dispatcher = dispatcher
    ;['__dispatch', '__emitChange', 'getDispatcher']
    .forEach((fn) => { this[fn] = this[fn].bind(this) })
    dispatcher.addEventListener(dispatcher.token, (payload) => {
      dispatcher.lock = true
      this.__dispatch(payload)
      dispatcher.lock = false
    })
  }

  getDispatcher () {
    return this.dispatcher
  }

  addListener (callback) {
    this.addEventListener(CHANGE, callback)
    return {
      remove: () => this.removeEventListener(CHANGE, callback)
    }
  }

  __emitChange () {
    this.emit(CHANGE)
  }

  __dispatch (payload) {
    throw new Error('needs implementation')
  }
}
