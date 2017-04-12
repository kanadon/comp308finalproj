/**
 * Created by DENIS on 09/04/2017.
 */

// this controller handles all logic regarding polls (creation, submission, etc.)

var dbhelper = require('../helpers/db');
var utilities = require('../helpers/utilities');

exports.ShowPoll = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll === null)
      return res.render('pages/poll', {message: 'Cannot find poll.'});

    var now = Date.now();

    if(poll.startTime > now)
      return res.render('pages/poll', {message: 'This poll has not started yet.'});

    else if(poll.endTime && poll.endTime < now)
      return res.render('pages/poll', {message: 'This poll has ended.'});

    return res.render('pages/poll', {poll: poll});
  });
};

exports.ShowPollInfo = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll === null)
      return res.render('pages/poll-info', {message: 'Cannot find poll.'});

    return res.render('pages/poll-info', {poll: poll});
  });
};

exports.ShowCreatePoll = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  return res.render('pages/create-poll');
};

exports.CreatePoll = function (req, res) {
  if (!req.session.user)
    return res.redirect('/login');

  dbhelper.IsPollIDUnique(req.body.uniqueID, function (unique) {
    if (!unique)
      return res.render('pages/create-poll', {message: 'This ID has been taken.'});

    var newPoll = {
      user: req.session.user.username,
      uniqueID: req.body.uniqueID,
      type: req.body.type,
      title: req.body.title,
      startTime: Date.parse(req.body.startTime),
      endTime: Date.parse(req.body.endTime),
      totalResponses: 0
    };

    if (newPoll.type === 'tf') {
      if(req.body.true === req.body.false)
        return res.render('pages/create-poll', {message: 'Options cannot be identical.'});

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
      if(utilities.CheckArrayForDuplicates(
          [req.body.option1, req.body.option2, req.body.option3, req.body.option4]
        ))
        return res.render('pages/create-poll', {message: 'Options cannot be identical.'});

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
        return res.render('pages/create-poll', {message: 'Something went wrong...'});

      return res.render('pages/create-poll', {message: 'Your poll has been created.'});
    });

  });

};

exports.DeletePoll = function (req, res, pollID) {
  if (!req.session.user)
    return res.redirect('/login');


    dbhelper.DeletePoll(pollID, function (success) {
      if(!success)
        return res.redirect('/user/polls');
      else
        return res.redirect('/user/polls');
    });
};

exports.AnswerPoll = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll === null)
      return res.render('pages/poll', {message: 'Cannot find poll.'});

    if (poll.type === 'tf') {
      // increment answers and responses
      poll.totalResponses++;
      var selectedAnswer = req.body[pollID];

      poll.options.forEach(function (option) {
        if (option.name === selectedAnswer)
          option.answers++;
      });
    }
    else if (poll.type === 'mc') {
      // increment answers and responses
      poll.totalResponses++;

      for (var answer in req.body)
        poll.options.forEach(function (option) {
          if (option.name === answer)
            option.answers++;
        });
    }

    dbhelper.UpdatePoll(pollID, poll.options, poll.totalResponses, function (poll) {
      return res.render('pages/poll', {message: 'Thank you for the vote!'});
    });


  });
};

exports.ShowPollReport = function (req, res, pollID) {
  if (!req.session.user)
    return res.redirect('/login');

  dbhelper.GetPollByID(pollID, function (poll) {
    var totalAnswers = 0;

    poll.options.forEach(function (option) {
      totalAnswers += option.answers;
    });

    return res.render('pages/poll-report', {poll: poll, totalAnswers: totalAnswers})
  });
};