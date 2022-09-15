
export default function connect (Base, getStores = Base.getStores, calculateState = Base.calculateState) {
  class Container extends Base {
    constructor (props, context) {
      super(props, context)
      Object.assign(this, {
        state: {
          ...(this.state || {}),
          ...(calculateState(this.state, props, context))
        },
        stores: getStores(this.props, this.context),
        _onState: this._onState.bind(this)
      })
    }

    componentDidMount () {
      super.componentDidMount && super.componentDidMount()
      this._addStores()
    }

    componentWillUnmount () {
      super.componentWillUnmount && super.componentWillUnmount()
      this._removeStores()
    }

    static getDerivedStateFromProps (props, state) {
      return typeof Base.getDerivedStateFromProps === 'function'
        ? Base.getDerivedStateFromProps(props, state)
        : null
    }

    _onState () {
      this.setState((state, props) => calculateState(state, props, this.context))
    }

    _addStores () {
      this._removers = this.stores.map(store => store.addListener(this._onState))
    }

    _removeStores () {
      this._removers && this._removers.forEach(token => token.remove())
    }
  }

  return Container
}
