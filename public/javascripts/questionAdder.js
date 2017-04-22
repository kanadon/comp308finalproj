/**
 * Created by DENIS on 17/04/2017.
 */

var QuestionAdder = (function () {
  var
    questionsContainer,
    typeSelector,
    numberOfOptionsLabel,
    numberOfOptionsInput,
    addBtn,
    templates = {},
    currentOrder = 1,
    domParser = new DOMParser();

  function init(options) {
    Handlebars.registerHelper('iterate', function (n, options) {
      var aggregate = '';

      for (var i = 0; i < n; i++) {
        aggregate += options.fn({
          index: i + 1
        });
      }

      return aggregate;
    });

    questionsContainer = options.questionsContainer;
    typeSelector = options.typeSelector;
    numberOfOptionsLabel = options.numberOfOptionsLabel;
    numberOfOptionsInput = options.numberOfOptionsInput;
    addBtn = options.addBtn;
    // templates = options.templates;

    options.templates.forEach(function (template) {
      var type = template.getAttribute('data-type');
      templates[type] = Handlebars.compile(template.innerHTML);
    });

    typeSelector.addEventListener("change", function () {
      var type = this[this.selectedIndex].value;

      if (type == 'mc' || type == 'dd')
        numberOfOptionsLabel.classList.remove('hidden');
      else
        numberOfOptionsLabel.classList.add('hidden');
    });

    addBtn.addEventListener('click', function () {
      addQuestion(typeSelector[typeSelector.selectedIndex].value, numberOfOptionsInput.value);
    });
  }

  function addQuestion(type, numberOfOptions) {
    var
      template = templates[type],
      model = {
        order: currentOrder++,
        numberOfOptions: numberOfOptions
      },
      html = template(model);

    // questionsContainer.innerHTML += html;
    var div = document.createElement('div');
    div.innerHTML = html;
    questionsContainer.appendChild(div);
    // questionsContainer.appendChild(domParser.parseFromString(html, 'text/xml').firstChild);
  }

  return {
    Init: init
  };
})();