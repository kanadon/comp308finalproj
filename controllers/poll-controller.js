/**
 * Created by DENIS on 09/04/2017.
 */

// this controller handles all logic regarding polls (creation, submission, etc.)

var dbhelper = require('../helpers/db');
var utilities = require('../helpers/utilities');

exports.ShowPoll = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll === null)
      return res.render('pages/poll', {message: 'Cannot find poll.', session: req.session});

    var now = Date.now();

    if (poll.startTime > now)
      return res.render('pages/poll', {message: 'This poll has not started yet.', session: req.session});

    else if (poll.endTime && poll.endTime < now)
      return res.render('pages/poll', {message: 'This poll has ended.', session: req.session});

    return res.render('pages/poll', {poll: poll, session: req.session});
  });
};

exports.ShowPollInfo = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll === null)
      return res.render('pages/poll-info', {message: 'Cannot find poll.', session: req.session});

    return res.render('pages/poll-info', {poll: poll, session: req.session});
  });
};

exports.ShowCreatePoll = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  return res.render('pages/create-poll', {session: req.session});
};

exports.CreatePoll = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  var newPoll = {
    user: req.session.user.username,
    title: req.body.title,
    questions: req.body.questions,
    startTime: Date.parse(req.body.startTime),
    endTime: Date.parse(req.body.endTime),
    totalResponses: 0
  };

  if (newPoll.type === 'tf') {
    if (req.body.true === req.body.false)
      return res.render('pages/create-poll', {message: 'Options cannot be identical.', session: req.session});

    newPoll.options = [
      {
        name: req.body.true,
        answers: 0
      },
      {
        name: req.body.false,
        answers: 0
      }
    ]
  }
  else if (newPoll.type === 'mc') {
    if (utilities.CheckArrayForDuplicates(
        [req.body.option1, req.body.option2, req.body.option3, req.body.option4]
      ))
      return res.render('pages/create-poll', {message: 'Options cannot be identical.', session: req.session});

    newPoll.options = [
      {
        name: req.body.option1,
        answers: 0
      },
      {
        name: req.body.option2,
        answers: 0
      },
      {
        name: req.body.option3,
        answers: 0
      },
      {
        name: req.body.option4,
        answers: 0
      }
    ]
  }

  dbhelper.CreatePoll(newPoll, function (created) {
    if (!created)
      return res.render('pages/create-poll', {message: 'Something went wrong...', session: req.session});

    return res.render('pages/create-poll', {message: 'Your poll has been created.', session: req.session});
  });

};

exports.DeletePoll = function (req, res, pollID) {
  if (!req.session.user)
    return res.redirect('/login');


  dbhelper.DeletePoll(pollID, function (success) {
    if (!success)
      return res.redirect('/user/polls');
    else
      return res.redirect('/user/polls');
  });
};

exports.AnswerPoll = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll === null)
      return res.render('pages/poll', {message: 'Cannot find poll.', session: req.session});

    var updatedPoll = poll;
    var pollAnswers = req.body;

    for (var i = 0; i < updatedPoll.questions.length; i++) {
      var options = updatedPoll.questions[i].options;
      var answers = pollAnswers[i];

      for (var j = 0; j < options.length; j++) {
        if (answers[j] === true) {
          options[j].responses += 1;
        }
      }
    }

    updatedPoll.totalResponses += 1;

    dbhelper.UpdatePoll(pollID, updatedPoll, function (success) {
      // return res.render('pages/poll', {message: 'Thank you for the vote!', session: req.session});
      return res.send({
        success: 'true'
      });
    });
  });
};

exports.ShowPollReport = function (req, res, pollID) {
  if (!req.session.user)
    return res.redirect('/login');

  dbhelper.GetPollByID(pollID, function (poll) {
    // var totalAnswers = 0;

    // poll.options.forEach(function (option) {
    //   totalAnswers += option.answers;
    // });
//totalAnswers: totalAnswers,
    return res.render('pages/poll-report', {poll: poll, session: req.session})
  });
};