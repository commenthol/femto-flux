import EventEmitter from '../EventEmitter'

const CHANGE = 'change'

export default class Store extends EventEmitter {
  constructor (dispatcher, opts) {
    super()
    Object.assign(this, {
      dispatcher,
      opts,
      CHANGE,
      state: {
        ...(this.state || {}) // from super()
      }
    })
    dispatcher.register((payload) => {
      this._changed = false
      this._invoke(payload)
    })
  }

  getState () {
    return this.state
  }

  addListener (listener) {
    this.addEventListener(this.CHANGE, listener)
    return {
      remove: () => this.removeEventListener(this.CHANGE, listener)
    }
  }

  getDispatcher () {
    return this.dispatcher
  }

  hasChanged () {
    return this._changed
  }

  _invoke (payload) {
    this.__onDispatch(payload)
    if (this._changed) {
      this.emit(this.CHANGE)
    }
  }

  __emitChange () {
    this._changed = true
  }

  // __onDispatch (payload) {
  //   throw new Error('implement __onDispatch()')
  // }
}
