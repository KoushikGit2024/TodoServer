const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userSchema');

async function  UserTokenHandler(req,res,next){
    if(req.body){
        const { token }=req.body;
        if(token){
            jwt.verify(token, process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
                async (err, user) => {
                    if (err) {
                        req.error=err.name;
                        next();
                    }else{
                        req.user=user;
                        next();
                    }
                }
            );    
        } else {
            res.code=1005,
            next();
        }
        
    } else{
        res.code=1005,
        next();
    }
}
async function userPreDataHandler(req,res,next) {
    const { token }=req.body;
    
    if(token){
        jwt.verify(token, process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
            async (err, user) => {
                if (err) {
                    req.error=err.name;
                    res.status(404).send({code:1004,msg:"Token verification failed...",error:err})
                }else{
                    req.user=user;
                    next();
                }
            }
        );
    } else{
        res.status(404).send({code:10041,msg:"User token missing"})
    }
}
module.exports={
    UserTokenHandler,
    userPreDataHandler,
}