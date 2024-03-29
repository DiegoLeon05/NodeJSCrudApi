const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    TaskDescription: {
        type: String,
        required: true,
        trim: true
    },
    TaskActive: {
        type: Boolean,
        default: false
    },
    TaskOwner :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps:true,
});

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;