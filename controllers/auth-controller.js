const bcrypt = require('bcryptjs');
const connection = require('../utils/connectDB');
const jwt = require('jsonwebtoken');

exports.authUser = function(req, res) {
  connection.connectDB().then(db => {
    db.collection('users').findOne({ email: req.body.email }).then(user => {
      if (user) {
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        console.log(validPassword);

        if (validPassword) {
          const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
          // TODO przy tworzeniu zapisać w bazie danych i przy akcji refresh token sprawdzić czy podany istneje
          const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 525600 });
          // TODO: CSRF + cookie http only
          res.cookie('JWT', accessToken, {
            maxAge: 86400000,
            httpOnly: true
          });
          res.json({ accessToken, refreshToken });
        } else {
          res.json({ message: 'Wrong password' });
        }
      } else {
        res.json({ message: 'Wrong email' });
      }
    })
  });

}

exports.refreshToken = function(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401) // Unauthorized
  
  // TODO: check if refresh token exist in DB
  connection.connectDB().then(db => {
    db.collection('users').findOne({ email: req.body.email }).then(user => {
      console.log(user);
      if (user === null) return res.status(404).json({ message: 'Wrong email' }) // Not Found

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: ' Invalid signature' }) // Forbidden - bad token
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
        res.status(200).json({ accessToken });
      });
    });
  });

}


// exports.refreshToken = async (req, res) => {
//   const refreshToken = req.body.token;
//   const user = await User.findOne({ _id: req.body.userId });

//   if (!refreshToken) {
//     return res.sendStatus(401) // Unauthorized
//   }

//   // TODO: check if refresh token exist in DB

//   try {
//     await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//   } catch {
//     return res.sendStatus(403) // bad token forbidden
//   }

//   const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })

//   res.send({ accessToken })
// }
