/**
 * Created by DENIS on 08/04/2017.
 */
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
      res.redirect('/user');
  });
};

exports.ShowAccountInfo = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  res.render('pages/user', {user: req.session.user});
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
        if(err)
          return res.render('pages/register', {message: 'Something went wrong...'});

        req.session.user = result;
        return res.redirect('/user');
      });
    });
  });



};

exports.ShowMyPolls = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  res.render('pages/user-polls', {polls: req.session.user.polls});
};
