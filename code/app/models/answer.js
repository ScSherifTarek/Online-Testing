'user strict';
const db = require('../../db');
const tableName = "answers";
const questionsTableName = "questions";

//Task object constructor
const Answer = function (answer) {
    if (answer.question_id) {
        this.question_id = answer.question_id;
    }
    if (answer.body) {
        this.body = answer.body;
    }

    if (answer.is_correct) {
        this.is_correct = answer.is_correct;
    }
};

Answer.fill = (answer) => {
    if (answer.question_id) {
        this.question_id = answer.question_id;
    }
    if (answer.body) {
        this.body = answer.body;
    }

    if (answer.is_correct) {
        this.is_correct = answer.is_correct;
    }
    return Answer;
};

Answer.create = function(data, result){
        db.query("INSERT INTO "+tableName+" (question_id, body, is_correct) VALUES (?, ?, ?)", [data.question_id, data.body, data.is_correct], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

Answer.find = function (id, result) {
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

Answer.findOrFail = function (id, result) {
    db.query("Select * from "+tableName+" where id = ? ", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length) {
                result(null, res.find(e => true));
            } else {
                result("Answer not found", null);
            }
      
        }
    });
};

Answer.all = function (result) {
    db.query("Select "+tableName+".*, "+questionsTableName+".body as question_body from "+tableName+" join "+questionsTableName+" on "+ questionsTableName+".id = "+tableName+".question_id", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

Answer.updateById = function(id, answer, result){
    db.query("UPDATE "+tableName+" SET question_id = ?, body = ?, is_correct = ? WHERE id = ?", [answer.question_id, answer.body, answer.is_correct, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {   
            result(null, res);
        }
    }); 
};

Answer.delete = function(id, result) {
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

module.exports= Answer;