const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/UMS")
const express = require('express');
const path = require('path');
const nocache = require('nocache');

const app = express()
app.use(nocache())

app.use(express.json())
app.use(express.urlencoded({extended:true}))


//for user routes
const userRoute = require("./routes/userRoute")
app.use('/',userRoute)

//for admin routes
const adminRoute = require("./routes/adminRoute")
app.use('/admin',adminRoute)

app.listen(3000,function(){
    console.log("server is running at http://localhost:3000");
})
