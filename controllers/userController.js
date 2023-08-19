const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
  try {
   const passwordHash = await bcrypt.hash(password,10)
   return passwordHash
  } catch (error) {
    console.log(error.message)
    
  }
}

exports.loadRegister = (req, res) => {
  try {
    
    res.render('registration');
  } catch (error) {
    console.log(error.message);
  }
};

exports.insertUser = async (req, res) => {
  try {
    const nameRegex = /^[a-zA-Z ]+$/; // Regular expression to allow only alphabets and spaces

    const spassword = await securePassword(req.body.password);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      car: req.body.car,
      password: spassword,
      is_admin: 0,
    });

    const email = newUser.email;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.render('registration', { message: "Email ID already registered" });
    } else if (!nameRegex.test(newUser.name)) {
      res.render('registration', { message: "Invalid name format. Please enter alphabets and spaces only." });
    } else {
      const userData = await newUser.save();
      if (userData) {
        res.redirect('/');
      } else {
        res.render('registration', { message: "Registration Failed" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};


//login user mrthods
exports.loginLoad = async(req,res)=>{
  try { 
    res.render('login')
  } catch (error) {
    console.log(error.message);
  }
} 

// verifying login and Homepage entry
exports.verifyLogin = async(req,res)=>{
  try {
   
    const email = req.body.email
    const password = req.body.password

  const userData = await User.findOne({email: email})
 
    if(userData){

     const passwordMatch = await bcrypt.compare(password,userData.password)
    
     if(passwordMatch && userData.is_admin===0){
      req.session.user_id = userData._id
      res.redirect('/home')
      
     }
     else{
      res.render('login',{message:"Invalid email and password"})
     }
    }                    
    else{
        res.render('login',{message:"Invalid email and password"})
    }

  } catch (error) {
    console.log(error.message);
  }
}

//Home controller

exports.loadHome = async (req,res)=>{
  try {
    const userData = await  User.findById({_id:req.session.user_id})
   
    res.render('home',{user : userData})
  } catch (error) {
    console.log(error.message);    
  }
}

// Logout controller
exports.userLogout = async(req,res)=>{
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.log(error.message);
  }
}

