const express = require('express');
const { UserSignupHandler, UserLoginHandler, domainChecker } = require('../handlers/userAuthorisationHandlers');
const { UserTokenHandler } = require('../middlewares/UserTokenChecker');
const BaseRoute = express.Router();


BaseRoute.route('/signup')
    .get(domainChecker)
    .post(UserSignupHandler);

BaseRoute.post('/login',UserTokenHandler,UserLoginHandler)

module.exports = BaseRoute;