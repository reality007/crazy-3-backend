const express = require('express');

const mongoose =  require('mongoose');
const router = require('./routes/user-routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app =  express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api',router)
mongoose.connect("mongodb+srv://deathnote0715:x4H6VHzWZ7PikSGJ@cluster0.utmmzr6.mongodb.net/mess_DB?retryWrites=true&w=majority").then(()=>{
    app.listen(2000);
    console.log("Database connection established")
}).catch((err)=>
    console.log(err));



//x4H6VHzWZ7PikSGJ