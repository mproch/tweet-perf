sys = require('sys');
var Db = require('mongodb').Db, connect = require('mongodb').connect;
var mysql = require('mysql');

function Database() {
	var that = this;
	connect(Db.DEFAULT_URL, function(err, db) {
	  that.db = db;
	  //importQueue();
	  //that.insert('Maciek','bela', function () {that.db.close()});
	});
};


exports.Database = Database;
var db = new Database();


//var mysqlclient = [];

mysqlclient = mysql.createClient({
	user: 'twitter',
	password: 'twitter',
	host: 'localhost',
	port: 3306,
	database: 'twitter3'
});
/*
mysqlclient[1] = mysql.createClient({
	user: 'twitter',
	password: 'twitter',
	host: 'localhost',
	port: 3306,
	database: 'twitter2'
});

mysqlclient[2] = mysql.createClient({
	user: 'twitter',
	password: 'twitter',
	host: 'localhost',
	port: 3306,
	database: 'twitter3'
});

mysqlclient[3] = mysql.createClient({
	user: 'twitter',
	password: 'twitter',
	host: 'localhost',
	port: 3306,
	database: 'twitter4'
});
  */
/*
mysqlclient.forEach(function(mysqlclient) {

mysqlclient.query('SELECT * FROM users',
			function(err, results, fields) {
                results.forEach(
                    function(val, index) {
                       var user = {name : val.name, screen_name : val.screen_name, id : val.id};
                       db.db.collection('users', function(err, collection) {
	                     collection.insert(user);
	                   });
                    }
                )
                sys.puts('koniec userow');
                importFollowers();
			}
);

function importFollowers() {
mysqlclient.query('SELECT distinct * FROM followers',
			function(err, results, fields) {
                results.forEach(
                    function(val, index) {
                       var user = {name : val.name, screen_name : val.screen_name, id : val.id};
                       db.db.collection('users', function(err, collection) {
	                     collection.update({id:val.user_id},
	                     {$push : {followers : val.follower_id}});
	                   });
                    }
                )
                sys.puts('koniec followers');
                importStatuses();
			}
);

}
*/

 function importStatuses() {
 mysqlclient.query('SELECT  * FROM statuses',
 			function(err, results, fields) {
                 results.forEach(
                     function(val, index) {
                        var status = { id : val.id, text: val.text, created_at: val.created_at};
                        db.db.collection('users', function(err, collection) {
 	                     collection.update({id:val.user_id},
 	                     {$push : {statuses : status}});
                     });
                 });
                 sys.puts('koniec queue');
                 //importQueue();
 			}
 );

 }


importStatuses();
function importQueue() {
     db.db.collection('users', function(err, collection) {

        collection.find(function(err, cursor) {
            cursor.each(function(err, user) {
                db.db.collection('queue', function(err, collection) {
                    if (user && user.statuses) {
                      console.dir(user);
                      user.statuses.forEach(function(status) {
                        var queueElement = {status : status, followers : user.followers};
                        collection.insert(queueElement);
                     });
                    }
                });
            });
        });

     });
//                 db.db.close();
//                 process.exit();
}
