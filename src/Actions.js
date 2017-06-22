export default class Actions {
  constructor (dispatch, opts) {
    this.opts = opts || {}
    const name = this.opts.name || this.constructor.name
    const desc = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))

    this.actionTypes = {}
    this.dispatch = dispatch

    Object.keys(desc)
    .filter((key) => desc[key].value && 'constructor' !== key)
    .forEach((key) => this.actionTypes[key] = `${name}_${key}`)
  }
}
