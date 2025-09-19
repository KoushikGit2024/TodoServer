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

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://chidanand013:Panchaks108_2047@cluster0.72hsoip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// module.exports={run};