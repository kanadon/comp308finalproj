/**
 * Created by DENIS on 08/04/2017.
 */

document.addEventListener("DOMContentLoaded", function () {
  QuestionAdder.Init({
    questionsContainer: document.querySelector('#questions'),
    typeSelector: document.querySelector('#question-type'),
    numberOfOptionsLabel: document.querySelector('#number-of-options'),
    numberOfOptionsInput: document.querySelector('#number-of-options input'),
    addBtn: document.querySelector('#add-question'),
    templates: document.querySelectorAll('script[type="text/x-handlebars-template"]')
  });

  var form = document.forms[0];
  var submitBtn = document.querySelector('#submit');

  submitBtn.addEventListener('click', function () {
    event.preventDefault();

    var poll = {
      title: document.querySelector('#pollTitle').value,
      questions: []
    };
    var url = form.getAttribute('action');
    var questions = document.querySelectorAll('.question');
    questions.forEach(function (question) {
      var pollQuestion = {
        title: '',
        options: [],
        type: question.getAttribute('data-type')
      };
      var options = question.querySelectorAll('.question-option');

      pollQuestion.title = question.querySelector('.question-title').value;

      options.forEach(function (option) {
        pollQuestion.options.push({
          title: option.value,
          value: option.getAttribute('data-value'),
          responses: 0
        });
      });

      poll.questions.push(pollQuestion);
    });

    var req = new XMLHttpRequest();
    req.addEventListener('load', function (data) {
      document.forms[0].innerHTML = '<p>Poll created</p>';
    });

    req.open('POST', url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(poll));
  });
});