/**
 * Created by DENIS on 08/04/2017.
 */

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://admin:password@ds113670.mlab.com:13670/pollposition";
var dbObj;

module.exports.GetDB = function () {
  if (dbObj)
    return dbObj;
  else
    return null;
};

module.exports.InitializeConnection = function () {
  if (dbObj) return;

  MongoClient.connect(url, function (err, db) {
    console.log("Connected successfully to server");
    dbObj = db;
  });
};

module.exports.UpdateUser = function (username, email, password, callback) {
  if (!dbObj) throw new Error('database not initialized');

  dbObj.collection('users').findAndModify(
    {
      username: username
    },
    [['_id', 'asc']],
    {
      $set: {
        email: email,
        password: password
      }
    },
    {},
    function (err, result) {
      callback(err, result);
    }
  );
};

module.exports.IsUsernameUnique = function (username, callback) {
  if (!dbObj) throw new Error('database not initialized');

  var userWithUsername = dbObj.collection('users').find({
    username: username
  });

  userWithUsername.toArray(function (err, doc) {
    if (doc.length !== 0)
      callback(false);
    else
      callback(true);
  });
};

module.exports.IsEmailUnique = function (email, callback) {
  if (!dbObj) throw new Error('database not initialized');

  var userWithEmail = dbObj.collection('users').find({
    email: email
  });

  userWithEmail.toArray(function (err, doc) {
    if (doc.length !== 0)
      callback(false);
    else
      callback(true);
  });
};

module.exports.GetPollsByUser = function (username, callback) {
  if (!dbObj) throw new Error('database not initialized');

  var polls = dbObj.collection('polls').find(
    {user: username}
  );

  polls.toArray(function (err, doc) {
    if (err)
      callback(null);
    else
      callback(doc);
  });
};

module.exports.GetPollByID = function (pollID, callback) {
  if (!dbObj) throw new Error('database not initialized');

  var poll = dbObj.collection('polls').find(
    {uniqueID: pollID}
  );

  poll.toArray(function (err, doc) {
    if (doc.length !== 1)
      callback(null);
    else
      callback(doc[0]);
  });
};

module.exports.UpdatePoll = function (pollID, options, totalResponses, callback) {
  if (!dbObj) throw new Error('database not initialized');

  dbObj.collection('polls').findAndModify(
    {
      uniqueID: pollID
    },
    [['_id', 'asc']],
    {
      $set: {
        totalResponses: totalResponses,
        options: options
      }
    },
    {},
    function (err, result) {
      callback(err, result);
    }
  );
};

module.exports.IsPollIDUnique = function (pollID, callback) {
  if (!dbObj) throw new Error('database not initialized');

  var poll = dbObj.collection('polls').find({
    uniqueID: pollID
  });

  poll.toArray(function (err, doc) {
    if (doc.length !== 0)
      callback(false);
    else
      callback(true);
  });
};

module.exports.CreatePoll = function(poll, callback){
  if (!dbObj) throw new Error('database not initialized');

  dbObj.collection('polls').insertOne(poll, function (err) {
    if (err)
      callback(false);
    else
      callback(true);
  });
};