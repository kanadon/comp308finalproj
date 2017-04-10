/**
 * Created by DENIS on 08/04/2017.
 */

// this controller handles showing the landing, login and registration pages

exports.ShowHome = function (req, res) {
  res.render('pages/home');
};

exports.ShowLogin = function (req, res) {
  res.render('pages/login');
};

exports.ShowRegister = function (req, res) {
  res.render('pages/register');
};

