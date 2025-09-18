const express = require('express');
const { UserSignupHandler, UserLoginHandler, domainChecker } = require('../handlers/userAuthorisationHandlers');
const { UserAuthenticationHandler } = require('../middlewares/UserTokenChecker');
const BaseRoute = express.Router();


BaseRoute.route('/signup')
    .get(domainChecker)
    .post(UserSignupHandler);

BaseRoute.get('/login',UserAuthenticationHandler,UserLoginHandler)

module.exports = BaseRoute;