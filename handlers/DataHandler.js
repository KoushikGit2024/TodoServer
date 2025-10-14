const express = require('express');
const { Task } = require('../models/taskSchema');
const { User } = require('../models/userSchema');

const getUserTasks = async (req,res)=>{
    const worklist=req.query.worklist;
    const user =req.user.userName;
    try {
        let tasks=[];
        if(worklist!="all"){
            tasks=await Task.find({
                createdByName: user,
                listType:worklist,
                deleted: false,
            }).select('-createdById').sort({createdAt:-1});
        } else {
            tasks=await Task.find({
                createdByName: user,
                deleted: false,
            }).select('-createdById').sort({createdAt:-1});
        }
        if(tasks.length===0)
            return res.send({code:201,tasks:tasks,msg:'No task listed yet....'});
        res.send({code: 200,tasks:tasks,msg:'Tasks Fetched.....'});    
    } catch (error) {
        console.log(error)
        res.status(404).send({code:1004,msg:"Some error occured",error:error});
    }
}
const addNewTask= async (req,res) => {
    let task=req.body;
    let user=req.user;
    
    // console.log(task,user);
    try {
        const createdById=await User.findOne({
            userName:user.userName
        }).select('userId -_id')
        // console.log(JSON.stringify(createdById.userId))
        const newTask= await Task.create({
            ...task,createdById:createdById.userId
        })
        // console.log(newTask)
        res.send({code:1000,msg:"task created ",task:newTask});
    } catch (error) {
        return console.log(error)
    }
    // let userId=await User.findOne({
    //     userName:userName
    // }).then((user)=>{
    //     return user.userId;
    // }).catch((err)=>{
    //     return res.send({error:err});
    // })
    // try {
    //     const newTask = await Task.create({
    //         createdById:userId,
    //         createdByName:userName,
    //         title:title,
    //         description:description,
    //         subTask:subTask,
    //         listType:worklist,
    //     })
    //     res.send({code:2000,msg:"Task added successfully"})    
    // } catch (error) {
    //     res.status(404).send({code:1004,msg:"Some error occured",error:error})
    // }
    // res.send("gedjihnj")
}

const updateTask = async (req, res) => {
    const { taskId, updateBlock } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, deleted: false },
            { $set: { updateBlock } },
            { new: true }
        );

        if (!task) {
            return res.status(404).send({ code: 1005, msg: "Task not found" });
        }

        res.send({ code: 2001, msg: "Task updated...", updated:true });
    } catch (error) {
        res.status(500).send({ code: 1004, msg: "Some error occurred...", error });
    }
};


const deleteTask=async (req,res) =>{
    // username=req.user.userName
    const {taskId}=req.query;
    // console.log(req.user)
    // return res.send({code:200})
    let username=req.user.userName;
    try{
        console.log(taskId)
        await Task.updateOne(
            {_id:taskId,
            deleted:false},
            {$set:{deleted:true}},
            // {new: true}
        ).then((task)=>{
            res.send({code:200,msg:"Task deleted...",deleted:true})
        })
    } catch(err){
        res.send({code:1004,msg:"Some error occured....",error:err})
    }
}

const searchHandler = async (req,res)=>{
    let keyword=req.query.search;
    const userName=req.user.userName;
    console.log(keyword)
    const tasks = await Task.aggregate([{
        $match: {
            $and:[
                {createdByName:userName},
                {deleted:false},
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                        { "subTask.title": { $regex: keyword, $options: "i" } },
                        { "subTask.description": { $regex: keyword, $options: "i" } }
                    ] 
                }       
            ]
        }
    }]);
    res.send({code:200,msg:"Tasks found successfully....",tasks:tasks})
}

module.exports={
    getUserTasks,
    addNewTask,
    updateTask,
    deleteTask,
    searchHandler,
}