sys = require('sys');
var Db = require('mongodb').Db, connect = require('mongodb').connect;

function Database() {
	var that = this;
	connect(Db.DEFAULT_URL, function(err, db) {
	  that.db = db;
	});
};


exports.Database = Database;
var db = new Database();

function processQueue() {
     sys.puts("starting")
     db.db.collection('queue', function(err, collection) {

        collection.find(function(err, cursor) {
            cursor.each(function(err, queueElement) {
                db.db.collection('timeline', function(err, collection2) {
                      if (queueElement && queueElement.followers) {
                      queueElement.followers.forEach(function(id) {
                        sys.puts('queueElement id = ' + queueElement._id + ' follower id = ' + id);
                        collection2.update({user_id : id},
	                     {$push : {statuses : queueElement.status}, $set: {user_id : id} }, {upsert : true}, function(err, result) {
	                       if (err) {
	                            console.warn(err.message);
	                            throw error;
	                        }
	                        collection.remove({_id : queueElement._id}, function() {
                                sys.puts('removed '+queueElement._id);
	                        });
	                     });
                      });
                    } else if (queueElement){
                        collection.remove({_id : queueElement._id}, function() {
                                sys.puts('removed '+queueElement._id);
	                    });
                    } else {
                        sys.puts("finished");
                        setMyTimeout();
                    }
                });
            });
        });

     });
}

function setMyTimeout() {
    sys.puts("set timeout")
    setTimeout(processQueue, 1000)
}
exports.setMyTimeout=setMyTimeout
/*setTimeout(1000, function() {
    sys.puts(i);
    process.exit();
})*/
