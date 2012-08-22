var EventEmitter, i, model, p,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

model = require('./model');

EventEmitter = require('events').EventEmitter;

p = function() {};

i = function() {};

module.exports = function(model) {
  var emitterForDoc, emitters;
  emitters = {};
  emitterForDoc = function(docName, create) {
    if (create == null) create = false;
    if (create) {
      return emitters[docName] || (emitters[docName] = new EventEmitter);
    } else {
      return emitters[docName];
    }
  };
  this.onApplyOp = function(docName, opData) {
    var _ref, _ref2;
    p("onApplyOp " + docName + " " + (i(opData)) + " - " + ((_ref = emitterForDoc(docName)) != null ? _ref.listeners('op') : void 0));
    return (_ref2 = emitterForDoc(docName)) != null ? _ref2.emit('op', opData) : void 0;
  };
  this.removeListener = function(docName, listener) {
    var _ref, _ref2;
    if ((_ref = emitterForDoc(docName)) != null) {
      _ref.removeListener('op', listener);
    }
    return p('Listeners: ' + (i((_ref2 = emitterForDoc(docName)) != null ? _ref2.listeners('op') : void 0)));
  };
  this.hasListeners = function(docName) {
    var _ref;
    if ((_ref = emitterForDoc(docName)) != null) {
      return _ref.listeners('op').length > 0;
    }
    return false;
  }
  this.removeAllListeners = function(docName) {
    var _ref;
    return (_ref = emitterForDoc(docName)) != null ? _ref.removeAllListeners('op') : void 0;
  };
  this.listen = function(docName, listener, callback) {
    return model.getVersion(docName, function(error, version) {
      if (error) return typeof callback === "function" ? callback(error) : void 0;
      emitterForDoc(docName, true).on('op', listener);
      return typeof callback === "function" ? callback(null, version) : void 0;
    });
  };
  this.listenFromVersion = function(docName, version, listener, callback) {
    if (version == null) return this.listen(docName, listener, callback);
    return model.getVersion(docName, function(error, docVersion) {
      if (error) return typeof callback === "function" ? callback(error) : void 0;
      if (version > docVersion) version = docVersion;
      return model.getOps(docName, version, null, function(error, data) {
        var emitter, op_data, _i, _len, _ref, _results;
        if (error) {
          return typeof callback === "function" ? callback(error) : void 0;
        }
        emitter = emitterForDoc(docName, true);
        emitter.on('op', listener);
        if (typeof callback === "function") callback(null, version);
        p('Listener added -> ' + (i((_ref = emitterForDoc(docName)) != null ? _ref.listeners('op') : void 0)));
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          op_data = data[_i];
          listener(op_data);
          if (__indexOf.call(emitter.listeners('op'), listener) < 0) {
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    });
  };
  return this;
};
