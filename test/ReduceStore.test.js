/* global describe, it */

import assert from 'assert'
import {EventEmitter, Dispatcher, ReduceStore} from '..'

const payload = {type: 'test', payload: true}

describe('#ReduceStore', function () {
  it('should create a new ReduceStore', function () {
    const dispatcher = new Dispatcher()
    const store = new ReduceStore(dispatcher)
    assert.ok(store instanceof ReduceStore)
    assert.ok(dispatcher instanceof EventEmitter)
  })

  it('should return dispatcher', function () {
    const dispatcher = new Dispatcher()
    const store = new ReduceStore(dispatcher)
    assert.ok(store.getDispatcher() === dispatcher)
  })

  it('should throw on unimplemented reduce()', function () {
    const dispatcher = new Dispatcher()
    const store = new ReduceStore(dispatcher) // eslint-disable-line
    assert.throws(() => {
      dispatcher.dispatch()
    }, /TypeError: this.reduce is not a function/)
  })

  it('should update TestStore on dispatch', function (done) {
    class TestStore extends ReduceStore {
      reduce (state, payload) {
        return payload
      }
    }

    const dispatcher = new Dispatcher()
    const store = new TestStore(dispatcher)
    dispatcher.dispatch(payload)
    setTimeout(() => {
      assert.deepEqual(store.getState(), payload)
      assert.strictEqual(store.hasChanged(), true)
      done()
    }, 10)
  })

  it('should throw on dispatch in a middle of a dispatch', function () {
    const dispatcher = new Dispatcher()

    class TestStore extends ReduceStore {
      reduce (state, payload) {
        dispatcher.dispatch(payload)
        return payload
      }
    }

    const store = new TestStore(dispatcher) // eslint-disable-line
    assert.throws(() => {
      dispatcher.dispatch(payload)
    }, /can't dispatch in the middle of a dispatch/)
  })

  it('should return correct values for hasChanged', function (done) {
    const dispatcher = new Dispatcher()

    class TestStore extends ReduceStore {
      reduce (state, payload) {
        let nextState = state
        switch (payload) {
          case 'EMIT':
            nextState = {payload}
            break
          case 'DONE':
            assert.strictEqual(store.hasChanged(), false)
            done()
            break
          default:
            setTimeout(() => dispatcher.dispatch('DONE'))
            break
        }
        return nextState
      }
    }

    const store = new TestStore(dispatcher)
    store.addListener(() => {
      assert.strictEqual(store.hasChanged(), true)
      setTimeout(() => dispatcher.dispatch('NO_EMIT'))
    })

    dispatcher.dispatch('EMIT')
  })

  it('should call component on store changes', function (done) {
    const dispatcher = new Dispatcher()

    class TestStore extends ReduceStore {
      reduce (state, payload) {
        return payload
      }
    }

    // an imaginary react component
    class Component {
      constructor (props) {
        this.props = props
        this.onChange = this.onChange.bind(this)
        this.componentDidMount()
      }

      componentDidMount () {
        // connect to store(s)
        this.removers = [
          this.props.store.addListener(this.onChange)
        ]
      }

      componentWillUnmount () {
        // disconnect from store(s)
        this.removers.forEach((store) => { store.remove() })
        // testing...
        const {store} = this.props
        assert.deepEqual(store.listeners.change, [])
        done()
      }

      onChange () {
        assert.deepEqual(this.props.store.getState(), payload)
        // this would be the point to call `this.setState(...)`
        this.componentWillUnmount()
      }
    }

    const store = new TestStore(dispatcher)
    const comp = new Component({store}) // eslint-disable-line

    // trigger an action...
    dispatcher.dispatch(payload)
  })
})
