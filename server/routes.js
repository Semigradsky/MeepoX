'use strict';

var passport = require('passport');

module.exports = function(app, db) {

  app.get('/', function(req, res) {
    res.render('signin');
  });

  app.post('/local-auth', passport.authenticate('local-signin', {
      successRedirect: '/projects',
      failureRedirect: '/'
    })
  );

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/local-reg', passport.authenticate('local-signup', {
      successRedirect: '/projects',
      failureRedirect: '/signup'
    })
  );

  app.get('/logout', function(req, res) {
    req.session.destroy(function() {
      res.redirect('/');
    });
  });

  app.get('/projects', ensureAuthenticated, function(req, res) {
    var name = req.user.username;
    var rooms = req.user.rooms;

    db.user.getById(req.user._id).then(function(user) {
      rooms = user.rooms;

      res.render('projects', {user: name, projects: rooms});
    });
  });

  app.post('/new-project', function(req, res) {
    db.room.create(req.body, req.user._id).then(function(room) {
      res.redirect('/' + room.docName);
    }, function(err) {
      console.log(err);
      req.session.error = err;
      res.redirect('/projects');
    });
  });

  app.get('/:id', function(req, res) {
      var name = '';
      if (req.user) {
        name = req.user.username;
      }
      res.render('index', {user: name});
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.error = 'Please sign in!';
    res.redirect('/');
  }
};
