const express = require('express');
const cors = require("cors");
const {v4:uuidv4, stringify}= require('uuid');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app=express();
const PORT=process.env.PORT||7400;

const {User} = require('./models/userSchema');
const { Task,subTask } = require('./models/taskSchema');
const {run,ConnectDb} = require('./connection');
const UserRoute = require('./routes/userRoute');
const BaseRoute = require('./routes/baseRoute');
const { UserAuthenticationHandler, userPreDataHandler } = require('./middlewares/UserTokenChecker');

ConnectDb();

app.use(cors({
    origin:["https://todofrontend-t9qq.onrender.com","https://todo-frontend-sage-two.vercel.app","http://localhost:5173"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/baseroute',BaseRoute);
app.use('/api/user',userPreDataHandler,UserRoute);

app.get('/',(req,res)=>{
    res.send("Hello");
});




































function randomSentence(wordCount = 5) {
  const words = ["sky", "river", "cloud", "stone", "echo", "dream", "fire", "storm", "leaf", "shadow"];
  let sentence = [];
  for (let i = 0; i < wordCount; i++) {
    sentence.push(words[Math.floor(Math.random() * words.length)]);
  }
  return sentence.join(" ");
}



app.get('/',async (req,res)=>{
    // const newData= await User.create({
    //     userId: uuidv4(),
    //     fullName:"kou",
    //     userName:`kou${9681249101*Math.random()}`,
    //     email:`kou${Math.random()}@gmail.com`,
    //     password:`${Math.random()}`,
    //     logTime:[
    //         `${Date()}`
    //     ]
    // })
    const newTask = await Task.create({
        createdById:"2f857648-84f5-4789-ae35-e18c952d2ce1",
        createdByName:"kou7945577200.774166",
        title:`${randomSentence(4)}`,
        description:`${randomSentence(10)}`,
        done:{
            flag: true,
            finishTime: new Date(),
        },
        subTask:[
            ({
                title:`st${Math.random()}`,
                description:"Blalalalal1",
                done:{
                    finishTime:new Date(),
                },
            }),
            ({
                title:`st${Math.random()}`,
                description:"Blalalalal2",
                done:{
                    finishTime:new Date()
                },
            })
        ],
    })
    .catch((e)=>{
        return res.send(e)
    })
    res.send([newTask]);
})





























































app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
})
// [{"userId":"19e9655a-f73a-46f1-8c06-cf3a09a8cf22"},{"done":{"flag":true,"finishTime":"2025-09-09T17:01:33.989Z"},"subTask":[{"title":"st1","description":"Blalalalal1","done":{"finishTime":"2025-09-09T17:01:33.989Z","flag":false}},{"title":"st2","description":"Blalalalal2","done":{"finishTime":"2025-09-09T17:01:33.989Z","flag":false}}],"listType":"*","_id":"68c05d6dff0294db0c93766d","createdAt":"2025-09-09T17:01:33.997Z","updatedAt":"2025-09-09T17:01:33.997Z","__v":0}]