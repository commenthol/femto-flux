/* global describe, it */

import assert from 'assert'
import EventEmitter from '../src/EventEmitter'
import Dispatcher from '../src/Dispatcher'

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

  it('should dispatch', function (done) {
    const payload = {type: 'test', payload: true}
    const dispatcher = new Dispatcher()
    dispatcher.addEventListener(dispatcher.token, (_payload) => {
      assert.deepEqual(_payload, payload)
      done()
    })
    dispatcher.dispatch(payload)
  })
})
