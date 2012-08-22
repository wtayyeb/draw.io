var __slice = Array.prototype.slice;

module.exports = function(process) {
  var busy, flush, queue;
  if (typeof process !== 'function') throw new Error('process is not a function');
  queue = [];
  busy = false;
  flush = function() {
    var callback, data, _ref;
    if (busy || queue.length === 0) return;
    busy = true;
    _ref = queue.shift(), data = _ref[0], callback = _ref[1];
    return process(data, function() {
      var result;
      result = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (callback) callback.apply(null, result);
      busy = false;
      return flush();
    });
  };
  return function(data, callback) {
    queue.push([data, callback]);
    return flush();
  };
};
