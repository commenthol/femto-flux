/* global describe, it */

import assert from 'assert'
import {EventEmitter, Dispatcher, Actions, Store} from '../src'

describe('#Actions', function () {
  it('should create an actioncreator and dispatch to store', function (done) {
    class MyActions extends Actions {
      methodA (data) {
        const type = this.actionTypes.methodA
        setTimeout(() => {
          this.dispatch({type, data})
          this.methodB({b: 2})
        })
      }
      methodB (data) {
        const type = this.actionTypes.methodB
        this.dispatch({type, data})
      }
    }

    class MyStore extends Store {
      __dispatch (action) {
        const {actionTypes} = this.opts
        switch (action.type) {
          case actionTypes.my.methodA:
            assert.deepEqual(action, { type: 'MyActions_methodA', data: { a: 1 } })
            break
          case actionTypes.my.methodB:
            assert.deepEqual(action, { type: 'MyActions_methodB', data: { b: 2 } })
            done()
            break
        }
      }
    }

    const dispatcher = new Dispatcher()
    const myActions = new MyActions(dispatcher.dispatch)
    const actionTypes = {
      my: myActions.actionTypes
    }
    const myStore = new MyStore(dispatcher, {actionTypes})
    assert.deepEqual(myActions.actionTypes, { methodA: 'MyActions_methodA', methodB: 'MyActions_methodB' })
    myActions.methodA({a: 1})
  })
})
