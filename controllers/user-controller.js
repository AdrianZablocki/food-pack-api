const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
ObjectId = require('mongodb').ObjectId; 

const connection = require('../utils/connectDB');
// const { emailTransporter } = require('../utils/mail');
const { transporter } = require('../utils/mail');

const User = require('../models/user-model');

exports.createUser = function(req, res) {
  // connection.connectDB().then(db => {
  //   db.collection('users').findOne({ email: req.body.email }).then(user => {
  //     if (!user) {
  //       bcrypt.genSalt(10, function(err, salt) {
  //         bcrypt.hash(req.body.password, salt, function(err, hash) {
  //           db.collection('users').insertOne( new User(req.body.email, hash))
  //           .then(() => res.status(200).json({ message: 'User created' }))
  //           .catch(() => res.status(500).json({ message: 'Something went wrong, try again later' }))
  //         });
  //       });
  //     } else {
  //       res.status(409).json({ message: `User with email: ${req.body.email} exist` });
  //     }
  //   }).catch(err => res.status(500).json({ message: err }));
  // }).catch(err => res.status(500).json({ message: err }));
  connection.connectDB().then(db => {
    db.collection('users').findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).send({ message:'This email address is already associated with another account.' });
      } else {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User(req.body.email, req.body.password);
        db.collection('users').insertOne(newUser).then(() => {
          const token = jwt.sign({ email: req.body.emial }, process.env.TOKEN_SECRET);
          db.collection('email-verification-tokens').insertOne({token}).then((token) => {
            const mailData = {
              from: 'no-reply@example.com',  // sender address
              to: newUser.email,   // list of receivers
              subject: 'Account Verification Link',
              text: 'Hello '+ newUser.email +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + newUser.email + '\/' + token.ops[0].token + '\n\nThank You!\n'
            };
            transporter(mailData).then(() => res.status(200).send(
                `A verification email has been sent to ${newUser.email}. It will be expire after one day. If you not get verification Email click on resend token.`
              )).catch(() => res.status(500).send({message:'Technical Issue!, Please click on resend for verify your Email.'}));
          }).catch(err => res.status(500).send({ message: err.message }))
        }).catch(err => res.status(500).json({ message: `Something went wrong, try again later: error message ${err.message}` }))
      }
    }).catch(err => res.status(500).json({ message: err.message }));
  }).catch(err => res.status(500).json({ message: err.message }));
  
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
      { _id: new ObjectId(req.params.id)},
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
  connection.connectDB().then(db => {
    db.collection('users').find({}).toArray((err, result) => {
      if (err){
        res.status(500).json({ message: 'Something went wrong, try again later' })
      } else {
        res.status(200).send(result);
      }
    });
  }).catch(err => res.status(500).json({ message: err }));

}
