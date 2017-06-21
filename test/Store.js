/* global describe, it */

import assert from 'assert'
import {EventEmitter, Dispatcher, Store} from '../src'

const payload = {type: 'test', payload: true}

describe('#Store', function () {
  it('should create a new Store', function () {
    const dispatcher = new Dispatcher()
    const store = new Store(dispatcher)
    assert.ok(store instanceof Store)
    assert.ok(dispatcher instanceof EventEmitter)
  })

  it('should throw on unimplemented __dispatch', function () {
    const dispatcher = new Dispatcher()
    const store = new Store(dispatcher)
    assert.throws(() => {
      dispatcher.dispatch()
    }, /needs implementation/ )
  })

  it('should update TestStore on dispatch', function (done) {
    class TestStore extends Store {
      constructor (dispatcher) {
        super(dispatcher)
        this.store = {}
      }

      get () {
        return this.store
      }

      __dispatch (payload) {
        this.store = payload
        this.__emitChange()
      }
    }

    const dispatcher = new Dispatcher()
    const store = new TestStore(dispatcher)
    dispatcher.dispatch(payload)
    setTimeout(() => {
      assert.deepEqual(store.get(), payload)
      done()
    }, 10)
  })

  it('should throw on dispatch in a middle of a dispatch', function () {
    const dispatcher = new Dispatcher()

    class TestStore extends Store {
      constructor (dispatcher) {
        super(dispatcher)
        this.store = {}
      }

      get () {
        return this.store
      }

      __dispatch (payload) {
        this.store = payload
        dispatcher.dispatch(payload)
        this.__emitChange()
      }
    }

    const store = new TestStore(dispatcher)
    assert.throws(() => {
      dispatcher.dispatch(payload)
    }, /can`t dispatch in the middle of a dispatch/)
  })

  it('should call component on store changes', function (done) {
    const dispatcher = new Dispatcher()

    class TestStore extends Store {
      constructor (dispatcher) {
        super(dispatcher)
        this.store = {}
      }

      get () {
        return this.store
      }

      __dispatch (payload) {
        this.store = payload
        this.__emitChange()
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
        assert.deepEqual(store.listeners.CHANGE, [])
        done()
      }

      onChange () {
        assert.deepEqual(this.props.store.get(), payload)
        // this would be the point to call `this.setState(...)`

        this.componentWillUnmount()
      }
    }

    const store = new TestStore(dispatcher)
    const comp = new Component({store})

    // trigger an action...
    dispatcher.dispatch(payload)
  })
})
