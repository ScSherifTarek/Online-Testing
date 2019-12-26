'user strict';
var db = require('../../db');
const tableName = "users";

//User object constructor
var User = function(user){
    if(user.name) {
        this.name = user.name;
    }
    if(user.email) {
        this.email = user.email;
    }
    if(user.password) {
        this.password = user.password;
    }
    if(user.phone){
        this.phone = phone;
    }
    if(user.cv){
        this.cv = cv;
    }
};

/*
* insert a new user into the database
*/
User.create = function(data, result){ 
    var cv_name = data.email + '_' + Date.now().toString() + '.pdf';
    db.query("INSERT INTO "+tableName+"(name, email, password, phone, cv) VALUES(?, ?, ?, ?, ?)",
    [data.name, data.email, data.password, data.phone, cv_name],
    function (err, res) {    
        if(err) {
            console.log("error: ", err);
            result(err, null, null);
        }
        else{
            console.log('a new account is created with id :' + res.insertId);
            console.log('cv_name --> ' + cv_name);
            result(null, res.insertId, cv_name);
        }
    });
    
}

/*
* check if user is exist in the database of not
*/
User.checkIfUserExist = function (email, password, next){
    db.query('SELECT * FROM ' +tableName+ ' WHERE email = ? AND password = ?', [email, password], function(err, results, fields) {
        if(err){
            next(err, null);
        }else{
            if (results.length > 0) {
                next(null, results[0]);
            } else {
                next(null, false);
            }	
        }

    });
}


User.checkIfEmailExist = function (email, result) {
    // return an err if this email exist in the system
    db.query("SELECT * FROM "+tableName+" WHERE email = ? ", 
        email, 
        function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                if(res.length) {
                    result(null, true);
                } else {
                    result(null, false);
                }
        
            }
        });
};


module.exports= User;