const jwt=require('jsonwebtoken')
const {v4:uuidv4}= require('uuid');
const {User} =require('../models/userSchema')
async function domainChecker(req,res) {
    if(req.query.search){
        const entered=req.query.search;
        // console.log(entered)
        try {
            const sr=await User.findOne({
                userName:entered,
            });
            if(sr)
                return res.send({code:100,msg:"Domain name unavailable"});
            else
                return res.send({code:101,msg:"Domain name available"})
        } catch (error) {
            return res.send({code:104,msg:"Error during avalaiblity check..."});
        }  
    }
    else
        res.send(null);
}
async function UserSignupHandler(req,res) {
    const {fullName,password,email,userName,profileImg,mobile} = req.body
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
            // console.log(req.body)
            try {
                const newUser=await User.create({
                                userId:uuidv4(),
                                fullName: fullName,
                                email:email,
                                password:password,
                                userName:userName,
                                mobile:mobile,
                                profileImg:profileImg,
                            });
                return res.send({code:1000,msg:"User signup successful"});
            } catch (error) {
                return res.status(404).send({code:1004,msg:"Unable to signup....",error:error});
            }
        }  
    } catch (error) {
        return res.status(404).send({code:1004,msg:"User signup failed...."})
    }
}
async function UserLoginHandler(req,res) {
    // console.log(req.body);
    const {authParam,password} = req.body;
    // console.log(req.cookies);
    const user = req;
    // console.log(authParam,password)
    let userName=req.user?.userName;
    if(user&&(!(authParam&&password)||(authParam===user.userName||authParam===user.email))){
        userName=req.user?.userName;
    }
    else{
        req.user=null;
    }
    // console.log(req.user)
    if(req.user){
        const {token}= req.cookies.UserValidationToken;
        // console.log("b1")
        try {
            const user = await User.findOneAndUpdate(
                        { userName: userName },
                        { $push: { logTime: new Date() } },
                        { new: true } // returns updated doc
                        ).select("-password -userId -_id -__v -logTime");// console.log(user)
            if(!user)
                return res.status(404).send({code:1004,msg:"User login failed.....",error:"Unable to find document"});
            return res.send({token:token,data:user,code:1002,msg:"User login successful"});
        } catch (error) {// console.log(err);
            return res.status(404).send({code:1004,msg:"User login failed.....",error:error});
        }
    } else{
        if(req.body){
            // console.log(req.cookies)
            try {
                const user=await User.findOneAndUpdate({
                                $and: [
                                    { $or: [{ email: authParam }, { userName: authParam }] },
                                    { password: password }
                                ]
                            },{ $push: { logTime: new Date() } },
                            { new: true } // returns updated doc
                            ).select("-password -userId -_id -__v -logTime");;
                if(!user)
                    return res.status(404).send({code:1004,msg:"User login failed.....",error:"Unable to find document"});
                const token = jwt.sign(
                    {
                        userName:user.userName,
                        fullName:user.fullName,
                        email:user.email,
                    },
                    process.env.USER_AUTHENTICATION_SECRET_KEY_JSONWEBTOKEN,
                    {expiresIn:"30d"}
                )
                // console.log("b2")
                res.cookie('UserValidationToken',token,{
                    httpOnly: false,  // prevents JS access
                    secure: false,   // set true if using HTTPS
                    sameSite: "lax",})
                return res.json({token:token,data:user,code:1002,msg:"User Login successful"});
            } catch (error) {
                return res.status(404).json({code:10041,msg:"Failed to fetch user data....",error:error});
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