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
          res.status(200).json({ accessToken, refreshToken });
        } else {
          res.status(404).json({ message: 'Wrong email or password' });
        }
      } else {
        res.status(404).json({ message: 'Wrong email or password' });
      }
    }).catch(err => res.status(500).json({ message: 'DB connection error', err }));
  }).catch(err => res.status(500).json({ message: 'DB connection error', err }));

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
        if (err) return res.status(403).json({ message: ' Invalid signature' }) // Forbidden
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
        res.status(200).json({ accessToken });
      });
    });
  });

}
