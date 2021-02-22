const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split(' ')[1]
  const token = req.cookies.JWT

  if (token === null) return res.sendStatus(401); // unauthorized

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // forbidden
    console.log(user, req.user)
    req.user = user;
    next();
  });

}

module.exports = auth;
