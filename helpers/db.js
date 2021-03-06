/**
 * Created by DENIS on 08/04/2017.
 */

/*
  this helper connects to the database and reuses the same db object for future interactions
  besides updating and creating users/polls, it contains useful functions such as checking for uniqueness of ID's,
  emails, etc.
*/

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


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
        email: email.toLowerCase(),
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

module.exports.GetLatestPolls = function (callback) {
  if (!dbObj) throw new Error('database not initialized');

  var polls = dbObj.collection('polls').find(
    {}
  ).limit(10);

  polls.toArray(function (err, doc) {
    if (err)
      callback(null);
    else
      callback(doc);
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
    {"_id" : ObjectId(pollID)}
  );

  poll.toArray(function (err, doc) {
    if (doc.length !== 1)
      callback(null);
    else
      callback(doc[0]);
  });
};

module.exports.UpdatePoll = function (pollID, updatedPoll, callback) {
  if (!dbObj) throw new Error('database not initialized');

  dbObj.collection('polls').updateOne(
    {
      "_id" : ObjectId(pollID)
    },
    updatedPoll
  );

  callback();

  // dbObj.collection('polls').update(
  //   {
  //     "_id" : ObjectId(pollID)
  //   },
  //   [['_id', 'asc']],
  //   {
  //     $set: {
  //       totalResponses: totalResponses,
  //       options: options
  //     }
  //   },
  //   {},
  //   function (err, result) {
  //     callback(err, result);
  //   }
  // );
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

module.exports.CreateUser = function(user, callback){
  if (!dbObj) throw new Error('database not initialized');

  user.email = user.email.toLowerCase();

  dbObj.collection('users').insertOne(user, function (err) {
    if (err)
      callback(false);
    else
      callback(true);
  });
};

module.exports.DeletePoll = function(pollID, callback){
  if (!dbObj) throw new Error('database not initialized');

  dbObj.collection('polls').remove({
    "_id" : ObjectId(pollID)
  }, function (err) {
    if (err)
      callback(false);
    else
      callback(true);
  });
};