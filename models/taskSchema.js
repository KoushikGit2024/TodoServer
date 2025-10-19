// models/taskSchema.js
const mongoose = require('mongoose');

// Sub-task schema
const subTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    done: {
      flag: {
        type: Boolean,
        default: false,
      },
      finishTime: {
        type: Date,
        default: null,
      },
    },
  },
  { _id: false }
);

// Task schema
const taskSchema = new mongoose.Schema(
  {
    createdById: {
      type: mongoose.Types.UUID,
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    done: {
      flag: {
        type: Boolean,
        default: false,
      },
      finishTime: {
        type: Date,
        default: null,
      },
    },
    subTask: [subTaskSchema],
    listType: {
      type: String,
      default: 'all',
    },
    marked: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task, subTaskSchema };
