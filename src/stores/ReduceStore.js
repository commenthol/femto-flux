import Store from './Store'

export default class ReduceStore extends Store {
  constructor (dispatcher, opts) {
    super(dispatcher, opts)
    this.state = {
      ...(this.state || {}) // from super()
    }
  }

  // reduce (state, payload) {
  //   throw new Error('implement reduce()')
  // }

  areEqual (state, nextState) {
    return state === nextState
  }

  _invoke (payload) {
    const nextState = this.reduce(this.state, payload)
    if (!nextState) throw new Error('reduce() must not return undefined')
    if (!this.areEqual(this.state, nextState)) {
      this.state = nextState
      this.__emitChange()
      this.emit(this.CHANGE)
    }
  }
}
