'user strict';
var db = require('../../db');
const tableName = "hrs";

//Hr object constructor
var Hr = function(hr){
    if(hr.name) {
        this.name = hr.name;
    }
    if(hr.email) {
        this.email = hr.email;
    }
    if(hr.password) {
        this.password = hr.password;
    }
};

/*
* insert a new hr into the database
*/
Hr.create = function(data, result){ 
    db.query("INSERT INTO "+tableName+"(name, email, password) VALUES(?, ?, ?)",
    [data.name, data.email, data.password],
    function (err, res) {    
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log('a new account is created with id :' + res.insertId);
            result(null, res.insertId);
        }
    });
    
}

/*
* check if hr is exist in the database of not
*/
Hr.checkIfHrExist = function (email, password, next){
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


module.exports= Hr;