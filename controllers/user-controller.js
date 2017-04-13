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
      return res.render('pages/login', {message: 'Wrong credentials.', session: req.session});

    var session = req.session;
    session.authenticated = true;
    session.user = doc[0];
    res.redirect('/user/account');
  });
};

exports.ShowAccountInfo = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  res.render('pages/user', {user: req.session.user, session: req.session});
};

exports.ModifyAccountInfo = function (req, res, email, password) {
  if (!req.session.user)
    return res.redirect('/login');

  var user = req.session.user;

  if (email.toLowerCase() === user.email && password === user.password) {
    return res.render('pages/user', {message: 'No changes to save.', user: req.session.user, session: req.session});
  }
  else if (email.toLowerCase() !== user.email) {

    dbhelper.IsEmailUnique(email, function (result) {
      if (!result)
        return res.render('pages/user', {
          message: 'This email has been taken.',
          user: req.session.user,
          session: req.session
        });

      dbhelper.UpdateUser(user.username, email, password, function (err) {
        if (err)
          return res.render('pages/user', {
            message: 'Something went wrong...',
            user: req.session.user,
            session: req.session
          });

        user.email = email;
        user.password = password;
        return res.render('pages/user', {message: 'Changes saved', user: req.session.user, session: req.session});
      });
    });
  }
  else if (password !== user.password) {
    dbhelper.UpdateUser(user.username, user.email, password, function (err) {
      if (err)
        return res.render('pages/user', {
          message: 'Something went wrong...',
          user: req.session.user,
          session: req.session
        });

      user.password = password;
      return res.render('pages/user', {message: 'Changes saved', user: req.session.user, session: req.session});
    });
  }
};

exports.Register = function (req, res, username, email, password) {
  dbhelper.IsUsernameUnique(username, function (unique) {
    if (!unique)
      return res.render('pages/register', {message: 'This username has been taken.', session: req.session});

    dbhelper.IsEmailUnique(email, function (unique) {
      if (!unique)
        return res.render('pages/register', {message: 'This email has been taken.', session: req.session});

      var newUser = {
        username: username,
        email: email,
        password: password
      };

      dbhelper.CreateUser(newUser, function (err) {
        if (err)
          return res.render('pages/register', {message: 'Something went wrong...', session: req.session});

        req.session.user = newUser;
        return res.redirect('/user/account');
      });
    });
  });
};

exports.ShowUserPolls = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  dbhelper.GetPollsByUser(req.session.user.username, function (polls) {
    res.render('pages/user-polls', {polls: polls, session: req.session});
  });
};
