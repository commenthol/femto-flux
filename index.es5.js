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
  constructor (dispatcher) {
    super()
    ;['__dispatch', '__emitChange']
    .forEach((fn) => { this[fn] = this[fn].bind(this); });
    dispatcher.addEventListener(dispatcher.token, (payload) => {
      dispatcher.lock = true;
      this.__dispatch(payload);
      dispatcher.lock = false;
    });
  }

  addListener (callback) {
    this.addEventListener(CHANGE, callback);
    return {
      remove: () => this.removeEventListener(CHANGE, callback)
    }
  }

  __emitChange () {
    setImmediate(() => this.emit(CHANGE));
  }

  __dispatch (payload) {
    throw new Error('needs implementation')
  }
}

export { Dispatcher, Store, EventEmitter };
