const bcrypt = require('bcryptjs');
const connection = require('../utils/connectDB');

exports.createUser = function(req, res) {
  connection.connectDB().then(db => {
    db.collection('users').findOne({ email: req.body.email }).then(col => {
      if (!col) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            db.collection('users').insertOne({
              email: req.body.email,
              password: hash
            }).then(() => res.status(200).json({ message: 'User created' }))
              .catch(() => res.status(500).json({ message: 'Something went wrong, try again later' }))
          });
        });
      } else {
        res.status(409).json({ message: `User with email: ${req.body.email} exist` });
      }
    })
    .catch(error => console.error(error));
  });
  
}
