'use strict';

var socket = require('./socket');

var userId;

socket.on('connectedUserId', function(data) {
  userId = data.id;
});

module.exports = {

  id: function() {
    return userId;
  }

};
