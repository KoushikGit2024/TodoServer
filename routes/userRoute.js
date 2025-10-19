// routes/userRoutes.js
const express = require('express');
const {
  getUserTasks,
  addNewTask,
  updateTask,
  deleteTask,
  searchHandler,
} = require('../handlers/DataHandler');
const {
  fetchUserData,
  updateUserData,
} = require('../handlers/userProfileHandler');

const UserRoute = express.Router();

UserRoute.use(express.json());

// Task routes
UserRoute.route('/tasks/worklist')
  .get(getUserTasks)
  .post(addNewTask)
  .patch(updateTask)
  .delete(deleteTask);

UserRoute.get('/tasks', searchHandler);

// Profile routes
UserRoute.route('/profile')
  .get(fetchUserData)
  .patch(updateUserData);

module.exports = UserRoute;
