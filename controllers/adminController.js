const User = require("../models/userModel")
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const securePassword = async(password)=>{
  try {
      const passwordHash = await bcrypt.hash(password,10)
      return passwordHash
  } catch (error) {
    console.log(error.message);
  }
}


exports.loadLoggin = async(req,res)=>{
    try {
            
            res.render('loggin')

    } catch (error) {
        console.log(error.message);
    }
}

exports.verifyLoggin = async (req, res) => {
    try {
      
      const email = req.body.email;
      const password = req.body.password;
  
      const adminData = await User.findOne({ email: email });
  
      if (adminData) {
        
        const passwordMatch = await bcrypt.compare(password, adminData.password);
        if (passwordMatch && adminData.is_admin === 1) {
            
            req.session.admin_id = adminData._id;
           res.redirect("/admin/Dashboard");
        } else {
          res.render('loggin', { message: "Invalid Email and Password" });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  exports.loadDashboard = async(req,res)=>{

    try {
      //const userData = await User.find({is_admin:0})
      var search = ''
      if (req.query.search) {
        search = req.query.search
      } const userData=await User.find({is_admin:0,
        $or: [
          { name: { $regex: '.*' + search + '.*',$options:'i'} },
          { email: { $regex: '.*' + search + '.*',$options:'i'} }
        ]});
        res.render('Dashboard',{users:userData})

    } catch (error) {
      console.log(error);
        console.log(error.message);
    }
  }
  
exports.newUser =(req,res)=>{
  try{
    
    res.render('newuser')
  }
  catch(error)
  {
    console.log(error.message);
  }
}

exports.addUser =async (req, res) => {
  try {
    const nameRegex = /^[a-zA-Z ]+$/; 

      const spassword = await securePassword(req.body.password)
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
      res.render('newuser', { message: "Email ID already registered" });
    } else if (!nameRegex.test(newUser.name)) {
      res.render('newuser', { message: "Invalid name format. Please enter alphabets and spaces only." });
    } else {
      const userData = await newUser.save();
      if (userData) {
        res.redirect('/admin/Dashboard');
      } else {
        res.render('Dashboard', { message: "Registration Failed" });
      }
    }


    // const userData = await newUser.save();
   
    // console.log("success");
    // if (userData) {
    //   console.log(userData);
    //   res.redirect('/admin/Dashboard');
    // } else {
    //   res.render('Dashboard', { message: "Registration Failed" });
    // }
  } catch (error) {
    console.log(error.message);
  }
};

exports.signout = async(req,res)=>{
  try {
    req.session.destroy()
    res.redirect('/admin')
  } catch (error) {
    console.log(error.message);
  }
}

exports.editUser = async(req,res)=>{
  try {
    const id = req.query.id
    const userData = await User.findById({_id:id})
    if(userData){
      res.render('edituser',{user:userData})
    }
    else{
      res.redirect('/admin/Dashboard')
    }
  } catch (error) {
    console.log(error.message);
  }
}

exports.upadateUser =  async(req,res)=>{
  try {
    const userData =await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,car:req.body.car}})   
  res.redirect('/admin/Dashboard')
  } catch (error) {
    console.log(error.message);
  }
}
exports.deleteUser = async(req,res)=>{
  try {
    const id = req.query.id
    await User.deleteOne({_id:id})
  
    res.redirect('/admin/Dashboard')
   
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
}




