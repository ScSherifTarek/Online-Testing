'user strict';
const db = require('../../db');
const tableName = "exam_types";

//Task object constructor
const ExamType = function (ExamType) {
    if (ExamType.type) {
        this.type = ExamType.type;
    }
};

ExamType.fill = (data) => {
    if(data.type) {
        this.type = data.type;
    }
    return ExamType;
};

ExamType.create = function(data, result){
        db.query("INSERT INTO "+tableName+" (type) VALUES (?)", [data.type], function (err, res) {
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

ExamType.find = function (id, result) {
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

ExamType.findOrFail = function (id, result) {
    db.query("Select * from "+tableName+" where id = ? ", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length) {
                result(null, res.find(e => true));
            } else {
                result("Exam type not found", null);
            }
      
        }
    });
};

ExamType.all = function (result) {
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

ExamType.updateById = function(id, examType, result){
    db.query("UPDATE "+tableName+" SET type = ? WHERE id = ?", [examType.type, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {   
            result(null, res);
        }
    }); 
};

ExamType.delete = function(id, result) {
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

module.exports= ExamType;