// const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const User = mongoose.model('user');
// const saltRounds = 12

exports.createUser = function(req, res) {
  res.status(200).json({ message: 'Crete user' })
 // User.findOne({ email: req.body.email })
 //  .then(user => {
 //    console.log(user);
 //    if (!user) {
 //      res.status(200).json({ message: 'Crete user' })
 //    } else {
 //      res.status(409).json({ message: `User exist: ${user}` })
 //    }
 //  })
 //  .catch(err => res.status(400).json({message: err.message}))
}


// exports.createUser = asyncHandler(async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//
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
// })
