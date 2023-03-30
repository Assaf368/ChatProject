const mongoose = require('mongoose');
const Room = require('./Room');
const User = require('./User');

const massageSchema = new mongoose.Schema({
    text:{
        type:String,
        required: true,
        minlength:1
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    date:{
        type:Date,
        required: true
    },
    target:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Room,
        required: true
    }
});

module.exports = mongoose.model('Massage', massageSchema);