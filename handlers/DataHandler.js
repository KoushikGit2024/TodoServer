const express = require('express');
const { Task } = require('../models/taskSchema');
const { User } = require('../models/userSchema');

const getUserTasks = async (req,res)=>{
    // if(req.query.search){

    // }
    let {username,worklist}= req.params;
    // if(worklist==="all")
    //     worklist='*';
    const user =req.user;
    const body=req.body;
    try {
        let tasks;
        if(worklist!="all"){
            tasks=await Task.find({
                createdByName: username,
                listType:worklist,
                deleted:false,
            })
        } else {
            tasks=await Task.find({
                createdByName: username,
                deleted:false,
            })
        }
        res.send(tasks);    
    } catch (error) {
        res.status(404).send({code:1004,msg:"Some error occured",error:error})
    }
}
const addNewTask= async (req,res) => {
    let {title,description,subTask}=req.body;
    let {username,worklist}=req.params;
    // if(worklist=="all")
    //     worklist='*';
    subTask.done.finishTime=new Date();
    
    let userId=await User.findOne({
        userName:username
    }).then((user)=>{
        return user.userId;
    }).catch((err)=>{
        return res.send({error:err});
    })
    try {
        const newTask = await Task.create({
            createdById:userId,
            createdByName:username,
            title:title,
            description:description,
            subTask:subTask,
            listType:worklist,
        })
        res.send({code:2000,msg:"Task added successfully"})    
    } catch (error) {
        res.status(404).send({code:1004,msg:"Some error occured",error:error})
    }
}

const updateTask=async (req,res) => {
    const {update,taskId,subTask}=req.body;
    let {username,worklist}=req.params;

    // if(worklist=="all")
    //     worklist='*';
    subTask.done.finishTime=new Date();
    try {
       const task=await Task.updateOne(
            {_id:taskId,deleted:false},
            {$push:{subTask}},
            {new: true}
        )
        // const task=await Task.findOne({
        //     _id:taskId
        // })
        res.send({code:2001,msg:"Task updated....",task:task}) 
    } catch (error) {
        res.send({code:1004,msg:"Some error occured....",error:error})
    }
}

const deleteTask=async (req,res) =>{
    const {taskId}=req.body;
    let {username}=req.params;
    try{
        console.log('hello')
        await Task.updateOne(
            {createdByName:username,
            _id:taskId,
            deleted:false},
            {$set:{deleted:true}},
            {new: true}
        ).then((task)=>{
            res.send({code:2002,msg:"Task deleted...",task:task})
        })
    } catch(err){
        res.send({code:1004,msg:"Some error occured....",error:err})
    }
}

const searchHandler = async (req,res)=>{
    let keyword=req.query.search;
    const userName=req.user.userName;
    // console.log({keyword,userName})
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
    res.send(tasks)
}

module.exports={
    getUserTasks,
    addNewTask,
    updateTask,
    deleteTask,
    searchHandler,
}