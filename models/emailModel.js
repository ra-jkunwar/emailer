const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email:{
        type:String,
        match:[
            /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            "Please enter valid email address."
        ],
        required:true
    },
    golf:{
        type:Boolean,
        default:false
    }

})
module.exports = mongoose.model('Email',emailSchema);
