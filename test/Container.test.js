import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'
import { JSDOM } from 'jsdom'

import assert from 'assert'

import { Dispatcher } from '../dist'
import connect from '../src/container/Container'
import convertFnC from '../src/container/FnComponent'
import { TestActions, TestStore } from './support/Test'

function createApp (Container, props, context = {}) {
  class App extends Component {
    getChildContext () {
      return context
    }

    render () {
      return (<Container {...props} />)
    }
  }
  App.childContextTypes = Object.keys(context).reduce((o, key) => {
    o[key] = PropTypes.any
    return o
  }, {})

  const app = React.createElement(App)
  const tag = ReactTestUtils.renderIntoDocument(app)
  const component = ReactTestUtils.findRenderedDOMComponentWithTag(tag, 'div')
  const simpleDOMNode = ReactDOM.findDOMNode(component)
  return () => simpleDOMNode.textContent
}

describe('#Container', function () {
  let context

  before(function () {
    // need a dom for testing
    global.window = new JSDOM('<!doctype html><html><body></body></html>').window
    global.document = global.window.document
  })
  after(function () {
    delete global.document
    delete global.window
  })

  beforeEach(function () {
    const dispatcher = new Dispatcher()
    const dispatch = dispatcher.dispatch.bind(dispatcher)
    const actions = new TestActions(dispatch)
    const test = new TestStore(dispatcher, { actions })
    context = {
      dispatcher,
      actions,
      stores: { test }
    }
  })

  it('should update the state', function () {
    class Base extends Component {
      static getStores () {
        return [context.stores.test]
      }

      static calculateState () {
        return context.stores.test.getState()
      }

      render () {
        return (<div>{this.state.value}</div>)
      }
    }
    const Container = connect(Base)
    const get = createApp(Container)
    assert.strictEqual(get(), '')
    context.actions.set('one')
    assert.strictEqual(get(), 'one')
    context.actions.set('two')
    assert.strictEqual(get(), 'two')
  })

  it('should get access to state', () => {
    class Base extends Component {
      static getStores () {
        return [context.stores.test]
      }

      static calculateState (state) {
        const value = `${((state && state.value) || '#')}-${context.stores.test.getState().value}`
        return { value }
      }

      render () {
        return (<div>{this.state.value}</div>)
      }
    }
    const Container = connect(Base)
    const get = createApp(Container)
    assert.strictEqual(get(), '#-undefined')
    context.actions.set('one')
    assert.strictEqual(get(), '#-undefined-one')
    context.actions.set('two')
    assert.strictEqual(get(), '#-undefined-one-two')
  })

  it('should get access to props', () => {
    class Base extends Component {
      static getStores () {
        return [context.stores.test]
      }

      static calculateState (state, props) {
        const value = `${props.value}-${context.stores.test.getState().value}`
        return { value }
      }

      render () {
        return (<div>{this.state.value}</div>)
      }
    }
    const Container = connect(Base)
    const get = createApp(Container, { value: 'prop' })
    assert.strictEqual(get(), 'prop-undefined')
    context.actions.set('one')
    assert.strictEqual(get(), 'prop-one')
  })

  it('should get access to context', () => {
    class Base extends Component {
      static getStores () {
        return [context.stores.test]
      }

      static calculateState (state, props, _context) {
        const value = `${_context.value}-${context.stores.test.getState().value}`
        return { value }
      }

      render () {
        return (<div>{this.state.value}</div>)
      }
    }
    Base.contextTypes = {
      value: PropTypes.string
    }

    const Container = connect(Base)
    const get = createApp(Container, undefined, { value: 'context' })
    assert.strictEqual(get(), 'context-undefined')
    context.actions.set('one')
    assert.strictEqual(get(), 'context-one')
  })

  it('should preserve initial state set in constructor', () => {
    let dangerouslyGetState

    class Base extends Component {
      constructor () {
        super()
        this.state = { value: 'start', other: 42 }
        dangerouslyGetState = () => this.state
      }

      static getStores () {
        return [context.stores.test]
      }

      static calculateState (state) {
        const value = `${state.value}-${context.stores.test.getState().value}`
        return { value }
      }

      render () {
        return (<div>{this.state.value}</div>)
      }
    }
    const Container = connect(Base)
    const get = createApp(Container, { value: 'start-' })
    assert.strictEqual(get(), 'start-undefined')
    assert.deepStrictEqual(dangerouslyGetState(), { value: 'start-undefined', other: 42 })
  })

  it('should get access to context in getStores and calculateState', () => {
    class Base extends Component {
      static getStores (props, context) {
        return [context.stores.test]
      }

      static calculateState (state, props, context) {
        return context.stores.test.getState()
      }

      render () {
        return (<div>{this.state.value}</div>)
      }
    }
    Base.contextTypes = {
      stores: PropTypes.any
    }

    const Container = connect(Base)
    const get = createApp(Container, undefined, context)
    assert.strictEqual(get(), '')
    context.actions.set('one')
    assert.strictEqual(get(), 'one')
    context.actions.set('two')
    assert.strictEqual(get(), 'two')
  })

  it('should connect a functional component', function () {
    function Base (props) {
      return (<div>{props.value}</div>)
    }
    const getStores = () => {
      return [context.stores.test]
    }
    const calculateState = () => {
      return context.stores.test.getState()
    }
    const Container = connect(convertFnC(Base), getStores, calculateState)
    const get = createApp(Container)
    assert.strictEqual(get(), '')
    context.actions.set('one')
    assert.strictEqual(get(), 'one')
    context.actions.set('two')
    assert.strictEqual(get(), 'two')
  })
})
