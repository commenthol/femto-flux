/* global describe, it */

import assert from 'assert'
import {Dispatcher, Actions, Store} from '..'

describe('#Actions', function () {
  it('should create an actioncreator and dispatch to store with `actionTypes.classname.type`', function (done) {
    class MyActions extends Actions {
      methodA (data) {
        const type = this.actionTypes.methodA // class Actions appends each action method to `actionTypes`
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
      __onDispatch (action) {
        const {actionTypes} = this.opts
        switch (action.type) {
          case actionTypes.my.methodC:
            // is bad as this case/ type is 'undefined'
            break
          case actionTypes.my.methodA:
            assert.deepEqual(action, { type: 'MyActions.methodA', data: { a: 1 } })
            break
          case actionTypes.my.methodB:
            assert.deepEqual(action, { type: 'MyActions.methodB', data: { b: 2 } })
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
    const myStore = new MyStore(dispatcher, {actionTypes}) // eslint-disable-line
    assert.deepEqual(myActions.actionTypes, { methodA: 'MyActions.methodA', methodB: 'MyActions.methodB' })
    myActions.methodA({a: 1})
  })
  it('should create an actioncreator and dispatch to store with `classname.method.type`', function (done) {
    class MyActions extends Actions {
      methodA (data) {
        const {type} = this.methodA // class Actions extends each action method with prop `type`
        setTimeout(() => {
          this.dispatch({type, data})
          this.methodB({b: 2})
        })
      }
      methodB (data) {
        const {type} = this.methodB
        this.dispatch({type, data})
      }
    }

    class MyStore extends Store {
      __onDispatch (action) {
        const {my} = this.opts.actions
        switch (action.type) {
          // case my.methodC.type: // this would throw if methodC is an undefined action
          // break
          case my.methodA.type:
            assert.deepEqual(action, { type: 'MyActions.methodA', data: { a: 1 } })
            break
          case my.methodB.type:
            assert.deepEqual(action, { type: 'MyActions.methodB', data: { b: 2 } })
            done()
            break
        }
      }
    }

    const dispatcher = new Dispatcher()
    const myActions = new MyActions(dispatcher.dispatch)
    const actions = {
      my: myActions
    }
    const myStore = new MyStore(dispatcher, {actions}) // eslint-disable-line
    myActions.methodA({a: 1})
  })
})
