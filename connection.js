const mongoose = require('mongoose');

async function ConnectDb(url){
    await mongoose.connect(url)
    .then((cnt)=>{
        console.log("Database Connected.........");
    })
    .catch((e)=>{
        console.log("Error Occured:=> ",e);
    })
}

module.exports= {ConnectDb};