'use strict';

var mongoose = require('mongoose');
var color = require('../libs/generators/color');
var id = require('../libs/generators/id');

var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    require: true
  },
  docName: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    default: ''
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  users: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    userCursor: {
      type: Schema.Types.Mixed,
      default: {row: 0, collumn: 0}
    },
    userColor: {
      type: String,
      default: 'rgb(55, 191, 92);'
    }
  }],
  colors: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RoomSchema.pre('save', function(next) {
  if (this.isNew) {
    this.colors = [
      '#375066', '#42243c', '#8a0606', '#f5870a', '#035439', '#0960e3', '#782367', '#ad5e5e', '#423824', '#0af5c6',
      '#5e68ad', '#f547a4', '#e30909', '#8a7d4a', '#32ada5', '#0909e3', '#780533', '#f5a284', '#bfb308', '#033e42',
      '#0b0342', '#f50a48', '#421c03', '#395403', '#0ac6f5', '#420578', '#9c682d', '#8ed108', '#0776ad', '#ad42e3',
      '#f5c084', '#37bf5c'
    ];
    this.docName = id();
  }

  next();
});

RoomSchema.methods = {
  addUser: function(userId, cb) {
    this.users.push({
      user: userId,
      userColor: this.getColor()
    });

    this.save(cb);
  },

  removeUser: function(userId, cb) {
    var _this = this;
    var foundUser = false;

    this.users.some(function(user, pos) {
      if (user.user.toString() === userId.toString()) {
        _this.restoreColor(user.userColor);
        _this.users.splice(pos, 1);
        foundUser = true;
        return true;
      }
    });

    this.save();
    cb(foundUser);
  },

  userSetCursor: function(userId, position, cb) {
    this.users.some(function(user) {
      if (user.user.toString() === userId.toString()) {
        user.userCursor = position;
        return true;
      }
    });

    this.save(cb);
  },

  getColor: function() {
    if (this.colors.length) {
      return this.colors.pop();
    } else {
      return color();
    }
  },

  restoreColor: function(color) {
    this.colors.push(color);
    this.save();
  }
};

RoomSchema.statics = {
  getRoom: function(roomId, cb) {
    this.findOne({docName: roomId}, cb);
  },

  getUsers: function(roomId, cb) {
    this.findOne({docName: roomId})
      .populate('users.user', 'username')
      .exec(function(err, data) {
        if (err || !data) {
          cb(err, null);
          return;
        }

        var resUsers = data.users.map(function(user) {
          return transformUser(user);
        });
        cb(null, resUsers);
      });
  },

  getUser: function(roomId, userId, cb) {
    this.findOne({docName: roomId, 'users.user': userId})
      .populate('users.user', 'username')
      .exec(function(err, data) {
        if (err || !data) {
          cb(err, null);
          return;
        }

        data.users.forEach(function(user) {
          if (user.user._id.toString() === userId.toString()) {
            cb(null, transformUser(user));
          }
        });
      });
  }
};

var transformUser = function(user) {
  return {
    userId: user.user._id.toString(),
    userName: user.user.username,
    userColor: user.userColor,
    userCursor: user.userCursor
  };
};

var RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;
