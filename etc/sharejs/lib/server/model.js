var Events, Model, hat, queue, types;

hat = require('hat');

queue = require('./syncqueue');

types = require('../types');

Events = require('./events');

module.exports = Model = function(db, options) {
  var auth, createClient, doAuth, events, getSnapshot, queues;
  if (!(this instanceof Model)) return new Model(db, options);
  if (options == null) options = {};
  this.getOps = function(docName, start, end, callback) {
    return db.getOps(docName, start, end, callback);
  };
  this.getSnapshot = getSnapshot = function(docName, callback) {
    return db.getSnapshot(docName, callback);
  };
  this.getVersion = function(docName, callback) {
    return db.getVersion(docName, callback);
  };
  this.create = function(docName, type, meta, callback) {
    var docData, _ref;
    if (typeof meta === 'function') {
      _ref = [{}, meta], meta = _ref[0], callback = _ref[1];
    }
    if (typeof type === 'string') type = types[type];
    if (!type) {
      return typeof callback === "function" ? callback('Type not found') : void 0;
    }
    if (docName.match(/\//)) {
      return typeof callback === "function" ? callback('Invalid document name') : void 0;
    }
    docData = {
      snapshot: type.create(),
      type: type,
      meta: meta || {},
      v: 0
    };
    return db.create(docName, docData, function(error) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, docData);
      }
    });
  };
  queues = {};
  this.clientCount = 0;
  this.applyOp = function(docName, opData, callback) {
    queues[docName] || (queues[docName] = queue(function(opData, callback) {
      return getSnapshot(docName, function(error, docData) {
        var meta, op, opVersion, snapshot, submit, type, version;
        if (error) return callback(error);
        opVersion = opData.v;
        op = opData.op;
        meta = opData.meta || {};
        meta.ts = Date.now();
        version = docData.v, snapshot = docData.snapshot, type = docData.type;
        submit = function() {
          var newDocData, newOpData;
          try {
            snapshot = docData.type.apply(docData.snapshot, op);
          } catch (error) {
            console.error(error.stack);
            callback(error.message);
            return;
          }
          newOpData = {
            op: op,
            v: opVersion,
            meta: meta
          };
          newDocData = {
            snapshot: snapshot,
            type: type.name,
            v: opVersion + 1,
            meta: docData.meta
          };
          return db.append(docName, newOpData, newDocData, function() {
            events.onApplyOp(docName, newOpData);
            return callback(null, opVersion);
          });
        };
        if (opVersion > version) {
          callback('Op at future version');
          return;
        }
        if (opVersion < version) {
          return db.getOps(docName, opVersion, version, function(error, ops) {
            var realOp, _i, _len;
            if (error) return callback(error);
            try {
              for (_i = 0, _len = ops.length; _i < _len; _i++) {
                realOp = ops[_i];
                op = docData.type.transform(op, realOp.op, 'left');
                opVersion++;
              }
            } catch (error) {
              console.error(error.stack);
              callback(error.message);
              return;
            }
            return submit();
          });
        } else {
          return submit();
        }
      });
    }));
    return process.nextTick(function() {
      return queues[docName](opData, callback);
    });
  };
  this.applyMetaOp = function(docName, metaOpData, callback) {
    var op, v;
    v = metaOpData.v, op = metaOpData.op;
    throw new Error('Not implemented');
  };
  this["delete"] = function(docName, callback) {
    events.removeAllListeners(docName);
    delete queues[docName];
    return db["delete"](docName, callback);
  };
  this.usage = function()
  {
  	var count = 0;
  	
  	for (var docName in queues)
  	{
  		count++;
  	}
  	
  	return count + ' share(s) ' + this.clientCount+ ' client(s)';
  };
  events = new Events(this);
  this.listen = events.listen;
  this.removeListener = events.removeListener;
  this.hasListeners = events.hasListeners;
  this.listenFromVersion = events.listenFromVersion;
  auth = options.auth || function(client, action) {
    var _ref;
    if ((_ref = action.type) === 'connect' || _ref === 'read' || _ref === 'create' || _ref === 'update') {
      return action.accept();
    } else {
      return action.reject();
    }
  };
  doAuth = function(client, actionData, name, userCallback, acceptCallback) {
    var action, responded;
    action = actionData || {};
    action.name = name;
    action.type = (function() {
      switch (name) {
        case 'connect':
          return 'connect';
        case 'create':
          return 'create';
        case 'get snapshot':
        case 'get ops':
        case 'open':
          return 'read';
        case 'submit op':
          return 'update';
        case 'delete':
          return 'delete';
        default:
          throw new Error("Invalid action name " + name);
      }
    })();
    responded = false;
    action.reject = function() {
      if (responded) throw new Error('Multiple accept/reject calls made');
      responded = true;
      return userCallback('forbidden', null);
    };
    action.accept = function() {
      if (responded) throw new Error('Multiple accept/reject calls made');
      responded = true;
      return acceptCallback();
    };
    return auth(client, action);
  };
  createClient = function(data) {
    return {
      id: hat(),
      connectTime: new Date,
      headers: data.headers,
      remoteAddress: data.remoteAddress,
      openDocs: {}
    };
  };
  this.clientConnect = function(data, callback) {
    var client;
    this.clientCount++;
    client = createClient(data);
    return doAuth(client, null, 'connect', callback, function() {
      return callback(null, client);
    });
  };
  this.clientDisconnect = function(client) {
    var docName, _results;
    // Handles disconnects from previous clients
    this.clientCount--;
    _results = [];
    for (docName in client.openDocs) {
      _results.push(db.docClosed(docName, client));
    }
    return _results;
  };
  this.clientGetOps = function(client, docName, start, end, callback) {
    var _this = this;
    return doAuth(client, {
      docName: docName,
      start: start,
      end: end
    }, 'get ops', callback, function() {
      return _this.getOps(docName, start, end, callback);
    });
  };
  this.clientGetSnapshot = function(client, docName, callback) {
    var _this = this;
    return doAuth(client, {
      docName: docName
    }, 'get snapshot', callback, function() {
      return _this.getSnapshot(docName, callback);
    });
  };
  this.clientCreate = function(client, docName, type, meta, callback) {
    var _this = this;
    if (typeof type === 'string') type = types[type];
    return doAuth(client, {
      docName: docName,
      docType: type,
      meta: meta
    }, 'create', callback, function() {
      return _this.create(docName, type, meta, callback);
    });
  };
  this.clientSubmitOp = function(client, docName, opData, callback) {
    var _this = this;
    opData.meta || (opData.meta = {});
    opData.meta.source = client.id;
    return doAuth(client, {
      docName: docName,
      op: opData.op,
      v: opData.v,
      meta: opData.meta
    }, 'submit op', callback, function() {
      return _this.applyOp(docName, opData, callback);
    });
  };
  this.clientDelete = function(client, docName, callback) {
    var _this = this;
    return doAuth(client, {
      docName: docName
    }, 'delete', callback, function() {
      return _this["delete"](docName, callback);
    });
  };
  this.clientOpen = function(client, docName, version, listener, callback) {
    var clientDidOpen,
      _this = this;
    clientDidOpen = function() {
      return db.docOpened(docName, client, function(error) {
        if (error) {
          return typeof callback === "function" ? callback(error) : void 0;
        }
        client.openDocs[docName] = true;
        return _this.listenFromVersion(docName, version, listener, function(error, v) {
          if (error) {
            delete client.openDocs[docName];
            db.docClosed(docName, client);
          }
          return typeof callback === "function" ? callback(error, v) : void 0;
        });
      });
    };
    if (version != null) {
      return doAuth(client, {
        docName: docName,
        start: version,
        end: null
      }, 'get ops', callback, function() {
        return doAuth(client, {
          docName: docName,
          v: version
        }, 'open', callback, clientDidOpen);
      });
    } else {
      return doAuth(client, {
        docName: docName
      }, 'open', callback, clientDidOpen);
    }
  };
  return this;
};
