'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var salt = require('../libs/generators/salt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  rooms: [{
    room: {
      type: Schema.ObjectId,
      ref: 'Room'
    }
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods = {
  encryptPassword: function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  checkPassword: function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  },

  addRoom: function(roomId, cb) {
    this.rooms.push({
      room: roomId
    });

    this.save(cb);
  },

  deleteRoom: function(roomId, cb) {
    var _this = this;

    this.rooms.some(function(room, pos) {
      if (room.room === roomId) {
        _this.rooms.splice(pos, 1);
      }
    });

    this.save(cb);
  }
};

UserSchema.statics = {
  getUser: function(userId, cb) {
    this.findById(userId)
      .populate('rooms.room', 'name description docName readOnly')
      .exec(cb);
  },

  findUserByName: function(userName, cb) {
    this.findOne({username: userName})
      .populate('rooms.room', 'name description docName readOnly')
      .exec(cb);
  }
};

UserSchema.virtual('id')
  .set(function(id) {
    this._id = id;
  })
  .get(function() {
    return this._id;
  });

UserSchema.virtual('password')
  .set(function(password) {
    this.salt = salt();
    this.hashedPassword = this.encryptPassword(password);
  });

UserSchema.virtual('fullname')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  });

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
