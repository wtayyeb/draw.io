var Manager, defaultType;

defaultType = 'redis';

Manager = require('./manager');

module.exports = function(options) {
  var Db, db, type, _ref;
  if (options == null) options = {};
  type = (_ref = options.type) != null ? _ref : defaultType;
  if (type === 'memory') {
    console.warn("Database type: 'memory' detected. This has been deprecated and will be removed in a future version. Use 'none' instead, or just remove the db:{} block from your options. (The behaviour has remained the same.)");
  }
  db = type === 'none' || type === 'memory' ? null : (Db = (function() {
    switch (type) {
      case 'redis':
        return require('./redis');
      case 'couchdb':
        return require('./couchdb');
      default:
        throw new Error("Invalid or unsupported database type: '" + type + "'");
    }
  })(), new Db(options));
  return new Manager(db);
};
