'use strict';

module.exports = function() {
  return (Math.random() * 255).toString(32).replace('.', '');
};
