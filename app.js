const express = require('express');
const res = require('express/lib/response');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

//CONNECT TO DB
mongoose.connect(process.env.DATABASE_CONNECTION_URL, { useNewUrlParser: true }, () => console.log('Connected to DB'));

//IMPORT ROUTES
const studentsRoute = require('./routes/students');
const adminRoute = require('./routes/admin');
const mentorRoute = require('./routes/mentors');
const allUsersRoute = require('./routes/allusers');

//MIDDLEWARES
app.use(bodyparser.json());

//ROUTE MIDDLEWARES
app.use('/api/user', studentsRoute);
app.use('/api/user', adminRoute);
app.use('/api/user', mentorRoute);
app.use('/api/user', allUsersRoute);


//boot up server
app.listen(3001, () => console.log('Server up and running'));