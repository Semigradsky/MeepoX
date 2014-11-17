'use strict';

var socket = require('./socket');

function onConnect() {
  socket.emit('connectToRoom', window.location.pathname.slice(1));
}

function connect(userName) {
  socket.emit('userConnect', userName);
}

socket.on('connect', onConnect);

module.exports = {
  connect: connect,
  socket: socket.io.engine
};
