const MongoClient = require('mongodb').MongoClient;
let db;

exports.connectDB = function() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    console.log('Connected to Database');
    MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, _db) => {
        if (err) return reject(err);
        db = _db;
        resolve(_db);
    });
  });
}
