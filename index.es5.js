class EventEmitter {
  constructor () {
    this.listeners = {};
  }

  addEventListener (type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener (type, callback) {
    const stack = this.listeners[type] || [];
    const i = stack.indexOf(callback);
    if (i !== -1) stack.splice(i, 1);
  }

  emit (type, payload) {
    (this.listeners[type] || []).forEach((callback) => {
      callback.call(this, payload);
    });
    return
  }
}

class Dispatcher extends EventEmitter {
  constructor () {
    super();
    this.token = `dispatch${Math.random()}`;
    this.lock = false;
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch (payload) {
    if (this.lock) throw new Error('can`t dispatch in the middle of a dispatch')
    this.emit(this.token, payload);
  }
}

const CHANGE = 'CHANGE';

class Store extends EventEmitter {
  constructor (dispatcher, opts) {
    super();
    this.opts = opts || {};
    this.dispatcher = dispatcher
    ;['__dispatch', '__emitChange', 'getDispatcher']
    .forEach((fn) => { this[fn] = this[fn].bind(this); });
    dispatcher.addEventListener(dispatcher.token, (payload) => {
      dispatcher.lock = true;
      this.__dispatch(payload);
      dispatcher.lock = false;
    });
  }

  getDispatcher () {
    return this.dispatcher
  }

  addListener (callback) {
    this.addEventListener(CHANGE, callback);
    return {
      remove: () => this.removeEventListener(CHANGE, callback)
    }
  }

  __emitChange () {
    this.emit(CHANGE);
  }

  __dispatch (payload) {
    throw new Error('needs implementation')
  }
}

class Actions {
  constructor (dispatch, opts) {
    this.opts = opts || {};
    const name = this.opts.name || this.constructor.name;
    const desc = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));

    this.actionTypes = {};
    this.dispatch = dispatch;

    Object.keys(desc)
    .filter((key) => desc[key].value && 'constructor' !== key)
    .forEach((key) => this.actionTypes[key] = `${name}_${key}`);
  }
}

export { Dispatcher, Store, Actions, EventEmitter };
