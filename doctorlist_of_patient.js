const mongoose = require('mongoose');

const listPatients = new mongoose.Schema({
    Doctor_ID : {
        type: Number,
        required: true,
        unique: true
    },

    // PatientsList : {
    //     type: [String],
    // },

    Appointment_ID : {
        type: [Number],
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('listPatients', listPatients);