const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username    : {
        type: "string",
        required: true
    },
    password    : {
        type: "string",
        required: true
    },
    email       : {
        type: "string",
        required: true,
        unique: true
    },
    isSuperUser : {
        type: Boolean,
        required: true
    },
    isAdmin : {
        type: Boolean,
        required: true
    }   


  });

module.exports = mongoose.model('example_db', userSchema);