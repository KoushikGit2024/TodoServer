const jwt=require('jsonwebtoken')

const {v4:uuidv4}= require('uuid');
const {User} =require('../models/userSchema')
async function domainChecker(req,res) {
    if(req.query.search){
        const entered=req.query.search;
        await User.findOne({
            userName:entered,
        }).then((sr)=>{
            if(sr)
                return res.send({msg:"Domain name unavailable"});
            else
                return res.send({msg:"Domain name available"})
        })
        
    }
}
async function UserSignupHandler(req,res) {
    const {fullName,password,email,userName,token} = req.body
    try {
        const user =await User.findOne({
            $or:[
                {email:email},
                {userName:userName},
            ],
        })  
        if(user){
            return res.send({code:1001,msg:"User already registered"});
        } else {
            await User.create({
                userId:uuidv4(),
                fullName: fullName,
                email:email,
                password:password,
                userName:userName,
            }).then((newUser)=>{
                return res.send({token:null,code:1000,msg:"User signup successful"});
            }).catch((err)=>{
                return res.status(404).send({code:1004,msg:"Unable to signup....",error:err});
            });
        }  
    } catch (error) {
        return res.send({code:1004,msg:"User signup failed...."})
    }
        
}
async function UserLoginHandler(req,res) {
    
    if(req.user){
        const {userName} = req.user;
        const {token}= req.body;
        await User.findOne({
            userName: userName
        }).select("-password -userId -_id -__v").then((user)=>{
        
            return res.send({token:token,data:user,code:1002,msg:"User login successful"});
        }).catch((err)=>{
            return res.status(404).send({code:1004,msg:"User login failed",error:err});
        });
    } else{
        if(req.body){
            const {authParam,password} = req.body;
            await User.findOne({
                $and: [
                    { $or: [{ email: authParam }, { userName: authParam }] },
                    { password: password }
                ]
            })
            .select("-password -userId -_id -__v")
            .then((user)=>{
                const token = jwt.sign(
                    {
                        userName:user.userName,
                        fullName:user.fullName,
                        email:user.email,
                    },
                    process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
                    {expiresIn:"1d"}
                )
                return res.json({token:token,data:user,code:1002,msg:"User Login successful"});
            })
            .catch((err)=>{
                console.log(err)
                return res.status(404).json({code:10041,msg:"Some error occured",error:err});
            })    
        }
        else{
            return res.status(404).json({code:10041,msg:"No parameters received"});
        }
        
    }
}
module.exports={
    UserSignupHandler,
    UserLoginHandler,
    domainChecker,
}