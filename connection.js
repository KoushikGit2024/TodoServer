const mongoose = require("mongoose");

const uri ='mongodb://localhost:27017/TodoList' //`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.72hsoip.mongodb.net/TodoList?retryWrites=true&w=majority&ssl=true&appName=Cluster0`;

async function ConnectDb() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop app if DB connection fails
  }
}

module.exports = {ConnectDb};