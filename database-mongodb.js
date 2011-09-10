sys = require('sys');
var Db = require('mongodb').Db, connect = require('mongodb').connect;

function Database() {
	var that = this;
	connect(Db.DEFAULT_URL, function(err, db) {
	  that.db = db;
	  //that.insert('Maciek','bela', function () {that.db.close()});
	});
};

exports.Database = Database;

Database.prototype.selectTweets = function (username, callback) {
    var that = this;
    this.db.collection('users', function(err, collection) {
        collection.find({screen_name : username}).nextObject(function(err, user) {
             callback(user.statuses);
        });
    });
}


Database.prototype.selectTimeline = function (username, callback) {
    var that = this;
    this.db.collection('users', function(err, collection) {
        collection.find({screen_name : username}).nextObject(function(err, user) {
        	that.db.collection('timeline', function(err, collection2) {
             collection2.find({user_id : user.id}, function(err, cursor) {
                 cursor.toArray(function(err, docs) {
                     callback(docs);
                 });
               });
            });
        });
    });
}


Database.prototype.insertTweet = function (name, status, callback) {
    var that = this;
    this.db.collection('users', function(err, collection) {
        collection.find({screen_name : name}).nextObject(function(err, user) {
            var newStatus = {text : status, created_at : new Date()};
            collection.update({id : user.id}, {$push : {statuses : newStatus}  });
            that.db.collection('queue', function(err, collection2) {
                        var queueElement = {status : newStatus, followers : user.followers};
                        collection2.insert(queueElement);
                        callback(newStatus)
            });
        });
    });
}
