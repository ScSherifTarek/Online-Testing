'user strict';
var db = require('../../db');
const tableName = "positions";
const applicationsTableName = "applications";

//Position object constructor
var Position = function(position){
    if(position.title) {
        this.title = position.title;
    }
    if(position.details) {
        this.details = position.details;
    }
};

Position.fill = (data) => {
    if(position.title) {
        this.title = position.title;
    }
    if(position.details) {
        this.details = position.details;
    }
    return Position;
}

Position.create = function(data, result){
    db.query("INSERT INTO "+tableName+"(title, details) VALUES(?, ?)", [data.title, data.details], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
}

Position.find = function (id, result) {
    db.query("Select * from "+tableName+" where id = ? ", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res.find(e => true));
        }
    });
};

Position.findOrFail = function (id, result) {
    db.query("Select * from "+tableName+" where id = ? ", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length) {
                result(null, res.find(e => true));
            } else {
                result("position not found", null);
            }

        }
    });
};

Position.all = function (result) {
    db.query("Select *  from "+tableName, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Position.allDoesntHaveApplicationForUser = function (user_id, result) {
    db.query("SELECT * FROM `positions` where id NOT IN (select distinct position_id from applications where user_id = ?);", [user_id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};


Position.updateById = function(id, position, result){
    db.query("UPDATE "+tableName+" SET title = ?, details = ? WHERE id = ?", [position.title, position.details , id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

Position.delete = function(id, result) {
    db.query("DELETE FROM "+tableName+" WHERE id = ?", [id], function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{

            result(null, res);
        }
    });
};

module.exports= Position;