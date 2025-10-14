const mongoose = require('mongoose');
const { stringify } = require('uuid');

const subTask = new mongoose.Schema({
    title:{
        type: String,
        // required: true,
    },
    description:{
        type: String,
    },
    done:{
        flag:{
            type: Boolean,
            default: false,
        },
        finishTime:{
            type: Date
        }
    },
    
},{_id:false});

const taskSchema = new mongoose.Schema({
    createdById:{
        type: mongoose.Types.UUID,
        required: true
    },
    createdByName:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    done:{
        flag:{
            type: Boolean,
            default: false,
        },
        finishTime:{
            type: Date
        }
    },
    subTask:[
        subTask
    ],
    listType:{
        type: String,
        default: "all"
    },
    marked:{
        type:Boolean,
        default:false,
    },
    deleted:{
        type: Boolean,
        default: false
    },
    endTime:{
        type:Date,
        required: true,
    }
},{timestamps:true});

const Task = mongoose.model('tasks',taskSchema);
module.exports={Task,subTask};