'user strict';
const db = require('../../db');
const tableName = "questions";
const examTypesTableName = "exam_types";

//Task object constructor
const Question = function (question) {
    if (question.exam_type_id) {
        this.exam_type_id = question.exam_type_id;
    }
    if (question.body) {
        this.body = question.body;
    }
};

Question.fill = (question) => {
    if (question.exam_type_id) {
        this.exam_type_id = question.exam_type_id;
    }
    if (question.body) {
        this.body = question.body;
    }
    return Question;
};

Question.create = function(data, result){
        db.query("INSERT INTO "+tableName+" (exam_type_id, body) VALUES (?, ?)", [data.exam_type_id, data.body], function (err, res) {
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

Question.find = function (id, result) {
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

Question.findOrFail = function (id, result) {
    db.query("Select * from "+tableName+" where id = ? ", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length) {
                result(null, res.find(e => true));
            } else {
                result("Question not found", null);
            }
      
        }
    });
};

Question.all = function (result) {
    db.query("Select "+tableName+".*, "+examTypesTableName+".type as exam_type from "+tableName+" join "+examTypesTableName+" on "+ examTypesTableName+".id = "+tableName+".exam_type_id", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

Question.updateById = function(id, examType, result){
    db.query("UPDATE "+tableName+" SET exam_type_id = ?, body = ? WHERE id = ?", [examType.exam_type_id, examType.body, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {   
            result(null, res);
        }
    }); 
};

Question.delete = function(id, result) {
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

module.exports= Question;