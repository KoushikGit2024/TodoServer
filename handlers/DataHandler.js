// handlers/DataHandler.js
const { Task } = require('../models/taskSchema');
const { User } = require('../models/userSchema');

/**
 * Fetch user tasks with pagination and filtering.
 */
const getUserTasks = async (req, res) => {
  const { worklist = 'all', pageno = 0 } = req.query;
  const userName = req.user.userName;

  try {
    const query = {
      createdByName: userName,
      deleted: false,
    };

    if (worklist === 'finished') {
      query['done.flag'] = true;
    } else if (worklist !== 'all') {
      query.listType = worklist;
      query['done.flag'] = false;
    } else {
      query['done.flag'] = false;
    }

    const tasks = await Task.find(query)
      .select('-createdById')
      .sort({ createdAt: -1 })
      .skip(10 * pageno)
      .limit(10);

    if (tasks.length === 0) {
      return res.send({ code: 201, tasks, msg: 'No tasks found.' });
    }

    res.send({ code: 200, tasks, msg: 'Tasks fetched successfully.' });
  } catch (error) {
    res
      .status(500)
      .send({ code: 1004, msg: 'Error fetching tasks.', error });
  }
};

/**
 * Add a new task for a user.
 */
const addNewTask = async (req, res) => {
  const taskData = req.body;
  const user = req.user;

  try {
    const userDoc = await User.findOne({ userName: user.userName }).select('userId -_id');

    if (!userDoc) {
      return res
        .status(404)
        .send({ code: 1005, msg: 'User not found for task creation.' });
    }

    const newTask = await Task.create({
      ...taskData,
      createdById: userDoc.userId,
      createdByName: user.userName,
    });

    res.send({ code: 1000, msg: 'Task created successfully.', task: newTask });
  } catch (error) {
    res
      .status(500)
      .send({ code: 1004, msg: 'Error creating task.', error });
  }
};

/**
 * Update an existing task (including subTask logic).
 */
const updateTask = async (req, res) => {
  const { taskId, updateBlock } = req.body;

  try {
    let task = await Task.findOneAndUpdate(
      { _id: taskId, deleted: false },
      { $set: { ...updateBlock } },
      { new: true }
    );

    if (!task) {
      return res.status(404).send({ code: 1005, msg: 'Task not found.' });
    }

    // If subTask is updated, check overall completion
    if (Object.keys(updateBlock)[0]?.includes('subTask')) {
      const allCompleted = task.subTask.every((t) => t.done.flag);

      const doneStatus = allCompleted
        ? { flag: true, finishTime: new Date() }
        : { flag: false, finishTime: null };

      task = await Task.findOneAndUpdate(
        { _id: taskId, deleted: false },
        { $set: { done: doneStatus } },
        { new: true }
      );
    }

    res.send({
      code: 2001,
      msg: 'Task updated successfully.',
      updated: true,
      task,
    });
  } catch (error) {
    res
      .status(500)
      .send({ code: 1004, msg: 'Error updating task.', error });
  }
};

/**
 * Soft delete a task.
 */
const deleteTask = async (req, res) => {
  const { taskId } = req.query;

  try {
    const deletedTask = await Task.updateOne(
      { _id: taskId, deleted: false },
      { $set: { deleted: true } }
    );

    if (deletedTask.modifiedCount === 0) {
      return res.status(404).send({ code: 1005, msg: 'Task not found or already deleted.' });
    }

    res.send({ code: 200, msg: 'Task deleted successfully.', deleted: true });
  } catch (error) {
    res
      .status(500)
      .send({ code: 1004, msg: 'Error deleting task.', error });
  }
};

/**
 * Search tasks by keyword in title, description, or subTasks.
 */
const searchHandler = async (req, res) => {
  const { search = '' } = req.query;
  const userName = req.user.userName;

  try {
    const tasks = await Task.aggregate([
      {
        $match: {
          createdByName: userName,
          deleted: false,
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'subTask.title': { $regex: search, $options: 'i' } },
            { 'subTask.description': { $regex: search, $options: 'i' } },
          ],
        },
      },
    ]);

    res.send({ code: 200, msg: 'Tasks found successfully.', tasks });
  } catch (error) {
    res
      .status(500)
      .send({ code: 1004, msg: 'Error searching tasks.', error });
  }
};

module.exports = {
  getUserTasks,
  addNewTask,
  updateTask,
  deleteTask,
  searchHandler,
};
