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
	this.db.collection('tweets', function(err, collection) {

        collection.find({name : username}, {statuses : 1}, function(err, cursor) {
            cursor.toArray(function(err, docs) {
                callback(docs);
            });
          });
   });
}


Database.prototype.selectTime = function (username, callback) {



}


Database.prototype.insertTweet = function (name, status, callback) {
    var now = new Date();
	this.db.collection('tweets', function(err, collection) {
	    collection.update({name:name},
	        {$push : {statuses : {createdAt : new Date(), text : status}}});
	    callback ({'created_at': now});
	});
}
