/**
 * Created by DENIS on 09/04/2017.
 */

var express = require('express');
var router = express.Router();
var pollController = require('../controllers/poll-controller');


router.get('/vote/:id', function(req, res) {
  pollController.ShowPoll(req, res, req.params.id);
});

router.post('/vote/:id', function(req, res) {
  pollController.AnswerPoll(req, res, req.params.id);
});

router.get('/create', function(req, res) {
  pollController.ShowCreatePoll(req, res);
});

router.post('/create', function(req, res) {
  pollController.CreatePoll(req, res);
});

// router.get('/polls', function(req, res) {
//   userController.ShowMyPolls(req, res);
// });
//
//
// router.post('/login', function (req, res) {
//   userController.Login(req, res, req.body.username, req.body.password);
// });
//
// router.post('/register', function (req, res) {
//   userController.Register(req, res, req.body.username, req.body.email, req.body.password);
// });
//
// router.post('/account', function (req, res) {
//   userController.ModifyAccountInfo(req, res, req.body.email, req.body.password);
// });



module.exports = router;
