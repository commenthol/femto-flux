import EventEmitter from './EventEmitter'

export default class Dispatcher extends EventEmitter {
  constructor () {
    super()
    this.token = `dispatch${Math.random()}`
    Object.assign(this, {
      _isDispatching: false,
      dispatch: this.dispatch.bind(this),
      register: this.addEventListener.bind(this, this.token),
      unregister: this.removeEventListener.bind(this, this.token)
    })
  }

  isDispatching () {
    return this._isDispatching
  }

  dispatch (payload) {
    if (this._isDispatching) throw new Error("can't dispatch in the middle of a dispatch")
    this._isDispatching = true
    this.emit(this.token, payload)
    this._isDispatching = false
  }
}
