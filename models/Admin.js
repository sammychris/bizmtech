const db = require('./db');


//Task object constructor
var Admin = function(user){
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
};

Admin.createUser = function (newUser, result) {    
    db.query("INSERT INTO user set ?", newUser, function (err, res) {    
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

module.exports = Admin;
