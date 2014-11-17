'use strict';

var mongoose = require('mongoose');

module.exports = function() {
  var connect = function(db) {
    db = db || 'meepo';

    mongoose.connect('mongodb://localhost/' + db);

    mongoose.connection.on('error', function(err) {
      console.log('connection error:', err.message);
    });
  };

  return {
    connect: connect
  };
};
