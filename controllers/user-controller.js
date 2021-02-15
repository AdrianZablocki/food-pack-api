const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('user');
const saltRounds = 12

// exports.createUser = function(req, res) {
  // const user = await User.findOne({ email: req.body.email })
  // if (!user) {
  //   res.status(200).json({ message: 'User created' })
  // } else {
  //   res.status(409).json({
  //     message: `User with email: ${req.body.email} exist`
  //   });
  // }
  // res.status(200).json({ message: 'No co ty kurwa, chujnia z tą bazą nie działa' })

  // User.findOne({ email: req.body.email })
  //   .then(user => res.status(409).json({ message: `User: ${user}` }))
  //   .catch(err => res.status(400).json({message: err.message}))
  // try {
  //   const user = await User.findOne({ email: req.body.email })
  //   if (!user) {
  //     res.status(200).json({ message: 'User created' })
  //   } else {
  //     res.status(409).json({
  //       message: `User with email: ${req.body.email} exist`
  //     });
  //   }
  //
  // } catch {
  //   return res.status(400).json({
  //     message: 'Kurwa mać jego mać'
  //   });
  // }

  // res.json({ message: 'Huj w to wbijam' });
  // User.findOne({ email: req.body.email }).then(function(user) {
  //   if (!user) {
  //     res.status(200).json({ message: 'User created' })
  //   } else {
  //     res.status(409).json({
  //       message: `User with email: ${req.body.email} exist`
  //     });
  //   }
  // });
// }

exports.createUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    bcrypt.hash(req.body.password, saltRounds, (err,   hash) => {
      new User({
        email: req.body.email,
        password: hash
      }).save((err, data) => {
        if (err) {
          res.status(500).json({
            message: 'Something went wrong, try again later'
          });
        } else {
          const userData = { ...data._doc }
          delete userData.password
          res.status(200).json({ message: 'User created', userData })
        }
      })
    });
  } else {
    res.status(409).json({
      message: `User with email: ${req.body.email} exist`
    });
  }
}
