/**
 * Created by DENIS on 08/04/2017.
 */

var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller');


router.get('/', function(req, res) {
  userController.ShowAccountInfo(req, res);
});

router.get('/polls', function(req, res) {
  userController.ShowMyPolls(req, res);
});


router.post('/login', function (req, res) {
  userController.Login(req, res, req.body.username, req.body.password);
});

router.post('/register', function (req, res) {
  userController.Register(req, res, req.body.username, req.body.email, req.body.password);
});


module.exports = router;
