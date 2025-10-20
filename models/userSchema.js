// models/userSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.UUID,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
      default: 'general',
    },
    colorTheme: {
      currentTheme: {
        type: Number,
        default: 0,
      },
      themes: {
        type: [
          {
            clr1: String,
            clr2: String,
            clr3: String,
            clr4: String,
          },
        ],
        default: [],
      },
    },
    logTime: {
      type: [Date],
      default: [],
    },
    profileImg: {
      type: String,
      default: '',
    },
    worklist: {
      type: [String],
      default: [
        'all',
        'finished',
        'study',
        'work',
        'groceries',
        'travel',
        'medicine',
        'exercise',
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
