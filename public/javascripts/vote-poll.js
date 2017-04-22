/**
 * Created by DENIS on 20/04/2017.
 */

document.addEventListener("DOMContentLoaded", function () {
  var form = document.forms[0];
  var submitBtn = document.querySelector('#submit');

  submitBtn.addEventListener('click', function () {
    event.preventDefault();

    var answers = [];
    var url = form.getAttribute('action');
    var questions = document.querySelectorAll('.question');

    questions.forEach(function (question) {
      var type = question.getAttribute('data-type');

      if (type == 'sa') {
        answers.push(null);
        return;
      }

      if (type == 'tf' || type == 'mc') {
        var options = question.querySelectorAll('.question-option');
        var checkedOptions = [];

        options.forEach(function (option) {
          if (option.checked) {
            checkedOptions.push(true);
          }
          else {
            checkedOptions.push(null);
          }
        });

        answers.push(checkedOptions);
      }

      if (type == 'dd') {
        var option = question.querySelector('.question-option');
        var checkedOptions = [];

        for (var i = 0; i < option.children.length; i++) {
          if (i == option.selectedIndex)
            checkedOptions.push(true);
          else
            checkedOptions.push(null);
        }
        answers.push(checkedOptions);
      }
    });

    var req = new XMLHttpRequest();
    req.addEventListener('load', function (data) {
      document.forms[0].innerHTML = '<p>Thank you for your vote!</p>';
    });

    req.open('POST', url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(answers));
  });
});