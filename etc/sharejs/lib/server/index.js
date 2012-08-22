var Db, Model, attach, connect, create, createModel, socketio;

connect = require('connect');

Model = require('./model');

Db = require('./db');

//rest = require('./rest');

socketio = require('./socketio');

module.exports = create = function(options, model) {
  if (model == null) model = createModel(options);
  return attach(connect(), options, model);
};

create.createModel = createModel = function(options) {
  var db, dbOptions;
  dbOptions = options != null ? options.db : void 0;
  db = new Db(dbOptions);
  return new Model(db, options);
};

create.attach = attach = function(server, options, model) {
  if (model == null) model = createModel(options);
  if (options == null) options = {};
  if (options.staticpath == null) options.staticpath = '/share';
  server.model = model;
  if (options.staticpath !== null) {
    //server.use(options.staticpath, connect.static("" + __dirname + "/../../webclient"));
  }
  //if (options.rest !== null) server.use(rest(model, options.rest));
  if (options.socketio !== null) {
    socketio.attach(server, model, options.socketio || {});
  }
  /*if (options.browserChannel !== null) {
    server.use(browserChannel(model, options.browserChannel));
  }*/
  return server;
};
