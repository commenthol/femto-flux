import EventEmitter from './EventEmitter'

export default class Dispatcher extends EventEmitter {
  constructor () {
    super()
    this.token = `dispatch${Math.random()}`
    this.lock = false
    this.dispatch = this.dispatch.bind(this)
  }

  dispatch (payload) {
    if (this.lock) throw new Error('can`t dispatch in the middle of a dispatch')
    this.emit(this.token, payload)
  }
}
