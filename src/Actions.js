export default class Actions {
  /**
  * @param {Function} dispatch - dispatch function
  * @param {Object} [opts] - options
  * @param {Object} [opts.name=constructor.name] - actions name defaults to constructor.name
  */
  constructor (dispatch, opts) {
    this.opts = opts || {}
    // advice: please provide `opts.name` if later ugligying any mangling your code,
    // as `this.constructor.name` might get shortened in an undesired way!
    // use `uglify --keep-fnames` to preserve constructor names
    const name = this.opts.name || this.constructor.name
    const desc = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))

    this.actionTypes = {}
    this.dispatch = dispatch
    this.dispatchAsync = (payload) => setTimeout(() => dispatch(payload))

    Object.keys(desc)
      .filter((key) => desc[key].value &&
        typeof desc[key].value === 'function' &&
        key !== 'constructor'
      )
      .forEach((key) => {
        // we keep `this.actionTypes[key]` for backwards compatibility but
        // `this[key].type` is preferred as it will throw if method is not defined
        this[key].type = this.actionTypes[key] = `${name}.${key}`
      })
  }
}
