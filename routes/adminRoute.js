const express = require('express');
const admin_route = express()

const session = require("express-session")
const config = require("../cofig/config")

admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false
}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin');

const auth = require('../middleware/adminAuth');

const adminController = require("../controllers/adminController");
const nocache = require('nocache');


//for viewing and entering credentials
admin_route.get('/',auth.issignout,adminController.loadLoggin)

//for checking credentials and entering into homepage
admin_route.post('/logg',adminController.verifyLoggin)

//for 
admin_route.get('/Dashboard',nocache(),auth.isloggin,adminController.loadDashboard)

// admin_route.get('*',function(req,res){
//     res.redirect('/admin')
// })

//for admin to log out
admin_route.post('/signout',adminController.signout)

//route for adding new user
admin_route.get('/newuser',auth.isloggin,adminController.newUser)
admin_route.post('/newuser',adminController.addUser)

//edit user route 
admin_route.get('/edituser',auth.isloggin,adminController.editUser)
admin_route.post('/edituser',adminController.upadateUser)

//delete user route 
admin_route.get('/deleteuser',adminController.deleteUser)


module.exports = admin_route