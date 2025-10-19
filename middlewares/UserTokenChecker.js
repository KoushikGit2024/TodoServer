const jwt = require('jsonwebtoken');

async function UserTokenHandler(req, res, next) {
  const token = req.cookies?.UserValidationToken;

  if (!req.body || !token) {
    res.code = 1005;
    return next();
  }

  jwt.verify(
    token,
    process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
    async (err, user) => {
      if (err) {
        req.error = err.name;
      } else {
        req.user = user;
      }
      next();
    }
  );
}

async function userPreDataHandler(req, res, next) {
  const token = req.cookies?.UserValidationToken;

  if (!token) {
    return res.status(404).send({
      code: 10041,
      msg: 'User token missing',
    });
  }

  jwt.verify(
    token,
    process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
    async (err, user) => {
      if (err) {
        return res.status(404).send({
          code: 1004,
          msg: 'Token verification failed',
          error: err,
        });
      }

      req.user = user;
      next();
    }
  );
}

module.exports = {
  UserTokenHandler,
  userPreDataHandler,
};
