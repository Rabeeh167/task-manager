const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = mongoose.Schema({
    description:{
        type: String,
        required:true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task', taskSchema)

const task = new Task({
    description:'purchase',
    completed: true
})

module.exports = Task