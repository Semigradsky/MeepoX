'use strict';

var crypto = require('crypto');

module.exports = function() {
  return crypto.randomBytes(32).toString('base64');
};
