import { Dispatcher, ReduceStore, connect } from '..'
// import React, { Component } from 'react'
// import { render } from 'react-dom'
import { h, render, Component } from 'preact'

const inc = step => (step + 1) % 3

class HelloStore extends ReduceStore {
  state = { value: '...', step: 0 }
  reduce (state) {
    let { step } = state
    step = inc(step)
    const value = step ? 'hello' : '...'
    return { step, value }
  }
}
class WorldStore extends ReduceStore {
  state = { value: '', step: 0 }
  reduce (state) {
    let { step } = state
    step = inc(step)
    const value = step === 2 ? 'world' : ''
    return { step, value }
  }
}

const dispatcher = new Dispatcher()

const stores = [
  new HelloStore(dispatcher),
  new WorldStore(dispatcher)
]

class Base extends Component {
  static getStores (/* props, context */) {
    return stores
  }

  static calculateState (/* state, props, context */) {
    const { step } = stores[0].getState()
    const value = stores.map(store => store.getState().value).join(' ').trim()
    return { value, step }
  }

  render () {
    const { step, value } = this.state
    return (
      <>
        <h1>femto-flux connect example</h1>
        <div>{value}</div>
        <button onClick={() => dispatcher.dispatch()}>click #{step}</button>
      </>
    )
  }
}

const Container = connect(Base) // eslint-disable-line no-unused-vars

const dom = document.createElement('div')
document.body.appendChild(dom)

render(
  <Container />,
  dom
)
