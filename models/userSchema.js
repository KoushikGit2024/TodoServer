const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    userId:{
        type: mongoose.Types.UUID,
        required: true,
        unique: true,
    },
    fullName:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    mobile:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    userType:{
        type:String,
        required:true,
        default: "general"
    },
    colorTheme: {
        type: mongoose.Schema.Types.Array,
        currentTheme:{
            type: Number,
            default: 0
        },
        default:[{
            clr1:"#3396D3",
            clr2:"#FFF0CE",
            clr3:"#EBCB90",
            clr4:"#EEEEEE"
        }],
    },
    logTime:[
        {
           type: Date, 
        }
    ],
    profileImg:{
        type:String,
        default:""
    },
    worklist:{
        type: Array,
        default:[
            "Study","Work","Groceries","Travel","Medicine","Exercise"
        ],
    }
},{timestamps: true});

const User=mongoose.model('users',userSchema);
// console.log(User);
module.exports= {User};