const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userSchema');

async function  UserTokenHandler(req,res,next){
    // console.log(req.body,"hello");
    if(req.body){
        const token=req.cookies.UserValidationToken;
        // console.log(token);
        if(token){
            jwt.verify(token, process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
                async (err, user) => {
                    if (err) {
                        req.error=err.name;
                        console.log("k2")
                        next();
                    }else{
                        req.user=user;
                        console.log("k3")
                        next();
                    }
                }
            );    
        } else {
            res.code=1005,
            console.log("k1")
            next();
        }
        
    } else{
        res.code=1005,
        next();
    }
}
async function userPreDataHandler(req,res,next) {
    const token=req.cookies.UserValidationToken;
    
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