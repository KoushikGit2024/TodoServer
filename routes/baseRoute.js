// routes/baseRoutes.js
const express = require('express');
const {
  UserSignupHandler,
  UserLoginHandler,
  domainChecker,
} = require('../handlers/userAuthorisationHandlers');
const { UserTokenHandler } = require('../middlewares/UserTokenChecker');

const BaseRoute = express.Router();

// Signup route
BaseRoute.route('/signup')
  .get(domainChecker)
  .post(UserSignupHandler);

// Login route
BaseRoute.post('/login', UserTokenHandler, UserLoginHandler);

module.exports = BaseRoute;
