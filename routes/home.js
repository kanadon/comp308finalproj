/**
 * Created by DENIS on 08/04/2017.
 */

var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home-controller');

router.get(['/', '/home'], function (req, res) {
  homeController.ShowHome(req, res);
});

router.get('/login', function(req, res) {
  homeController.ShowLogin(req, res);
});

router.get('/register', function(req, res) {
  homeController.ShowRegister(req, res);
});

module.exports = router;
