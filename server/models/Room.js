const mongoose = require('mongoose');
const User = require('./User');

const roomSchema = new mongoose.Schema({
    members: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
          required: true
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 50']
      },
    description:{
        type:String,
        required:false,
        maxlength: 100,
        minlength: 1
    },
    date:{
        type:Date,
        required:true,
    },
    img:{
        type:String,
        required:false
    },
    });

    function arrayLimit(val) {
        return val.length <= 50;
      }

    module.exports = mongoose.model('Room', roomSchema);