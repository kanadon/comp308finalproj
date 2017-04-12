/**
 * Created by DENIS on 09/04/2017.
 */
document.addEventListener("DOMContentLoaded", function () {
  var printBtn = document.querySelector("#print");
  var reportTable = document.querySelector("#report");

  // open a new window, copy the report and print
  // attach styles

  printBtn.addEventListener("click", function () {
    var printWindow = window.open("", "Print report");

    var style = '<style type="text/css">' +
      'table th:first-of-type {text-align: left;} ' +
      'table td:last-child {text-align: right;}' +
      '</style>';
    printWindow.document.body.innerHTML = style;
    printWindow.document.body.appendChild(reportTable.cloneNode(true));
    printWindow.print();
  });
});