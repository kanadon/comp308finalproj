/**
 * Created by DENIS on 08/04/2017.
 */

// this controller handles all user related logic (creation, modification, logging in, etc.)

var dbhelper = require('../helpers/db');

exports.Login = function (req, res, username, password) {
  var db = dbhelper.GetDB();
  var user = db.collection('users').find({
    username: username,
    password: password
  });

  user.toArray(function (err, doc) {
    if (err || doc.length === 0)
      return res.redirect('/login');

    var session = req.session;
    session.authenticated = true;
    session.user = doc[0];
    res.redirect('/user/account');
  });
};

exports.ShowAccountInfo = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  res.render('pages/user', {user: req.session.user});
};

exports.ModifyAccountInfo = function (req, res, email, password) {
  if (!req.session.user)
    return res.redirect('/login');

  var user = req.session.user;

  if (email == user.email && password == user.password) {
    return res.render('pages/user', {message: 'No changes to save.', user: req.session.user});
  }
  else if (email != user.email) {

    dbhelper.IsEmailUnique(email, function (result) {
      if (!result)
        return res.render('pages/user', {message: 'This email has been taken.', user: req.session.user});

      dbhelper.UpdateUser(user.username, email, password, function (err, result) {
        if (err)
          return res.render('pages/user', {message: 'Something went wrong...', user: req.session.user});

        user.email = email;
        user.password = password;
        return res.render('pages/user', {message: 'Changes saved', user: req.session.user});
      });
    });
  }
  else if (password != user.password) {
    dbhelper.UpdateUser(user.username, user.email, password, function (err, result) {
      if (err)
        return res.render('pages/user', {message: 'Something went wrong...', user: req.session.user});

      user.password = password;
      return res.render('pages/user', {message: 'Changes saved', user: req.session.user});
    });
  }
};

exports.Register = function (req, res, username, email, password) {
  var db = dbhelper.GetDB();
  var userWithUsername = db.collection('users').find({
    username: username
  });

  userWithUsername.toArray(function (err, doc) {
    if (doc.length !== 0)
      return res.render('pages/register', {message: 'This username has been taken.'});

    var userWithEmail = db.collection('users').find({
      email: email
    });

    userWithEmail.toArray(function (err, doc) {
      if (doc.length !== 0)
        return res.render('pages/register', {message: 'This email has been taken.'});


      db.collection('users').insertOne({
        username: username,
        email: email,
        password: password
      }, function (err, result) {
        if (err)
          return res.render('pages/register', {message: 'Something went wrong...'});

        req.session.user = {
          username: username,
          email: email,
          password: password
        };
        return res.redirect('/user/account');
      });
    });
  });


};

exports.ShowUserPolls = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  dbhelper.GetPollsByUser(req.session.user.username, function (polls) {
    res.render('pages/user-polls', {polls: polls});
  });
};
