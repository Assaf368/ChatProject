const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: [true, 'UserName cannot be blank!'],
        minlength: 3,
        maxlength:10
    },
    password:{
        type:String,
        required: [true, 'Password cannot be blank!'],
        minlength: 8,
        maxlength:200
    },
    isAdmin:{
        type: Boolean,
        required: false
    },
    isOnline:{
        type: Boolean,
        required: true,
        default: false
        
    },
    socketId:{
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    status:{
        type: String,
        required : false,
        minlength: 1,
        maxlength:40
    }
});

module.exports = mongoose.model('User', userSchema);