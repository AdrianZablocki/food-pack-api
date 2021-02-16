const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient

exports.createUser = function(req, res) {
  MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true })
    .then(client => {
      console.log('Connected to Database')
      const db = client.db('test')
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
          res.status(409).json({
            message: `User with email: ${req.body.email} exist`
          });
        }
      })
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