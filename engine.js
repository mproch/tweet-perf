/*
 * Engine module responsible for almost all application logic.
 */
 
 /*
 * Database schema:
 * users: id, name, screen_name
 * statuses: id, user_id, text, created_at
 * followers: user_id, follower_id
 */

function Engine() {

    this.tweetId = 0;
    
};

exports.Engine = Engine;

var databaseModule = require('./database-mysql');
var database = new databaseModule.Database();

Engine.prototype.getTweets = function (username, callback) {

	// TODO proper implementation needed

	database.selectTweets(username, function(tweets) {
	
		callback(tweets);
	
	});

};