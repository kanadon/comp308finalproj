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

router.get('/delete/:id', function(req, res) {
  pollController.DeletePoll(req, res, req.params.id);
});

router.get('/info/:id', function(req, res) {
  pollController.ShowPollInfo(req, res, req.params.id);
});

router.get('/report/:id', function(req, res) {
  pollController.ShowPollReport(req, res, req.params.id);
});

module.exports = router;
