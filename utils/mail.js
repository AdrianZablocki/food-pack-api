const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: 'mastahwasta@gmail.com',
    pass: 'Ble40%ble',
  },
  secure: true,
});


// exports.emailTransporter = function(mailData) {
//   return transporter.sendMail(mailData, function (err, info) {
//     if(err) {
//       console.log(err)
//     } else {
//       console.log(info);
//     }
//   });
// }

// let trans;
exports.transporter = function(mailData) {
  return new Promise((resolve, reject) => {

    transporter.sendMail(mailData, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  })
}





// const MongoClient = require('mongodb').MongoClient;
// let db;

// exports.connectDB = function() {
//   return new Promise((resolve, reject) => {
//     if (db) return resolve(db);
//     MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, _db) => {
//         if (err) return reject(err);
//         console.log('Connected to Database');
//         db = _db.db('test');
//         resolve(_db.db('test'));
//     });
//   });
  
// }
