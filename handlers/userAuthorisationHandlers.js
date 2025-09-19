const jwt=require('jsonwebtoken')

const {v4:uuidv4}= require('uuid');
const {User} =require('../models/userSchema')
async function domainChecker(req,res) {
    if(req.query.search){
        const entered=req.query.search;
        try {
            const sr=await User.findOne({
                userName:entered,
            });
            if(sr)
                return res.send({msg:"Domain name unavailable"});
            else
                return res.send({msg:"Domain name available"})
        } catch (error) {
            res.send({msg:"Error during avalaiblity check..."});
        }  
    }
    else
        res.send(null);
}
async function UserSignupHandler(req,res) {
    const {fullName,password,email,userName,token} = req.body
    try {
        // console.log(req.body)
        const user =await User.findOne({
            $or:[
                {email:email},
                {userName:userName},
            ],
        })  
        if(user){
            return res.send({code:1001,msg:"User already registered"});
        } else {
            try {
                const newUser=await User.create({
                                userId:uuidv4(),
                                fullName: fullName,
                                email:email,
                                password:password,
                                userName:userName,
                            });
                return res.send({token:null,code:1000,msg:"User signup successful"});
            } catch (error) {
                return res.status(404).send({code:1004,msg:"Unable to signup....",error:error});
            }
        }  
    } catch (error) {
        // console.log(error)
        return res.status(404).send({code:1004,msg:"User signup failed...."})
    }
        
}
async function UserLoginHandler(req,res) {
    console.log(req.body);
    if(req.user){
        const {userName} = req.user;
        const {token}= req.body;
        // console.log(req.user)
        try {
            const user = await User.findOne({
                            userName: userName
                        }).select("-password -userId -_id -__v");// console.log(user)
            return res.send({token:token,data:user,code:1002,msg:"User login successful"});
        } catch (error) {// console.log(err);
            return res.status(404).send({code:1004,msg:"User login failed.....",error:error});
        }
    } else{
        if(req.body){
            const {authParam,password} = req.body.params;
            try {
                const user=await User.findOne({
                                $and: [
                                    { $or: [{ email: authParam }, { userName: authParam }] },
                                    { password: password }
                                ]
                            })
                            .select("-password -userId -_id -__v");
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
            } catch (error) {
                return res.status(404).json({code:10041,msg:"Some error occured",error:error});
            }
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