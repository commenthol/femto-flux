const {Dispatcher, Store} = require('..')

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
