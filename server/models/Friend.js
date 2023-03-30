const mongoose = require('mongoose');
const User = require('./User');

const friendSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    target:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    isApproved:{
        type:Boolean,
        required:true
    }
});

module.exports = mongoose.model('Friend', friendSchema);