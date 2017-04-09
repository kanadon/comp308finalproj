/**
 * Created by DENIS on 09/04/2017.
 */

var dbhelper = require('../helpers/db');

exports.ShowPoll = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll == null)
      return res.render('pages/poll', {message: 'Cannot find poll.'});

    return res.render('pages/poll', {poll: poll});
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
      return res.render('pages/create-poll', {message: 'This ID has been taken.'})

    var newPoll = {
      user: req.session.user.username,
      uniqueID: req.body.uniqueID,
      type: req.body.type,
      title: req.body.title,
      startTime: Date.parse(req.body.startTime)
    };

    if (newPoll.type == 'tf') {
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
    else if (newPoll.type == 'mc') {
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

exports.AnswerPoll = function (req, res, pollID) {
  dbhelper.GetPollByID(pollID, function (poll) {
    if (poll == null)
      return res.render('pages/poll', {message: 'Cannot find poll.'});

    if (poll.type == 'tf') {
      // increment answer
      var selectedAnswer = req.body[pollID];

      poll.options.forEach(function (option) {
        if (option.name == selectedAnswer)
          option.answers++;
      });
    }
    else if (poll.type == 'mc') {
      // increment answers
      for (var answer in req.body)
        poll.options.forEach(function (option) {
          if (option.name == answer)
            option.answers++;
        });
    }

    dbhelper.UpdatePoll(pollID, poll.options, function (poll) {
      return res.render('pages/poll', {message: 'Thank you for the vote!'});
    });


  });
};