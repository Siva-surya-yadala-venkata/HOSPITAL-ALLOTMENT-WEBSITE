const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({

    Doctor_Name : {
        type: String,
        required: true
    },

    Doctor_ID : {
        type: Number,
        required: true,
        unique: true
    },

    Doctor_Email : {
        type: String,
        required: true,
        unique: true
    },

    Doctor_Password : {
        type: String,
        required: true
    },

    Doctor_Speciality : {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('doctorSchema', doctorSchema);