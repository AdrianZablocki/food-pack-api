// const asyncHandler = require('express-async-handler')
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const User = mongoose.model('users');
// const saltRounds = 12

const MongoClient = require('mongodb').MongoClient

exports.createUser = function(req, res) {
  MongoClient.connect(process.env.DATABASE, { useUnifiedTopology: true })
    .then(client => {
    console.log('Connected to Database')
    const db = client.db('test')
    db.collection('users').find({ email: req.body.email }).toArray().then(col => res.status(200).json({ message: col, kurwa: "I huj ci do tego" }));
  })
  .catch(error => console.error(error))
}


// exports.createUser = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     bcrypt.hash(req.body.password, saltRounds, (err,   hash) => {
//       new User({
//         email: req.body.email,
//         password: hash
//       }).save((err, data) => {
//         if (err) {
//           res.status(500).json({
//             message: 'Something went wrong, try again later'
//           });
//         } else {
//           const userData = { ...data._doc }
//           delete userData.password
//           res.status(200).json({ message: 'User created', userData })
//         }
//       })
//     });
//   } else {
//     res.status(409).json({
//       message: `User with email: ${req.body.email} exist`
//     });
//   }
// }
