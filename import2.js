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
	database: 'twitter4'
});
var user={};
var oldId=0;
var oldFollowers=0;
var countFollowers=0;
var oldStatus='';
var countStatus=0;
var date=new Date();
var godz = date.getHours();
var min = date.getMinutes();
var sec = date.getSeconds();
console.log(godz+':'+min+':'+sec+' - start');
mysqlclient.query('select users.*, statuses.text as text, followers.follower_id as follower_id from users left join `statuses` on (users.id=statuses.user_id) left join `followers` on (users.id=followers.user_id) order by users.name',
			function(err, results, fields) {
                results.forEach(
                    function(val, index) {
                        if(oldId!=val.id){
                            oldId=val.id;
                            //console.dir(user);
                            if(typeof user.statuses != 'undefined' ){
                                if(typeof user.followers != 'undefined'){
                                    user.statuses.forEach(function(status) { 
                                         status={status : status, followers : user.followers}
                                         db.db.collection('queue', function(err, collection) {
                                                 collection.insert(status);
                                         })
                                    })
                                }
                                db.db.collection('users', function(err, collection) {
                                     collection.insert(user);
                                 });
                                //console.log(godz+':'+min+':'+sec+'-|- dodałem usera: '+user.name);
                            }
                            user = {name : val.name, screen_name : val.screen_name, id : val.id,followers:[], statuses:[]};
                            oldFollowers=0;
                            countFolowers=0;
                            oldStatus='';
                            countStatus=0;
                        }
                       if(oldFollowers!=val.follower_id){
                           oldFollowers=val.follower_id
                           user.followers[countFollowers]=val.follower_id;
                           countFollowers++;
                       };
                       if(oldStatus!=val.text){
                           oldStatus=val.text
                           user.statuses[countStatus]=val.text;
                           countStatus++;
                       };
                    }
                )
                
                date=new Date();
                godz = date.getHours();
                min = date.getMinutes();
                sec = date.getSeconds();
                console.log(godz+':'+min+':'+sec+' - koniec');
			}
			
);
                       

