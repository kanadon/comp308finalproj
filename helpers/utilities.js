/**
 * Created by DENIS on 12/04/2017.
 */

module.exports.CheckArrayForDuplicates = function (array) {
  var newArr = array.slice().sort();

  for (var i = 0; i < newArr.length; i++) {
    if (newArr[i] === newArr[i + 1])
      return true;
  }

  return false;
};