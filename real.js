const express = require('express');
const app = express();
const session = require('express-session')
const path = require('path');
const dotenv = require('dotenv').config();
const connectDb = require('./dbConnection.js');
const doc = require('./schema.js');  // patient details
const appointDb = require('./appoinSchma.js'); //appointment details
const doctorDb = require('./doctorSchema.js'); //doctor details
const listPatients = require('./doctorlist_of_patient.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
const { count } = require('console');
// import nodemailer from "nodemailer";
// const { render } = require('ejs');
// const insertDoctors = require('./insertdoctors.js');
// insertDoctors; //at first doctors database upload doctors personal info 

// console.log(doctorDb)
// console.log(doc)
// console.log(appointDb)
// const { name } = require('ejs');
// app.get('/a', async (req, res) => {
    
//     const docd = await doctorDb.findOne({
//         Doctor_Name: "Dr.Aisha Patel"
//     })
//     if(docd) {
        
//         console.log(docd.Doctor_ID);
//         res.end();
//     }
//     else {
//         console.log('no')
//         res.end()
//     }
// })

connectDb();

// function simulateServerProcessing() {
//     return new Promise((resolve) => {
//         setTimeout(resolve, 2000); // Simulate 2 seconds of processing

//     });
// }

app.use(express.urlencoded({extended: true}));
const PORT = process.env.PORT || 9000;
app.use(express.static('public'));

app.use(session({
    secret: "This is secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 20 * 60 * 1000 }

}))


app.use(express.json());


app.post('/login', async (req, res) => {
    
    const email = req.body.email;
    const password = req.body.password;

    // const hash = bcrypt.hashSync(password, saltRounds);

    // console.log(email, password)

    if(email && password) {

    const user = await doc.findOne({email: email});

    function check(hash, password) {

        if(bcrypt.compareSync(password, hash)) {
            return true;
        }

        else {
            return false;
        }

    }


    if(user && check(user.password, password)) {



    req.session.email = user.email;
        // res.render('index.ejs', {
        //     username: user.username,
        // });
        // res.redirect('/home');
        // const direct = req.session.url || '/log';
        // if(direct == '/log') {
        //     console.log("jel")
        // }
        // res.redirect(direct);
        // console.log("thsi is ", user.isSuperUser === true)

        if(user.isSuperUser === true) {
            res.redirect('/super')
        }

        else if(user.email === "admin@gmail.com") {
            res.redirect('/admin')
        }


        else {
            res.redirect('/home')
        }

    }

    else {
        res.render('login2.ejs', {
            msg: "No user found with given username and password"
        })
    }
}

    else {
        res.render('login2.ejs', {
            msg: "All fields are Mandatory"
        })
    }


});

app.post('/signup', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, saltRounds);
    const email = req.body.email;

    const user = await doc.findOne({email: email})
    

    // const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    // bcrypt.compareSync(myPlaintextPassword, hash);


    if(user) {
        res.render('a.ejs', {
            msg: "Already a user is created with given email"
        })
    }

    else {

    if(username && hash && email) {

        
        if(username === "superuser") {
            const newUser = await new doc({
                username:username,
                password: hash,
                email: email,
                isSuperUser: 1,
                isAdmin: 0,
            });
            newUser.save();
            console.log("user")
        }

        
        else {
            const newUser = await new doc({
                username:username,
                password: hash,
                email: email,
                isSuperUser: 0,
                isAdmin: 0,
            });
            newUser.save();
        }

        
       

        
        
        res.redirect('/log');
    }
    
    else {
    
        res.render('a.ejs', {
            msg: "All fields are Mandotory"
        })
    }
}

})

function ensureAuthenticated(req, res, next) {
    if (req.session.email) {
        // User is authenticated, redirect to home page or any other page
        // console.log("true")
        // console.log(req.session.email)
        return res.redirect('/home');
    } else {
        // User is not authenticated, allow the request to proceed
        // console.log("false")
        return next();
    }
}
     
app.get('/log', ensureAuthenticated, (req, res)=> {


    res.render('login2.ejs', {
    })
})



app.get('/home', async (req, res) => {

   
    // await simulateServerProcessing();


    // console.log(req.session);
    const email = req.session.email;
    const user = await doc.findOne({email: email});

    
    
    if(user) {
        username = user.username;

        req.session.username = username;

        res.render('index.ejs', {
            username: username,
        })
    }
    else {
        // console.log("No user found");
        res.redirect('/log');
    }
})

app.get('/appointment', async (req, res) => {
    // console.log(req.session.email);
    const email = req.session.email;
    const user = await doc.findOne({email: email});
    req.session.url = '/appointment';

    const doctor_list = await doctorDb.find({}).sort({Doctor_ID: 1});


    if(user) {

        username = user.username;

        res.render('appointment.ejs', {
            username: username,
            doctor_list: doctor_list
        })

    

        
    }

    else {
        // console.log(req.session.email);
        res.redirect('/log');
    }

})

app.post('/book1', (req, res) => {


    const { name, speciality} = req.body;


    req.session.doctor_name = name;
    req.session.speciality = speciality;


    res.redirect('/appointment2');
    

})

app.get('/appointment2', (req, res) => {


    // console.log(req.session.doctor_name + "  " + req.session.speciality);

    res.render('appointment2.ejs', {
        name: req.session.doctor_name,
        speciality: req.session.speciality
    })

})

let Appointment_ID = 1000;
console.log(Appointment_ID)


app.post('/send', async (req, res) => {
    const body = req.body;
    console.log(body);

    if(Appointment_ID === 1000) {
        await appointDb.deleteMany({});
    }

    let given_year = body.appointment_date[0]+body.appointment_date[1]+body.appointment_date[2]+body.appointment_date[3];
    let given_month = body.appointment_date[5]+body.appointment_date[6];
    let given_date = body.appointment_date[8]+body.appointment_date[9];
    
    let start_hour = body.startTime[0]+body.startTime[1];
    let start_min = body.startTime[3]+body.startTime[4];
    let end_hour = body.endTime[0]+body.endTime[1];
    let end_min = body.endTime[3]+body.endTime[4];

    const email = req.session.email;
    const user = await doc.findOne({email: email});
    // console.log("this is given statement  " + given_year === new Date().getFullYear())
    // let flag = 0;

    if(user) {

        // if(given_year >= new Date().getFullYear() && given_month >= new Date().getMonth()+1 || given_date >= new Date().getDate()) {
            if((given_year == new Date().getFullYear() && given_month > new Date().getMonth()+1 ) || (given_year == new Date().getFullYear() && given_month == new Date().getMonth()+1 && given_date > new Date().getDate() ) || (given_year > new Date().getFullYear())) {
        
            if(start_hour >= 9 && end_hour <= 15) {
    
                Appointment_ID++;
    
                const email = req.session.email;
                const user = await doc.findOne({email: email});

                const doctor = await doctorDb.findOne({ 
                    // Doctor_Name: "Dr.Aisha Patel"
                    Doctor_Name: req.session.doctor_name
                    // Doctor_Speciality: req.session.speciality
                });
    
                // console.log("this is first" + user);
    
                const Appoint = await new appointDb({
                    Appointment_ID: Appointment_ID,
                    Patient_Email: req.session.email,
                    Patient_Name: user.username,
                    Doctor_ID: doctor.Doctor_ID,
                    Doctor_Name: req.session.doctor_name,
                    Appointment_Date: req.body.appointment_date,
                    StartTime: req.body.startTime,
                    EndTime: req.body.endTime
                });
    
                Appoint.save()

                req.session.appoint_date = req.body.appointment_date;

    
                if(Appoint) {
                    console.log("Succesfully Added to appointment Schema");

                    const doctor = await doctorDb.findOne({ 
                        // Doctor_Name: "Dr.Aisha Patel"
                        Doctor_Name: req.session.doctor_name
                        // Doctor_Speciality: req.session.speciality
                    });

                    // if(doctor) {

                        console.log(doctor.Doctor_ID);
                    // }
                   
                    
                    const doctor_id = doctor.Doctor_ID;

                    if(Appointment_ID === 1001) {
                        await listPatients.deleteMany({});
                        // console.log("found")
                    }

                    const avail = await listPatients.findOne({
                        Doctor_ID: doctor_id
                    })

                    
                    // console.log(avail);
                    // avail.Appointment_ID.push(Appointment_ID);

                    if(avail) {

                        
                        const doctorlist = await listPatients.updateOne(
                            
                            { Doctor_ID: doctor_id },
                            { $push : { Appointment_ID: Appointment_ID}
                            
                        })
                        console.log("Updated a doctor list for patients")
                    }

                    else {
                        const list = await new listPatients({
                            Doctor_ID: doctor_id,
                            Appointment_ID: Appointment_ID
                        })

                        list.save();

                        console.log("Created a doctor list for patients")
                    }
                        
                    

                    
    
                    res.render('appointment2.ejs', {
                        booked: "Appointment Booked Succesfully",
                        name: req.session.doctor_name,
                        speciality: req.session.speciality
                        
                    })
                }
    
                else {
                    console.log("Error");
                }
    
                
                
                
            }

            // else if(flag === 0 && start_hour > end_hour || (start_hour === end_hour && start_min > end_min)) {
            //     res.render('appointment2.ejs', {
            //         msg: "Time cannot be negative",
            //         name: req.session.doctor_name,
            //         speciality: req.session.speciality
                    
            //     })
            // }
            
            else {

                // flag = 1;
                
               
                res.render('appointment2.ejs', {
                    msg: "Start time will be from 09:00 AM and End time will be upto 03:00 PM",
                    name: req.session.doctor_name,
                    speciality: req.session.speciality
                    
                })
            }
        }
    
        else {

            // flag = 1;

           

            res.render('appointment2.ejs', {
                msg: "Appointment date should not be past today",
                name: req.session.doctor_name,
                speciality: req.session.speciality
                
            })
        }
        
    }

    else {
        // console.log(req.session.email);
        res.redirect('/log');
    }
    
})


app.post('/check_avail', async (req, res) => {

    const avail = await appointDb.find({
        Doctor_Name: req.session.doctor_name, 
        Appointment_Date: req.body.appointment_date,
        
    })

    req.session.appoin = req.body.appointment_date;

    // console.log(req.body)


if(avail) {

    

    res.render('appointment2.ejs', {
        name: req.session.doctor_name,
        speciality: req.session.speciality,
        content: avail,
        date: req.session.appoin
        
    })
}

else {
    
    // res.render('appointment2.ejs', {
    //     name: req.session.doctor_name,
    //     speciality: req.session.speciality,
    //     content: "No appointments",
    //     date: req.session.appoin
        
    // })
    console.log("no")
}


})




// var c;
app.get('/doctor', async(req, res) => {

    res.render('doctorLogin.ejs', {

    })



})



app.post('/doc_signin', async (req, res) => {

    const { email, password } = req.body;

    // console.log(email, password);

    if(email && password) {

         const doctor = await doctorDb.findOne({Doctor_Email: email});

        //  console.log(doctor);

         req.session.doctorEmail = email;

         if(doctor && password === doctor.Doctor_Password) {

            res.render('doctorHome.ejs', {
                doctorName: doctor.Doctor_Name
            });

         }

         else {
            res.render('doctorLogin.ejs', {
                msg: "Wrong Credentials"
            })
         }
    }

    else {
        res.render('doctorLogin.ejs', {
            msg: "All fields are Mandatory"
        })
    }
})

app.get('/doc_signup', (req, res) => {
    res.render('doctorSignup.ejs')
})

app.post('/doc_signup', async(req, res) => {
    const { email, name, password, speciality} = req.body;
    // console.log(req.body)

    if(email) {

    const user = await doctorDb.findOne({Doctor_Email: email})



    if(user) {
        res.render('DoctorSignup.ejs', {
            msg: "Already a user is created with given email"
        })
    }

    else {

        const count = await doctorDb.countDocuments();
        const list = new doctorDb({
        Doctor_Name: name,
        Doctor_ID: count+2,
        Doctor_Email: email,
        Doctor_Password: password,
        Doctor_Speciality: speciality
    })

    list.save();

    res.render('admin_doc.ejs', {
        content: await doctorDb.find(),
        username: "Admin",
        msg1: "Doctor Profile Succesfully Created"
    })
    }

    
   }

   else {
       res.render('doctorSignup.ejs', {
           msg: "All fields are Mandatory"
       })
   }


})

app.get('/nextAppointments', async (req, res) => {

   
    // console.log(req.session.doctorEmail)

    if(req.session.doctorEmail) {

    

   

    const doctor = await doctorDb.findOne({
        Doctor_Email: req.session.doctorEmail
    });

    const doctorID = doctor.Doctor_ID;

    const list = await listPatients.findOne({
        Doctor_ID: doctorID
    })

    if(list) {
        // console.log("this is first " + list.Appointment_ID);

        const appoint = await appointDb.find({Appointment_ID: list.Appointment_ID});

        console.log(doctor.Doctor_Name);

        res.render('listAppointment.ejs', {
            // Appointment_id: appoint.Appointment_ID,
            // Patient_name: appoint.Patient_Name,
            // Appointment_date: appoint.Appointment_Date,
            // start_time: appoint.StartTime,
            // end_time: appoint.EndTime,

            appoint: appoint,
            doctorName: doctor.Doctor_Name

        })

    
    }

    else {

        console.log("No appointments");
        // res.send("No appointments")

        res.render('listAppointment.ejs', {
            Appointment_id: "No Appointments",
            Patient_name: "No Appointments",
            Appointment_date: "No Appointments",
            start_time: "No Appointments",
            end_time: "No Appointments",
            doctorName: doctor.Doctor_Name

        })
    }
}

else {
    res.redirect('/doctor');
}

    
})

app.get('/doctor_logout', async (req, res) => {
    // console.log(req.session.doctorEmail)
    res.redirect('/')

    // console.log(req.session.doctorEmail)
})

app.get('/pat_upcomingAppoint', async (req,res) => {

    // console.log(req.session.email)

    if(req.session.username) {
 
        const appoint = await appointDb.find({
            Patient_Email: req.session.email
        })
        
        console.log(appoint)
        
        res.render('pat_upcomingAppoint.ejs', {
            appoint: appoint,
            username: req.session.username
        })
    }

    else {
        res.redirect('/log');
    }
})


app.get('/user_logout', async (req, res) => {
    // console.log("yes")
    // req.session.username = "";
    // res.redirect('/log');

    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            // Handle error (maybe redirect to an error page)
            res.status(500).send("Error occurred during logout");
        } else {
            // Redirect to the login page after successful logout
            res.redirect('/');
        }
    });
})
    

app.get('/', (req, res) => {

    res.render('both.ejs');
})


app.get('/guest', (req, res) => {

    
    req.session.username = ''

    res.render('index.ejs', {
        username: "Guest",
    })
    
})

app.post('/check_appointmnet', async (req, res) => {
    const body = req.body;

  


    const list_of_check = await appointDb.find({Appointment_Date: body.appointment_date,
        Doctor_Name: req.session.doctor_name
    });
    // console.log(list_of_check)

    if(list_of_check.length != 0) {

        if(list_of_check.length < 4) {
        
        res.render('appointment2.ejs', {
            name: req.session.doctor_name,
            speciality: req.session.speciality,
            list_of_check1: list_of_check,
            appointment_date: body.appointment_date
        }
        )
    }

    else if(list_of_check.length < 5) {
        res.render('appointment2.ejs', {
            name: req.session.doctor_name,
            speciality: req.session.speciality,
            list_of_check2: list_of_check,
            appointment_date: body.appointment_date
        }
        )
    }

    else {
        res.render('appointment2.ejs', {
            name: req.session.doctor_name,
            speciality: req.session.speciality,
            list_of_check3: list_of_check,
            appointment_date: body.appointment_date
        }
        )
    }
        
    }

    else {

        if(body.appointment_date) {

            res.render('appointment2.ejs', {
                name: req.session.doctor_name,
                speciality: req.session.speciality,
                list_of_check: list_of_check,
                msg1: "No Appointments",
                appointment_date: body.appointment_date
            }
            )
        }

        else {

            res.render('appointment2.ejs', {
                name: req.session.doctor_name,
                speciality: req.session.speciality,
                list_of_check: list_of_check,
                msg1: "",
                alert: "Select date",
                appointment_date: body.appointment_date
            }
            )
            
        }

    }
        
        
        

})

app.get('/super', (req, res) => {
    res.render('super_user.ejs', {
        username: "Super User"
    });
})

app.get('/user_management', async (req, res) => {


    res.render('user_management.ejs', {
        pcount: await doc.countDocuments(),
        dcount: await doctorDb.countDocuments(),
        acount: await appointDb.countDocuments(),
        username: "Super User"
    })
})


app.get('/super_pat', async (req, res) => {
    res.render('zzz.ejs', {
        content: await doc.find(),
        username: "Super User"
    });
})

// app.get('/super_doc', async (req, res) => {
//     res.render('zzz1.ejs', {
//         content: await doctorDb.find()
//     });
// })

app.get('/super_app', async (req, res) => {
    res.render('zzz1.ejs', {
        content: await appointDb.find(),
        username: "Super User",

    });
})

app.post('/user_delete', async (req, res) => {
    const data = req.body;

    // console.log(data)
     const li = await doc.deleteOne({email: data.email})
    //  console.log(li);
    //  res.end()
    // res.redirect('/super_pat')
    res.render('zzz.ejs', {
        content: await doc.find(),
        username: "Super User",
        msg: "Patient Profile Succesfully Deleted"
    })

})

app.post('/app_delete', async (req, res) => {
    const data = req.body;


     const li = await appointDb.deleteOne({Appointment_ID: data.id})
     console.log(li);
    res.render('zzz1.ejs', {
        content: await appointDb.find(),
        username: "Super User",
        msg: "Appointment Succesfully Deleted"
    })
})

app.get('/admin', (req, res) => {
    res.render('admin.ejs', {
        username: "Admin"
    })
})

app.get('/admin_doc', async (req, res) => {

    res.render('admin_doc.ejs', {
        username: "Admin",
        content: await doctorDb.find()
    })
})

app.get('/admin_management', async (req, res) => {

    const total = await enquirymodel.countDocuments() + await usermodel.countDocuments();
    res.render('admin_user_manage.ejs', {
        pcount: await doc.countDocuments(),
        dcount: await doctorDb.countDocuments(),
        acount: await appointDb.countDocuments(),
        scount: total
    });
})

app.post('/doc_remove', async (req, res) => {
    const data = req.body;

    // console.log(data)
     const li = await doctorDb.deleteOne({Doctor_Email: data.email})
    //  console.log(li);
    //  res.end()
    // res.redirect('/super_pat')
    res.render('admin_doc.ejs', {
        content: await doctorDb.find(),
        username: "Admin",
        msg: "Doctor Profile Succesfully Deleted"
    })

})

app.get('/patSignup', (req,res) => {
    res.render('patSignup_admin.ejs')
})

app.post('/patSignup', async (req,res) => {
    // const data = req.body;

    let {name, password, email, isadmin} = req.body;
    console.log(req.body)

    const hash = bcrypt.hashSync(password, saltRounds);

    // if(isadmin === "on") {
    //     isadmin = true;
    // }

    // else {
    //     isadmin = false;
    // }

    if(email) {

    const user = await doc.findOne({email: email})



    if(user) {
        res.render('patSignup_admin.ejs', {
            msg: "Already a user is created with given email"
        })
    }

    else {


        const list = await new doc({
            username: name,
            password: hash,
            email: email,
            isSuperUser: 0,
            isAdmin: 0
    })

    list.save();

    res.render('zzz.ejs', {
        username: "Admin",
        msg1: "Patient Profile Succesfully Created",
        content: await doc.find(),
    })
    }

    
   }

   else {
       res.render('doctorSignup.ejs', {
           msg: "All fields are Mandatory"
       })
   }


})

app.get('/signup_superuser', (req, res) => {
    res.render("patSignup_superuser.ejs");
})

app.post('/signup_superuser', async(req, res) => {
    let {name, password, email, isadmin} = req.body;
    console.log(req.body)

    const hash = bcrypt.hashSync(password, saltRounds);
    

    if(isadmin === "on") {
        isadmin = true;
    }

    else {
        isadmin = false;
    }

    if(email) {

    const user = await doc.findOne({email: email})



    if(user) {
        res.render('patSignup_admin.ejs', {
            msg: "Already a user is created with given email"
        })
    }

    else {


        const list = await new doc({
            username: name,
            password: hash,
            email: email,
            isSuperUser: 0,
            isAdmin: isadmin
    })

    list.save();

    res.render('zzz3.ejs', {
        username: "Admin",
        msg1: "Patient Profile Succesfully Created",
        content: await doc.find(),
    })
    }

    
   }

   else {
       res.render('doctorSignup.ejs', {
           msg: "All fields are Mandatory"
       })
   }

})


// treatment enquires
// treatment enquires
// treatment enquires
// treatment enquires
// treatment enquires
// treatment enquires
// treatment enquires

const password = 'ovss zdzg ktkf rptu';

const enquirySchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    Country: { type: String },
    email: { type: String },
    state: { type: String },
    city: { type: String },
    specality: { type: String },
    visited: { type: String },
    message: { type: String }
});
const userSchema = new mongoose.Schema({
    name: { type: String },
    Country: { type: String },
    email: { type: String },
    state: { type: String },
    city: { type: String },
    message: { type: String }
});

const enquirymodel = mongoose.model("enquiries", enquirySchema);
const usermodel = mongoose.model("usermodel", enquirySchema);

app.get("/treatment", (req, res) => {
    res.render('treatment/index.ejs');
});

app.post("/treatment", (req, res) => {
    console.log(req.body);
    const a = new enquirymodel({
        name: req.body.name,
        phone: req.body.phone,
        Country: req.body.Country,
        email: req.body.email,
        state: req.body.state,
        city: req.body.city,
        specality: req.body.specality,
        visited: req.body.visited,
        message: req.body.message,
    });

    const htmlBody = `
        <h1>Details</h1>
        <p>Name: ${req.body.name}</p>
        <p>Phone: ${req.body.phone}</p>
        <p>Country: ${req.body.Country}</p>
        <p>Email: ${req.body.email}</p>
        <p>State: ${req.body.state}</p>
        <p>City: ${req.body.city}</p>
        <p>Specialty: ${req.body.specality}</p>
        <p>Visited: ${req.body.visited}</p>
        <p>Message: ${req.body.message}</p>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hexart637@gmail.com',
            pass: password
        }
    });

    const mailOptions = {
        from: 'hexart637@gmail.com',
        to: 'svasthyahospitals@gmail.com',
        subject: 'Treatment enquiry',
        html: htmlBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    a.save()
        .then(() => {
            res.redirect("/treatment");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error saving enquiry");
        });
});

app.post("/user", (req, res) => {
    console.log(req.body);
  
    const a = new usermodel({
        name: req.body.name,
        phone: req.body.phone,    
        Country: req.body.Country,
        email: req.body.email,
        city: req.body.city,
        message: req.body.message,
    });

    console.log(a);
  
    a.save()
        .then(() => {
            const htmlBody2 = `
                <h1>Details</h1>
                <p>Name: ${req.body.name}</p>
                <p>Phone: ${req.body.phone}</p>
                <p>Country: ${req.body.Country}</p>
                <p>Email: ${req.body.email}</p>
                <p>City: ${req.body.city}</p>
                <p>Message: ${req.body.message}</p>
            `;
  
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hexart637@gmail.com',
                    pass: password
                }
            });
  
            const mailOptions = {
                from: 'hexart637@gmail.com',
                to: 'svasthyahospitals@gmail.com',
                subject: 'Treatment enquiry',
                html: htmlBody2
            };
  
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
  
            res.redirect("/treatment");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error saving user data");
        });
});

// treatment-admin connection
// treatment-admin connection
// treatment-admin connection
// treatment-admin connection
// treatment-admin connection
// treatment-admin connection


app.get('/suggestions', async (req, res) => {
    res.render("treatment/suggestions.ejs",{
        content: await enquirymodel.find(),
        content1: await usermodel.find(),
        username: "Admin"
    }
    )

})


// video
// video
// video
// video
// video
// video
// video
// video


app.get('/video', (req, res) => {
    res.redirect(`/video/${uuidV4()}`)
  })
  
  app.get('/video/:room', (req, res) => {
    res.render('video/index.ejs', { roomId: req.params.room })
  })
  
  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId);
  
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
  
      })
    })
  })


//   know_yourself
//   know_yourself
//   know_yourself
//   know_yourself
//   know_yourself
//   know_yourself
//   know_yourself
//   know_yourself

const bmi = new mongoose.Schema({
    name: { type: String }, 
    email: { type: String },
    bmi: { type: String }
});

const bmiModel = new mongoose.model("bmi", bmi)

app.get("/know_yourself", (req, res)=>{
    res.render('know_yourself/index.ejs')
});

app.post("/know_yourself", (req , res) => {
    const a = new bmiModel ({
        name: req.body.name,
        email: req.body.email,
        bmi: req.body.message
    });

    const htmlBody = `
        <h1>Details</h1>
        <p>Name: ${req.body.name}</p>
        <p>Email: ${req.body.email}</p> 
        <p>bmi: ${req.body.message}</p>
    `;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hexart637@gmail.com',
            pass: password
        }
    });

    var mailOptions = {
        from: 'hexart637@gmail.com',
        to: 'svasthyahospitals@gmail.com',
        subject: 'Know Yourself',
        html: htmlBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
        
    a.save()
    .then(() => {
        res.redirect("/know_yourself/index.ejs");
    })
    .catch(err => {
        console.error(err);
        res.status(500).send("Error saving user data");
    });
});

// Define other routes here...


app.get('/mentalhealth', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/mental_health.ejs')
})

app.get('/physicalhealth', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/physical_health.ejs')
})

app.get('/personalhygiene', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/personal_hygiene.ejs')
})

app.get('/tests', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/tests.ejs')
})

app.get('/bmi.html', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/bmi.ejs')
})

app.get('/calorie.html', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/calorie.ejs')
})

app.get('/diabetes.html', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/diabetes.ejs')
})

app.get('/target.html', (req, res) => {
  // res.send("Hello")
  res.render('know_yourself/target.ejs')
})





app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    

});

