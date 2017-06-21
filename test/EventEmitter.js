/* global describe, it */

import assert from 'assert'
import EventEmitter from '../src/EventEmitter'

describe('#EventEmitter', function () {
  it('should create a new EventEmitter', function () {
    const event = new EventEmitter()
    assert.equal(typeof event, 'object')
  })

  it('should add event listener and call on emit', function (done) {
    const callback = (payload) => {
      assert.deepEqual(payload, {payload: true})
      done()
    }

    const event = new EventEmitter()
    event.addEventListener('test', callback)
    event.emit('test', {payload: true})
  })

  it('removeEventListener should ignore unknown callback', function () {
    const event = new EventEmitter()
    event.removeEventListener('test', () => {})
  })

  it('should add event listener multiple times and call on emit', function (done) {
    let count = 0

    const callback = (payload) => {
      count++
      if (count >= 3) {
        assert.deepEqual(payload, {payload: true})
        done()
      }
    }

    const event = new EventEmitter()
    event.addEventListener('test', callback)
    event.addEventListener('test', callback)
    event.addEventListener('test', callback)
    event.emit('test', {payload: true})
  })

  it('should add and remove event listener', function (done) {
    const callback = () => {
      assert.ok(true, 'should not get called')
    }

    const event = new EventEmitter()
    event.addEventListener('test', callback)
    event.removeEventListener('test', callback)
    event.addEventListener('test', () => { done() })
    event.emit('test')
  })
})
