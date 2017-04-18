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
    templates: document.querySelectorAll('.template')
  });
});


// document.addEventListener("DOMContentLoaded", function () {
//   var tfInputs = document.querySelectorAll(".tf-input");
//   var mcInputs = document.querySelectorAll(".mc-input");
//   var typeSelector = document.querySelector(".question-type-selector");
//
//   typeSelector.addEventListener("change", function () {
//     var type = this[this.selectedIndex].value;
//     if(type == 'tf'){
//       mcInputs.forEach(function (input) {
//         input.setAttribute("hidden", "");
//         input.setAttribute("disabled", "");
//       });
//
//       tfInputs.forEach(function (input) {
//         input.removeAttribute("hidden", "");
//         input.removeAttribute("disabled", "");
//       });
//     }
//     else if(type == 'mc'){
//       tfInputs.forEach(function (input) {
//         input.setAttribute("hidden", "");
//         input.setAttribute("disabled", "");
//       });
//
//       mcInputs.forEach(function (input) {
//         input.removeAttribute("hidden", "");
//         input.removeAttribute("disabled", "");
//       });
//     }
//   });
// });