import assert from 'assert'
import { Dispatcher, Actions, Store, dispatch } from '..'

describe('#Actions', function () {
  it('should create an actioncreator and dispatch to store with `actionTypes.classname.type`', function (done) {
    class MyActions extends Actions {
      @dispatch
      methodA (data) {
        return cb => {
          setTimeout(() => {
            cb(null, { data })
            this.methodB({ b: 2 })
            this.methodC({ c: 3 })
            this.methodD({ d: 4 })
          })
        }
      }

      @dispatch
      methodB (data) {
        return { data }
      }

      @dispatch
      methodC (data) {
        return new Promise((resolve /*, reject */) =>
          resolve({ data })
        )
      }

      @dispatch
      methodD (/* data */) {
        return new Promise((resolve, reject) => {
          reject(new Error('bam'))
        })
      }
    }

    class MyStore extends Store {
      __onDispatch (action) {
        const { actions } = this.opts

        switch (action.type) {
          // case actions.methodE.type:
          // will throw...
          // break;
          case actions.methodA.type:
            assert.deepStrictEqual(action, {
              type: 'MyActions.methodA',
              data: { a: 1 },
              error: null
            })
            break
          case actions.methodB.type:
            assert.deepStrictEqual(action, {
              type: 'MyActions.methodB',
              data: { b: 2 }
            })
            break
          case actions.methodC.type:
            assert.deepStrictEqual(action, {
              type: 'MyActions.methodC',
              data: { c: 3 },
              error: null
            })
            break
          case actions.methodD.type:
            assert.deepStrictEqual(action, {
              type: 'MyActions.methodD',
              error: new Error('bam')
            })
            done()
            break
        }
      }
    }

    const dispatcher = new Dispatcher()
    const myActions = new MyActions(dispatcher.dispatch)

    const myStore = new MyStore(dispatcher, {actions: myActions}) // eslint-disable-line
    assert.deepStrictEqual(myActions.actionTypes, {
      methodA: 'MyActions.methodA',
      methodB: 'MyActions.methodB',
      methodC: 'MyActions.methodC',
      methodD: 'MyActions.methodD'
    })
    myActions.methodA({ a: 1 })
  })
  it('should create an actioncreator and dispatch to store with `classname.method.type`', function (done) {
    class MyActions extends Actions {
      methodA (data) { // <--.
        //                   V   shall be the same name!
        const { type } = this.methodA // class Actions extends each action method with prop `type`
        setTimeout(() => {
          this.dispatch({ type, data })
          this.methodB({ b: 2 })
        })
      }

      methodB (data) {
        const { type } = this.methodB
        this.dispatch({ type, data })
      }
    }

    class MyStore extends Store {
      __onDispatch (action) {
        const { my } = this.opts.actions
        switch (action.type) {
          // case my.methodC.type: // this would throw if methodC is an undefined action
          // break
          case my.methodA.type:
            assert.deepStrictEqual(action, { type: 'MyActions.methodA', data: { a: 1 } })
            break
          case my.methodB.type:
            assert.deepStrictEqual(action, { type: 'MyActions.methodB', data: { b: 2 } })
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
    myActions.methodA({ a: 1 })
  })
})
