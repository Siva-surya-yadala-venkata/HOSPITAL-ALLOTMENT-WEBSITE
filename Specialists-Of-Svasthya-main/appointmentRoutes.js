const express = require('express');
const router = express.Router();
const { Appointment } = require('../models/appointment');

// Endpoint for creating appointments
router.post('/appointments', async (req, res) => {
  try {
    const { doctor, patient, dateTime, specialities } = req.body;

    // Create a new appointment instance
    const newAppointment = new Appointment({
      doctor,
      patient,
      dateTime,
      specialities
    });

    // Save the appointment to the database
    await newAppointment.save();

    res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
});

module.exports = router;
