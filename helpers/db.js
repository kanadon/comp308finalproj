/**
 * Created by DENIS on 08/04/2017.
 */

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://admin:password@ds113670.mlab.com:13670/pollposition";
var dbObj;

module.exports.GetDB = function (){
  if(dbObj)
    return dbObj;
  else
    return null;
};

module.exports.InitializeConnection = function () {
  if(dbObj) return;

  MongoClient.connect(url, function(err, db) {
    console.log("Connected successfully to server");
    dbObj = db;
  });
};