const User = require('../models/login.model.js');

exports.post= (req, res) =>  {
    console.log(req.body.username);
    console.log(req.body.password);
    var username = req.body.username;
    var password = req.body.password;
    if (username.length > 0 && password.length > 0) {
        User.findOne({username: username, password: password})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " 
                });            
            }
            res.send(user);
        })
        .catch(err => {
            res.send(err);
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
};
