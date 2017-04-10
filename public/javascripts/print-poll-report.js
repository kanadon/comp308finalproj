/**
 * Created by DENIS on 09/04/2017.
 */
document.addEventListener("DOMContentLoaded", function () {
  var printBtn = document.querySelector("#print");
  var reportTable = document.querySelector("#report");


  printBtn.addEventListener("click", function () {
    var printWindow = window.open("", "Print report");

    printWindow.document.body.appendChild(reportTable.cloneNode(true));
    printWindow.print();
  });
});