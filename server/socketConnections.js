'use strict';

var db = require('./db.js');

function connection(socket, io) {
  if (socket.request.session.passport && socket.request.session.passport.user) {
    socket.userId = socket.request.session.passport.user._id;
    socket.readonly = false;
  } else {
    socket.readonly = true;
  }

  socket.on('connectToRoom', function(roomId) {
    socket.roomId = roomId;
    socket.join(roomId);
    socket.emit('connectedUserId', {id: socket.userId});
    socket.emit('connectedUserReadonly', {readonly: socket.readonly});
    db.room.getUsers(roomId).then(function(users) {
      io.to(roomId).emit('usersUpdate', users);
    });
  });

  socket.on('userConnect', function() {
    if (socket.readonly) {
      return;
    }

    var roomId = socket.roomId;
    var userId = socket.userId;

    db.room.update.addUser(roomId, userId).then(function() {
      return db.room.getUsers(roomId);
    }).then(function(users) {
      io.to(roomId).emit('usersUpdate', users);
    }).catch(function(error) {
      console.log(error);
    });
  });

  socket.on('disconnect', function() {
    var roomId = socket.roomId;
    var userId = socket.userId;

    socket.leave(roomId);

    if (socket.readonly) {
      return;
    }

    io.to(roomId).emit('markerRemove', {userId: userId});
    db.room.update.removeUser(roomId, userId).then(function() {
      return db.room.getUsers(roomId);
    }).then(function(users) {
      io.to(roomId).emit('usersUpdate', users);
    });
  });

  socket.on('userCursorPosition', function(position) {
    if (socket.readonly) {
      return;
    }

    var roomId = socket.roomId;
    var userId = socket.userId;

    db.room.user.setCursor(roomId, userId, position).then(function() {
      return db.room.user.get(roomId, userId);
    }).then(function(user) {
      io.to(roomId).emit('markerUpdate', user);
    }).catch(function(error) {
      console.log(error);
    });
  });
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    connection(socket, io);
  });
};
