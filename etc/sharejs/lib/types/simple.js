
exports.apply = function(snapshot, op) {
  var str, _ref;
  if (!((0 <= (_ref = op.position) && _ref <= snapshot.str.length))) {
    throw new Error('Invalid position');
  }
  str = snapshot.str;
  str = str.slice(0, op.position) + op.text + str.slice(op.position);
  snapshot.str = str;
  return snapshot;
};

exports.transform = function(op1, op2) {
  var pos;
  pos = op1.position;
  if (op2.position < pos) pos += op2.text.length;
  return {
    position: pos,
    text: op1.text
  };
};

exports.create = function() {
  return {
    str: ""
  };
};

exports.name = 'simple';
