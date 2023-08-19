const express = require('express');
const user_route = express()
const session = require('express-session');
const userController = require("../controllers/userController") // requiring data from userController
const config = require('../cofig/config');

user_route.use(session
    ({secret:config.sessionSecret,
        resave: false,
        saveUninitialized:false
}))

const auth = require('../middleware/auth');


user_route.use(express.static('public'))

user_route.set('view engine','ejs')
user_route.set('views','./views/user');



//Route for user to register
user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.insertUser)

//login routes
user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.post('/loggedin',auth.isLogout,userController.loginLoad)



//home routes 
user_route.post('/login',userController.verifyLogin)
user_route.get('/home',auth.isLogin,userController.loadHome)

//logout routes
user_route.post('/logout',auth.isLogin,userController.userLogout)



module.exports = user_route