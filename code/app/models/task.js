'user strict';
var db = require('../../db');
const tableName = "tasks";

//Task object constructor
var Task = function(task){
    if(task.task) {
        this.task = task.task;
    }
    if(task.status) {
        this.status = task.status;
    }
    if(task.created_at) {
        this.created_at = task.created_at;
    }
};

Task.fill = (data) => {
    if(data.task) {
        this.task = data.task;
    }
    if(data.status) {
        this.status = data.status;
    }
    return Task;
}

Task.create = function(data, result){
    db.query("INSERT INTO "+tableName+"(task, status) VALUES(?, ?)", [data.task, data.status], function (err, res) {    
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

Task.find = function (taskId, result) {
    db.query("Select * from "+tableName+" where id = ? ", taskId, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res.find(e => true));
      
        }
    });
};

Task.findOrFail = function (taskId, result) {
    db.query("Select * from "+tableName+" where id = ? ", taskId, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length) {
                result(null, res.find(e => true));
            } else {
                result("Task not found", null);
            }
      
        }
    });
};

Task.all = function (result) {
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

Task.updateById = function(id, task, result){
    db.query("UPDATE "+tableName+" SET task = ? WHERE id = ?", [task.task, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {   
            result(null, res);
        }
    }); 
};

Task.delete = function(id, result) {
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

module.exports= Task;