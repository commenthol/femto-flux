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
    this.name = this.opts.name || this.constructor.name
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
        this[key].type = this.actionTypes[key] = `${this.name}.${key}`
      })
  }
}

/**
 * decorator for action definitions - adds correct type
 * based on constructor name and function name
 *
 * @example
 * class TestActions extends Actions {
 *   @dispatch
 *   sync (data) { // type = TestActions.sync
 *     return {data}
 *   }
 *   @dispatch
 *   async (data) { // type = TestActions.async
 *     return cb => {
 *       cb(null, {data}) // return `cb(error, obj)`
 *     }
 *   }
 *   @dispatch
 *   promise (data) { // type = TestActions.promise
 *     return new Promise(resolve => resolve({data}))
 *   }
 * }
 */
export function dispatch (target, name, descriptor) {
  const original = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function (...args) {
      const type = `${this.name}.${name}`
      const obj = original.apply(this, args)
      const cb = (error, obj = {}) => {
        this.dispatch(Object.assign(obj, { error, type }))
      }
      if (typeof obj === 'function') {
        obj(cb) // obj used callback fn
      } else if (typeof obj === 'object') {
        if (typeof obj.then === 'function') { // obj is Promise
          obj.then(res => { cb(null, res) })
            .catch(err => { cb(err, {}) })
        } else {
          obj.type = type
          this.dispatch(obj)
        }
      }
    }
  }
  return descriptor
}
