'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('./libs/mongoose')();
var db = require('./db.js');
var sharejs = require('share');
var passport = require('passport');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var SERVER_PORT = 3000;

// app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
var sessionMiddleware = session({secret: 'meepo', saveUninitialized: true, resave: true});
app.use(sessionMiddleware);
io.use(function(socket, next) {
  sessionMiddleware(socket.request, {}, next);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.notice;
  var success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) {
    res.locals.error = err;
  }
  if (msg) {
    res.locals.notice = msg;
  }
  if (success) {
    res.locals.success = success;
  }

  next();
});
app.use(express.static(__dirname + '/../build'));
app.set('views', __dirname + '/../build');
app.set('view engine', 'jade');

require('./routes')(app, db);
require('./libs/passportLocal')(passport);

mongoose.connect();

require('./socketConnections')(io);

var server = http.listen(SERVER_PORT, function() {
  var address = server.address();
  console.log('App listening at http://%s:%s', address.address, address.port);
});

var options = {
  db: {
    type: 'mongo',
    opsCollectionPerDoc: false
  },
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
      action.reject();
    } else {
      action.accept();
    }
  }
};

sharejs.server.attach(app, options);
