const express = require('express');
const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { Task } = require('../models/taskSchema');
const { getUserTasks, addNewTask, updateTask, deleteTask, searchHandler } = require('../handlers/DataHandler');
const { fetchUserData, updateUserData } = require('../handlers/userProfileHandler');

const UserRoute = express.Router();
UserRoute.use(express.json())

// UserRoute.get('/',async (req,res)=>{
//     // const {token}= req.body;
//     const decoded = req.user;
//     const user = await User.findOne({
//         email:decoded.email,
//     })
//     res.send(user)
// })

UserRoute.route('/:username/todos/:worklist')
    .get(getUserTasks)
    .post(addNewTask)
    .patch(updateTask)
    .delete(deleteTask);

UserRoute.get('/:username/todos',searchHandler);

UserRoute.route('/:username/profile')
    .get(fetchUserData)
    .patch(updateUserData)

module.exports= UserRoute;