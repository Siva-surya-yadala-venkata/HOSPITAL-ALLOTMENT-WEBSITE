// User Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Appointment Model
const appointmentSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  specialities: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { User, Appointment };
