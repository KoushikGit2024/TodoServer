const express = require('express');
const jwt = require('jsonwebtoken');

function  UserAuthenticationHandler(req,res,next){
    
    if(req.body){
        const { token }=req.body;
        if(token){
            jwt.verify(token, process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
                async (err, user) => {
                    if (err) {
                        req.error=err.name;
                        next()
                        // res.status(404).send({code:1004,msg:"Some error occured",error:err})
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
    UserAuthenticationHandler,
    userPreDataHandler,
}