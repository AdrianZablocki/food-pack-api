const bcrypt = require('bcryptjs');
ObjectId = require('mongodb').ObjectId; 

const connection = require('../utils/connectDB');
const { emailTransporter } = require('../utils/mail');
const User = require('../models/user-model');

exports.createUser = function(req, res) {
  connection.connectDB().then(db => {
    db.collection('users').findOne({ email: req.body.email }).then(user => {
      if (!user) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            db.collection('users').insertOne( new User(req.body.email, hash))
            .then(() => res.status(200).json({ message: 'User created' }))
            .catch(() => res.status(500).json({ message: 'Something went wrong, try again later' }))
          });
        });
      } else {
        res.status(409).json({ message: `User with email: ${req.body.email} exist` });
      }
    }).catch(err => res.status(500).json({ message: err }));
  }).catch(err => res.status(500).json({ message: err }));
  
}

exports.getUser = function(req, res) {
  connection.connectDB().then(db => {
    db.collection('users').findOne(new ObjectId(req.params.id)).then(user => {
      user ? res.status(200).json(user) : res.status(404).json({ message: 'User not found' }); 
    });
  }).catch(err => res.status(500).json({ message: err }));

}

exports.updateUser = function(req, res) {
  connection.connectDB().then(db => {
    db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { useFindAndModify: false },
      (err) => {
        err
          ? res.status(500).json({ message: 'Something went wrong, try again later' })
          : res.status(200).json({ message: 'User updated' }) 
      }
    );
  }).catch(err => res.status(500).json({ message: err }));

}

exports.deleteUser = function(req, res) {
  connection.connectDB().then(db => {
    db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) }, {}, (err) => {
    err
      ? res.status(500).json({ message: 'Something went wrong, try again later' })
      : res.status(200).json({ message: 'User deleted' });
    });
  }).catch(err => res.status(500).json({ message: err }));

}

exports.getAllUsers = function(req, res) {
  const mailData = {
    from: 'mastahwasta@gmail.com',  // sender address
    to: 'adrian.zablocki@yahoo.com',   // list of receivers
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
  };

  connection.connectDB().then(db => {
    db.collection('users').find({}).toArray((err, result) => {
      if (err){
        res.status(500).json({ message: 'Something went wrong, try again later' })
      } else {
        emailTransporter(mailData)
        res.status(200).send(result);
      }
    });
  }).catch(err => res.status(500).json({ message: err }));

}
