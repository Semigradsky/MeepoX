/*jshint -W079 */
'use strict';

var Promise = require('es6-promise').Promise;
var RoomModel = require('./models/room');
var UserModel = require('./models/user');
var intercept = require('./libs/intercept');

function createRoom(room, creator) {
  return new Promise(function(resolve, reject) {
    if (!room.projectname) {
      reject(new Error('Project Name not specified'));
    }

    room = new RoomModel({
      name: room.projectname,
      description: room.description,
      readOnly: room.readonly === 'on',
      creator: creator
    });

    room.save(intercept(reject, function(room) {

      UserModel.getUser(creator, intercept(reject, function(user) {
        user.addRoom(room.id);
      }, 'User does not exist'));

      resolve(room);
    }));

  });
}

function getRoom(roomId) {
  return new Promise(function(resolve, reject) {

    RoomModel.getRoom(roomId, intercept(reject, function(room) {
      resolve(room);
    }, 'Room not found'));

  });
}

function getUsersFromRoom(roomId) {
  return new Promise(function(resolve, reject) {

    RoomModel.getUsers(roomId, intercept(reject, function(foundUsers) {
      resolve(foundUsers);
    }, 'Room does not exist'));

  });
}

function addUserToRoom(roomId, userId) {
  return new Promise(function(resolve, reject) {

    RoomModel.getRoom(roomId, intercept(reject, function(room) {
        room.addUser(userId, intercept(reject, function() {
            resolve();
        }));
    }, 'Room does not exist'));

  });
}

function removeUserFromRoom(roomId, userId) {
  return new Promise(function(resolve, reject) {

    RoomModel.getRoom(roomId, intercept(reject, function(room) {
      room.removeUser(userId, function(found) {
        resolve(found);
      });
    }, 'Room does not exist'));

  });
}

function userUpdateCursorPosition(roomId, userId, cursorPosition) {
  return new Promise(function(resolve, reject) {

    RoomModel.getRoom(roomId, intercept(reject, function(room) {
      room.userSetCursor(userId, cursorPosition, intercept(reject, function() {
        resolve();
      }));
    }), 'Room does not exist');

  });
}

function getUser(roomId, userId) {
  return new Promise(function(resolve, reject) {

    RoomModel.getUser(roomId, userId, intercept(reject, function(user) {
        resolve(user);
    }, reject));

  });
}

function userLocalRegister(userName, userPassword) {
  return new Promise(function(resolve, reject) {

    UserModel.findUserByName(userName, intercept(reject, function() {
      resolve(false);
    }, function() {
      var user = new UserModel({username: userName, password: userPassword});
      user.save(intercept(reject, function(user) {
        resolve(user);
      }));
    }));

  });
}

function userLocalAuth(userName, userPassword) {
  return new Promise(function(resolve, reject) {

    UserModel.findUserByName(userName, intercept(reject, function(user) {
      if (user.checkPassword(userPassword)) {
        resolve(user);
      } else {
        resolve(false);
      }
    }, function() {
      resolve(false);
    }));

  });
}

function getUserById(userId) {
  return new Promise(function(resolve, reject) {

    UserModel.getUser(userId, intercept(reject, function(user) {
      resolve(user);
    }, function() {
      resolve(false);
    }));

  });
}

module.exports = {
  room: {
    create: createRoom,
    get: getRoom,
    getUsers: getUsersFromRoom,
    update: {
      addUser: addUserToRoom,
      removeUser: removeUserFromRoom
    },
    user: {
      setCursor: userUpdateCursorPosition,
      get: getUser
    }
  },
  user: {
    localReg: userLocalRegister,
    localAuth: userLocalAuth,
    getById: getUserById
  }
};
