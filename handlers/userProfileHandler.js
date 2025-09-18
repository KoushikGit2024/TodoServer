
const { User } = require("../models/userSchema");

const fetchUserData=async (req,res)=>{
    try {
        const user=await User.findOne({
            "userName":req.params.username
        })
        res.send({code:1010,msg:"Data fetched successfully....",user:user});    
    } catch (error) {
        res.send({code:1004,msg:"Some error occured....",error:error});
    }
}
const updateUserData =async (req,res) => {
    try {
        const user= await User.findOne({
            userName:req.params.username,
        })
        res.send({code:10101,msg:"Data fetched successfully....",user:user}); 
    } catch (error) {
        res.send({code:1004,msg:"Some error occured....",error:error});
    }
}

module.exports={
    fetchUserData,
    updateUserData,
}