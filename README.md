# femto-flux

> minimal flux

[![NPM version](https://badge.fury.io/js/femto-flux.svg)](https://www.npmjs.com/package/femto-flux/)


This implements a minimal flux pattern with a [flux/utils compatible Store](http://facebook.github.io/flux/docs/flux-utils.html).
Less than 2k for ES5 code.

## Installation

```
npm i -S femto-flux
```

## Usage

See `example/flow.js`

```js
import {Dispatcher, Store} from 'femto-flux'

// create a store
class SampleStore extends Store {
  constructor (dispatcher) {
    super(dispatcher)
    this.store = {number: 1}
  }
  __dispatch (action) {
    switch (action.type) {
      case 'click':
        this.store.number = action.number
        this.__emitChange()
        break
    }
  }
}

// a pseudo react component
class Component {
  constructor (props) {
    this.props = props
    this.onChange = this.onChange.bind(this)
  }
  componentDidMount () {
    this.removers = [
      this.props.store.addListener(this.onChange)
    ]
  }
  componentWillUnmount () {
    this.removers.forEach((store) => store.remove())
  }
  onChange () {
    console.log(this.props.store.store)
  }
}

// our instances
const dispatcher = new Dispatcher()
const store = new SampleStore(dispatcher)
const c = new Component({store})
c.componentDidMount()

// dispatch an action
dispatcher.dispatch({type: 'click', number: 1.2})
//> { number: 1.2 }
```

## License

[UNLICENSE](https://unlicense.org)
