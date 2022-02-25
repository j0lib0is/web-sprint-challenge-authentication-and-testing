const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/index');

const restricted = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({ status: 401, message: 'token invalid' });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    })
  } else {
    next({ status: 401, message: 'token required' });
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};

module.exports = restricted;