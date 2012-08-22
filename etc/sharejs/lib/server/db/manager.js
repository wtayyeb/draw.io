var DocCache, types;

types = require('../../types');

module.exports = DocCache = function(db, options) {
  var add, awaitingGetSnapshot, docs, getOpsInternal, load, refreshReapingTimeout, tryWriteSnapshot;
  if (!(this instanceof DocCache)) return new DocCache(db, options);
  if (options == null) options = {};
  docs = {};
  awaitingGetSnapshot = {};
  if (options.reapTime == null) options.reapTime = 3000;
  if (options.numCachedOps == null) options.numCachedOps = 10;
  if (options.forceReaping == null) options.forceReaping = false;
  if (options.opsBeforeCommit == null) options.opsBeforeCommit = 20;
  add = function(docName, error, data, dbMeta) {
    var callback, callbacks, doc, _i, _j, _len, _len2;
    callbacks = awaitingGetSnapshot[docName];
    delete awaitingGetSnapshot[docName];
    if (error) {
      if (callbacks) {
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback(error);
        }
      }
    } else {
      doc = docs[docName] = {
        ops: new Array(options.numCachedOps),
        data: {
          snapshot: data.snapshot,
          v: data.v,
          type: data.type,
          meta: data.meta
        },
        clients: {},
        reapTimer: null,
        committedVersion: data.v,
        snapshotWriteLock: false,
        dbMeta: dbMeta
      };
      refreshReapingTimeout(docName);
      if (callbacks) {
        for (_j = 0, _len2 = callbacks.length; _j < _len2; _j++) {
          callback = callbacks[_j];
          callback(null, doc);
        }
      }
    }
    return doc;
  };
  getOpsInternal = function(docName, start, end, callback) {
    if (!db) return callback('Document does not exist');
    return db.getOps(docName, start, end, function(error, ops) {
      var op, v, _i, _len;
      if (error) return callback(error);
      v = start;
      for (_i = 0, _len = ops.length; _i < _len; _i++) {
        op = ops[_i];
        op.v = v++;
      }
      return callback(null, ops);
    });
  };
  load = function(docName, callback) {
    var callbacks, _ref, _ref2;
    if (docs[docName]) {
      if ((_ref = options.stats) != null) {
        if (typeof _ref.cacheHit === "function") _ref.cacheHit('getSnapshot');
      }
      return callback(null, docs[docName]);
    } else {
      if (!db) return callback('Document does not exist');
      callbacks = awaitingGetSnapshot[docName];
      if (callbacks) {
        return callbacks.push(callback);
      } else {
        if ((_ref2 = options.stats) != null) {
          if (typeof _ref2.cacheMiss === "function") {
            _ref2.cacheMiss('getSnapshot');
          }
        }
        awaitingGetSnapshot[docName] = [callback];
        return db.getSnapshot(docName, function(error, data, dbMeta) {
          var type;
          if (error) return add(docName, error);
          type = types[data.type];
          if (!type) {
            console.warn("Type '" + data.type + "' missing");
            return callback("Type not found");
          }
          data.type = type;
          return getOpsInternal(docName, data.v, null, function(error, ops) {
            var op, _i, _len;
            if (error) return callback(error);
            if (ops.length > 0) {
              console.log("Catchup " + docName + " " + data.v + " -> " + (data.v + ops.length));
              try {
                for (_i = 0, _len = ops.length; _i < _len; _i++) {
                  op = ops[_i];
                  data.snapshot = type.apply(data.snapshot, op.op);
                  data.v++;
                }
              } catch (e) {
                console.error("Op data invalid for " + docName + ": " + e.stack);
                return callback('Op data invalid');
              }
            }
            return add(docName, error, data, dbMeta);
          });
        });
      }
    }
  };
  refreshReapingTimeout = function(docName) {
    var doc;
    doc = docs[docName];
    if (!doc) return;
    return process.nextTick(function() {
      var reapTimer;
      if (doc === docs[docName] && Object.keys(doc.clients).length === 0 && (db || options.forceReaping)) {
        clearTimeout(doc.reapTimer);
        return doc.reapTimer = reapTimer = setTimeout(function() {
          return tryWriteSnapshot(docName, function() {
            if (docs[docName].reapTimer === reapTimer) return delete docs[docName];
          });
        }, options.reapTime);
      }
    });
  };
  this.docOpened = function(docName, client, callback) {
    return load(docName, function(error, doc) {
      if (error) {
        return typeof callback === "function" ? callback(error) : void 0;
      } else {
        clearTimeout(doc.reapTimer);
        doc.clients[client.id] = client;
        return typeof callback === "function" ? callback(null) : void 0;
      }
    });
  };
  this.docClosed = function(docName, client) {
    var doc;
    doc = docs[docName];
    if (!doc) throw new Error('docClosed but document not loaded');
    delete doc.clients[client.id];
    return refreshReapingTimeout(docName);
  };
  this.getOps = function(docName, start, end, callback) {
    var base, ops, version, _ref, _ref2, _ref3;
    if (!(start >= 0)) throw new Error('start must be 0+');
    ops = (_ref = docs[docName]) != null ? _ref.ops : void 0;
    if (ops != null) {
      version = docs[docName].data.v;
      if (end == null) end = version;
      start = Math.min(start, end);
      base = version - ops.length;
      if (start >= base || db === null) {
        refreshReapingTimeout(docName);
        if ((_ref2 = options.stats) != null) _ref2.cacheHit('getOps');
        return callback(null, ops.slice(start - base, (end - base)));
      }
    }
    if ((_ref3 = options.stats) != null) _ref3.cacheMiss('getOps');
    return getOpsInternal(docName, start, end, callback);
  };
  this.create = function(docName, data, callback) {
    var type;
    if (docs[docName]) {
      return typeof callback === "function" ? callback('Document already exists') : void 0;
    } else {
      if (data.snapshot === void 0) throw new Error('snapshot missing from data');
      if (data.type === void 0) throw new Error('type missing from data');
      if (typeof data.v !== 'number') throw new Error('version missing from data');
      if (typeof data.meta !== 'object') throw new Error('meta missing from data');
      if (typeof data.type === 'string') {
        type = types[data.type];
        if (!type) return callback('Type not found');
      } else {
        type = data.type;
        data.type = data.type.name;
      }
      if (db) {
        return db.create(docName, data, function(error, dbMeta) {
          if (error) {
            return typeof callback === "function" ? callback(error) : void 0;
          } else {
            data.type = type;
            add(docName, null, data, dbMeta);
            return typeof callback === "function" ? callback() : void 0;
          }
        });
      } else {
        data.type = type;
        add(docName, null, data);
        return typeof callback === "function" ? callback() : void 0;
      }
    }
  };
  this["delete"] = function(docName, callback) {
    var dbMeta, _ref, _ref2;
    clearTimeout((_ref = docs[docName]) != null ? _ref.reapTimer : void 0);
    if (db) {
      dbMeta = (_ref2 = docs[docName]) != null ? _ref2.dbMeta : void 0;
      delete docs[docName];
      return db["delete"](docName, dbMeta, callback);
    } else {
      if (docs[docName]) {
        delete docs[docName];
        return typeof callback === "function" ? callback() : void 0;
      } else {
        return typeof callback === "function" ? callback('Document does not exist') : void 0;
      }
    }
  };
  tryWriteSnapshot = function(docName, callback) {
    var data, doc, writeSnapshot, _ref;
    if (!db) return typeof callback === "function" ? callback() : void 0;
    doc = docs[docName];
    if (!doc) return typeof callback === "function" ? callback() : void 0;
    if (doc.committedVersion === doc.data.v) {
      return typeof callback === "function" ? callback() : void 0;
    }
    if (doc.snapshotWriteLock) {
      return typeof callback === "function" ? callback('Another snapshot write is in progress') : void 0;
    }
    doc.snapshotWriteLock = true;
    if ((_ref = options.stats) != null) {
      if (typeof _ref.writeSnapshot === "function") _ref.writeSnapshot();
    }
    writeSnapshot = (db != null ? db.writeSnapshot : void 0) || function(docName, docData, dbMeta, callback) {
      return callback();
    };
    data = {
      v: doc.data.v,
      meta: doc.data.meta,
      snapshot: doc.data.snapshot,
      type: doc.data.type.name
    };
    return writeSnapshot(docName, data, doc.dbMeta, function(error, dbMeta) {
      doc.snapshotWriteLock = false;
      doc.committedVersion = data.v;
      doc.dbMeta = dbMeta;
      return typeof callback === "function" ? callback(error) : void 0;
    });
  };
  this.append = function(docName, newOpData, newDocData, callback) {
    if (newDocData.snapshot === void 0) {
      throw new Error('snapshot missing from data');
    }
    if (newDocData.type === void 0) throw new Error('type missing from data');
    return load(docName, function(error, doc) {
      var writeOp, _ref;
      if (error) return typeof callback === "function" ? callback(error) : void 0;
      if ((doc.data.v !== (_ref = newOpData.v) || _ref !== newDocData.v - 1)) {
        console.error("Version mismatch detected in cache. File a ticket - this is a bug.");
        console.error("Expecting " + doc.data.v + " == " + newOpData.v + " == " + (newDocData.v - 1));
        return typeof callback === "function" ? callback('Version mismatch in cache.append') : void 0;
      }
      writeOp = (db != null ? db.writeOp : void 0) || function(docName, newOpData, callback) {
        return callback();
      };
      return writeOp(docName, newOpData, function(error) {
        var _ref2;
        if (error) {
          console.warn("Error writing ops to database: " + error);
          return typeof callback === "function" ? callback(error) : void 0;
        }
        doc.data.v = newDocData.v;
        doc.data.snapshot = newDocData.snapshot;
        doc.data.meta = newDocData.meta;
        doc.ops.push(newOpData);
        if (db && doc.ops.length > options.numCachedOps) doc.ops.shift();
        callback();
        if ((_ref2 = options.stats) != null) {
          if (typeof _ref2.writeOp === "function") _ref2.writeOp();
        }
        if (!doc.snapshotWriteLock && doc.committedVersion + options.opsBeforeCommit <= newDocData.v) {
          return tryWriteSnapshot(docName, function(error) {
            if (error) {
              return console.warn("Error writing snapshot " + error + ". This will increase document loading time but is nonfatal");
            }
          });
        }
      });
    });
  };
  this.getSnapshot = function(docName, callback) {
    return load(docName, function(error, doc) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, doc.data);
      }
    });
  };
  this.getVersion = function(docName, callback) {
    return this.getSnapshot(docName, function(error, data) {
      return callback(error, data != null ? data.v : void 0);
    });
  };
  this.flush = function(callback) {
    var doc, docName, pendingWrites;
    if (!db) return typeof callback === "function" ? callback() : void 0;
    pendingWrites = 0;
    for (docName in docs) {
      doc = docs[docName];
      if (doc.committedVersion < doc.data.v) {
        pendingWrites++;
        tryWriteSnapshot(docName, function() {
          return process.nextTick(function() {
            pendingWrites--;
            if (pendingWrites === 0) {
              return typeof callback === "function" ? callback() : void 0;
            }
          });
        });
      }
    }
    if (pendingWrites === 0) {
      return typeof callback === "function" ? callback() : void 0;
    }
  };
  this.close = function(callback) {
    return this.flush(function() {
      if (db != null) db.close();
      return typeof callback === "function" ? callback() : void 0;
    });
  };
  return this;
};
