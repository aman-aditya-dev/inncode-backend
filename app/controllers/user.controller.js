
const User = require('../models/user.model.js');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database.config');
require('../../config/passport')(passport);

exports.create = (req, res) => {
  console.log("res", res);
    console.log("Hi");
    if(!req.body.username) {
       return res.status(400).send({
           message: "Username Required"
       });
   }
   else if(!req.body.password) {
       return res.status(400).send({
           message: "Password required"
       })
   }
   else if(!req.body.name) {    
       return res.status(400).send({
            message: "Name Required"
       })
   }
   else if(!req.body.email) {
    return res.status(400).send({
         message: "Email Required"
    })
    }
    // else if(!req.body.contact) {
    //     return res.status(400).send({
    //          message: "Contact Number Required"
    //     })
    //     }



   // Create a User
   const user = new User({
       name:req.body.name,
       username: req.body.username, 
       password: req.body.password,
       email: req.body.email,
       role: 'user'
   });

   // Save User in the database
   user.save()
   .then(data => {
       res.send(data);
   }).catch(err => {
       res.status(500).send({
           message: err.message || "Some error occurred while signing Up."
       });
   });

};

exports.login= (req, res) =>  {
  console.log("res", res);
    console.log("Hi");
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // res.setHeader('Access-Control-Allow-Credentials', true);

    
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    if(pattern.test(username)){
        User.findOne({ email: username }, (err, user) => {
            if (err) throw err;
            if (!user) {
              return res.status(400).json({ success: false, msg: 'User not found.' });
            }
        
            bcrypt.compare(password, user.password, function(err, isMatch) {
              if (err) throw err;
              
              if (isMatch) {
        
                const token = jwt.sign(user.toJSON(), config.secret, {
                  expiresIn: 1800 // 30 minutes
                });
                
                // Don't include the password in the returned user object
                return res.json({
                  success: true,
                 token: token,
                  user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username
                  }
                });
              }
              else {
                return res.status(400).json({ success: false, msg: 'Wrong password.' });
              }
            });
          });
    }
    else{
        User.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if (!user) {
              return res.status(400).json({ success: false, msg: 'User not found.' });
            }
        
            bcrypt.compare(password, user.password, function(err, isMatch) {
              if (err) throw err;
              
              if (isMatch) {
        
                const token = jwt.sign(user.toJSON(), config.secret, {
                  expiresIn: 604800 // 1 week
                });
        
                // Don't include the password in the returned user object
                return res.json({
                  success: true,
                   token:  token,
                  user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username
                  }
                });
              }
              else {
                return res.status(400).json({ success: false, msg: 'Wrong password.' });
              }
            });
          });
    }
   
};

exports.findOne = (req, res) => {
  console.log(res);
    User.findById(req.params._id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params._id
            });            
        }
        return res.json({
            success: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              username: user.username
            }
          });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params._id
        });
    });
};

exports.updateProfile=(req, res)=>{
    User.findByIdAndUpdate(req.params._id, {
        name: req.body.name,
        email: req.body.email
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });
        }   
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params._id
        });
    });
}
