const MongoClient = require('mongodb').MongoClient;
let db;

exports.connectDB = function() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, _db) => {
        if (err) return reject(err);
        console.log('Connected to Database');
        db = _db.db('test');
        resolve(_db.db('test'));
    });
  });
  
}
