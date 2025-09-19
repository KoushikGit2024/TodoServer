const mongoose = require('mongoose');

async function ConnectDb(url){
    await mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((cnt)=>{
        console.log("Database Connected.........");
    })
    .catch((e)=>{
        console.log("Error Occured:=> ",e);
    })
}

module.exports= {ConnectDb};