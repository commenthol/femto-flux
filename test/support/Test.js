
import { Actions, ReduceStore } from '../../dist'

export class TestActions extends Actions {
  constructor (dispatcher) {
    super(dispatcher, { name: 'TestActions' })
  }

  set (data) {
    const { type } = this.set
    this.dispatch({ type, data })
  }
}

export class TestStore extends ReduceStore {
  reduce (state, { type, data }) {
    const { actions } = this.opts
    switch (type) {
      case actions.set.type:
        return {
          ...state,
          value: data
        }
    }
    return state
  }
}
