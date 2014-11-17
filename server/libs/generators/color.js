'use strict';

module.exports = function() {
  var r = Math.round((Math.random() * 255) / 2);
  var g = Math.round((Math.random() * 255) / 2);
  var b = Math.round((Math.random() * 255) / 2);
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
};
