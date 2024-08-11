const doctorDb = require('./doctorSchema.js');
const mongoose = require('mongoose');

const insertDoctors = doctorDb.insertMany([
    {
        Doctor_Name: "Dr.Kailash A Jain",
        Doctor_ID: 1, 
        Doctor_Email: "doctor1@gmail.com",
        Doctor_Password: "d1",
        Doctor_Speciality:"Cardiologist"
    },
    {
        Doctor_Name: "Dr.Ghayoor Ahmed",
        Doctor_ID: 2,
        Doctor_Email: "doctor2@gmail.com",
        Doctor_Password: "d2",
        Doctor_Speciality: "Cardiologist"
    },
    {
        Doctor_Name: "Dr.Aisha Patel",
        Doctor_ID: 3,
        Doctor_Email: "doctor3@gmail.com",
        Doctor_Password: "d3",
        Doctor_Speciality: "Gastoenterologist"
    },
    {
        Doctor_Name: "Dr.Sameera Khan",
        Doctor_ID: 4,
        Doctor_Email: "doctor4@gmail.com",
        Doctor_Password: "d4",
        Doctor_Speciality: "Gastoenterologist"
    },
    {
        Doctor_Name: "Dr.Ravi Sharma",
        Doctor_ID: 5,
        Doctor_Email: "doctor5@gmail.com",
        Doctor_Password: "d5",
        Doctor_Speciality: "Orthopaedic"
    },
    {
        Doctor_Name: "Dr.Ananya Singh",
        Doctor_ID: 6,
        Doctor_Email: "doctor6@gmail.com",
        Doctor_Password: "d6",
        Doctor_Speciality: "Orthopaedic"
    },
    {
        Doctor_Name: "Dr.Maya Patel",
        Doctor_ID: 7,
        Doctor_Email: "doctor7@gmail.com",
        Doctor_Password: "d7",
        Doctor_Speciality: "Dermatology"
    },
    {
        Doctor_Name: "Dr.Rohn Shah",
        Doctor_ID: 8,
        Doctor_Email: "doctor8@gmail.com",
        Doctor_Password: "d8",
        Doctor_Speciality: "Dermatology"
    },
    {
        Doctor_Name: "Dr.Rahul Singh",
        Doctor_ID: 9,
        Doctor_Email: "doctor9@gmail.com",
        Doctor_Password: "d9",
        Doctor_Speciality: "Pulmonology"
    },
    {
        Doctor_Name: "Dr.Priya Sharma",
        Doctor_ID: 10,
        Doctor_Email: "doctor10@gmail.com",
        Doctor_Password: "d10",
        Doctor_Speciality: "Pulmonology"
    },
    {
        Doctor_Name: "Dr.Vikram Singh",
        Doctor_ID: 11,
        Doctor_Email: "doctor11@gmail.com",
        Doctor_Password: "d11",
        Doctor_Speciality: "Liver Transplant"
    },
    {
        Doctor_Name: "Dr.Natasha Gupta",
        Doctor_ID: 12,
        Doctor_Email: "doctor12@gmail.com",
        Doctor_Password: "d12",
        Doctor_Speciality: "Liver Transplant"
    },
    // {
    //     Doctor_Name: "Dr.Neha Sharma",
    //     Doctor_ID: 13,
    //     Doctor_Email: "doctor13@gmail.com",
    //     Doctor_Password: "d13",
    //     Doctor_Speciality: "Pain Management"
    // },
    // {
    //     Doctor_Name: "Dr.Rajesh Kumar",
    //     Doctor_ID: 14,
    //     Doctor_Email: "doctor14@gmail.com",
    //     Doctor_Password: "d14",
    //     Doctor_Speciality: "Pain Management"
    // },
    // {
    //     Doctor_Name: "Dr.Vikram Patel",
    //     Doctor_ID: 15,
    //     Doctor_Email: "doctor15@gmail.com",
    //     Doctor_Password: "d15",
    //     Doctor_Speciality: "Maxillofacial and Dental Surgery"
    // },
    // {
    //     Doctor_Name: "Dr.Priya Sharma",
    //     Doctor_ID: 16,
    //     Doctor_Email: "doctor16@gmail.com",
    //     Doctor_Password: "d16",
    //     Doctor_Speciality: "Maxillofacial and Dental Surgery"
    // },
    // {
    //     Doctor_Name: "Dr.Sanjay Patel",
    //     Doctor_ID: 17,
    //     Doctor_Email: "doctor17@gmail.com",
    //     Doctor_Password: "d17",
    //     Doctor_Speciality: "ENT Head and Neck Surgery"
    // },
    // {
    //     Doctor_Name: "Dr.Kunal Sharma",
    //     Doctor_ID: 18,
    //     Doctor_Email: "doctor1@gmail.com",
    //     Doctor_Password: "d18",
    //     Doctor_Speciality: "ENT Head and Neck Surgery"
    // },
])

// insertDoctors.save();

module.exports = insertDoctors;