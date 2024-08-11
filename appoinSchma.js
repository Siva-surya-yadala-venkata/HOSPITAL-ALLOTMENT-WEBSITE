const mongoose = require('mongoose');

const appointSchema = new mongoose.Schema({

    Appointment_ID : {
        type: Number,
        required: true,
        unique: true
    },

    Patient_Email : {
        type: String,
        required: true,
        
    },

    Patient_Name : {
        type: String,
        required: true
    },

    Doctor_ID : {
        type: Number,
        required: true,
        
    },

    Doctor_Name : {
        type: String,
        required: true
    },

    Appointment_Date : {
        type: String,
        required: true,
    },

    StartTime : {
        type: String,
        required: true
    },

    EndTime : {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('AppointSchema', appointSchema);