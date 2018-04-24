import Store from './Store'

export default class ReduceStore extends Store {
  constructor (dispatcher, opts) {
    super(dispatcher, opts)
    this._state = this.getInitialState()
  }

  getInitialState () {
    return {}
  }

  getState () {
    return this._state
  }

  // reduce (state, payload) {
  //   throw new Error('implement reduce()')
  // }

  areEqual (state, nextState) {
    return state === nextState
  }

  _invoke (payload) {
    const nextState = this.reduce(this._state, payload)
    if (!nextState) throw new Error('reduce() must not return undefined')
    if (!this.areEqual(this._state, nextState)) {
      this._state = nextState
      this.__emitChange()
      this.emit(this.CHANGE)
    }
  }
}
