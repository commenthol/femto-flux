'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.listeners = {};
  }

  _createClass(EventEmitter, [{
    key: 'addEventListener',
    value: function addEventListener(type, callback) {
      if (!(type in this.listeners)) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(callback);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, callback) {
      var stack = this.listeners[type] || [];
      var i = stack.indexOf(callback);
      if (i !== -1) stack.splice(i, 1);
    }
  }, {
    key: 'emit',
    value: function emit(type, payload) {
      var _this = this;

      (this.listeners[type] || []).forEach(function (callback) {
        callback.call(_this, payload);
      });
      return;
    }
  }]);

  return EventEmitter;
}();

var Dispatcher = function (_EventEmitter) {
  _inherits(Dispatcher, _EventEmitter);

  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    var _this2 = _possibleConstructorReturn(this, (Dispatcher.__proto__ || Object.getPrototypeOf(Dispatcher)).call(this));

    _this2.token = 'dispatch' + Math.random();
    _this2.lock = false;
    _this2.dispatch = _this2.dispatch.bind(_this2);
    return _this2;
  }

  _createClass(Dispatcher, [{
    key: 'dispatch',
    value: function dispatch(payload) {
      if (this.lock) throw new Error('can`t dispatch in the middle of a dispatch');
      this.emit(this.token, payload);
    }
  }]);

  return Dispatcher;
}(EventEmitter);

var CHANGE = 'CHANGE';

var Store = function (_EventEmitter2) {
  _inherits(Store, _EventEmitter2);

  function Store(dispatcher) {
    _classCallCheck(this, Store);

    var _this3 = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this));

    ['__dispatch', '__emitChange'].forEach(function (fn) {
      _this3[fn] = _this3[fn].bind(_this3);
    });
    dispatcher.addEventListener(dispatcher.token, function (payload) {
      dispatcher.lock = true;
      _this3.__dispatch(payload);
      dispatcher.lock = false;
    });
    return _this3;
  }

  _createClass(Store, [{
    key: 'addListener',
    value: function addListener(callback) {
      var _this4 = this;

      this.addEventListener(CHANGE, callback);
      return {
        remove: function remove() {
          return _this4.removeEventListener(CHANGE, callback);
        }
      };
    }
  }, {
    key: '__emitChange',
    value: function __emitChange() {
      var _this5 = this;

      setImmediate(function () {
        return _this5.emit(CHANGE);
      });
    }
  }, {
    key: '__dispatch',
    value: function __dispatch(payload) {
      throw new Error('needs implementation');
    }
  }]);

  return Store;
}(EventEmitter);

exports.Dispatcher = Dispatcher;
exports.Store = Store;
exports.EventEmitter = EventEmitter;
