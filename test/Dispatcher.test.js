import assert from 'assert'
import { EventEmitter, Dispatcher } from '..'

describe('#Dispatcher', function () {
  it('should create a new Dispatcher', function () {
    const dispatcher = new Dispatcher()
    assert.ok(dispatcher instanceof Dispatcher)
    assert.ok(dispatcher instanceof EventEmitter)
  })

  it('should initialize with different tokens', function () {
    const dispatcher1 = new Dispatcher()
    const dispatcher2 = new Dispatcher()
    assert.ok(dispatcher1.token !== dispatcher2.token)
  })

  it('should return dispatching state', function () {
    const dispatcher = new Dispatcher()
    assert.ok(!dispatcher.isDispatching())
  })

  it('should dispatch', function (done) {
    const payload = { type: 'test', payload: true }
    const dispatcher = new Dispatcher()
    dispatcher.addEventListener(dispatcher.token, (_payload) => {
      assert.deepStrictEqual(_payload, payload)
      done()
    })
    dispatcher.dispatch(payload)
  })

  it('should register and unregister', function (done) {
    const payload = { type: 'test', payload: true }
    const dispatcher = new Dispatcher()

    function getListeners () {
      return dispatcher.listeners[dispatcher.token].length
    }

    function unregister () {
      dispatcher.unregister(onDispatch)
      assert.strictEqual(getListeners(), 0)
      done()
    }

    function onDispatch (_payload) {
      assert.deepStrictEqual(_payload, payload)
      unregister()
    }

    dispatcher.register(onDispatch)
    assert.strictEqual(getListeners(), 1)
    dispatcher.dispatch(payload)
  })
})
