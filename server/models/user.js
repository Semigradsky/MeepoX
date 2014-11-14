'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // _id: String, // пока нет регистрации
  name: {
    type: String,
    required: true
  },
  // id: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
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
      type: String,
      // type: Schema.ObjectId,
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
      room: roomId,
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
    this.findOne({id: userId}, cb);
  },

  findUserByName: function(userName, cb) {
    this.findOne({name: userName}, cb);
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
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
  });

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
