'user strict';
const db = require('../../db');
const tableName = "applications";
const positionsTableName = "positions";
const usersTableName = "users";
const applicationExamsTableName = 'application_exams';
const questionTableName = 'questions';
const answersTableName = 'answers';

//Task object constructor
const Application = function (application) {
    if (application.position_id) {
        this.position_id = application.position_id;
    }
    if (application.user_id) {
        this.user_id = application.user_id;
    }
};

Application.fill = (answer) => {
    if (application.position_id) {
        this.position_id = application.position_id;
    }
    if (application.user_id) {
        this.user_id = application.user_id;
    }

    return Application;
};

Application.create = function(data, result){
        db.query("INSERT INTO "+tableName+" (position_id, user_id) VALUES (?, ?)", [data.position_id, data.user_id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

Application.find = function (id, result) {
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

Application.findOrFail = function (id, result) {
    db.query("Select * from "+tableName+" where id = ? ", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length > 0) {
                result(null, res.find(e => true));
            } else {
                result("Application not found", null);
            }
      
        }
    });
};

Application.applicationExams = (application_id, callback) => {
    db.query("SELECT application_exams.*, exam_types.type as type  FROM application_exams join exam_types on application_exams.exam_type_id = exam_types.id where application_id = ? order by application_exams.order;", application_id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            callback(err, null);
        }
        else{
            callback(null, res);
        }
    });
};

Application.all = function (result) {
    db.query("SELECT applications.*, users.email as user_email, users.name as user_name, users.cv as user_cv, positions.title as position_title  FROM `applications` join users on applications.user_id = users.id join positions on applications.position_id = positions.id", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });   
};

Application.updateById = function(id, application, result){
    let data = {};
    if(application.position_id) {
        data.position_id = application.position_id;
    }

    if(application.user_id) {
        data.user_id = application.user_id;
    }

    if(application.status) {
        data.status = application.status;
    }

    if(application.exams_deadline) {
        data.exams_deadline = application.exams_deadline;
    }

    if(application.isExamsOrdered) {
        data.isExamsOrdered = application.isExamsOrdered;
    }

    let siz = Object.keys(data).length;
    let queryUpdates = " ";
    let queryVariables = [];
    Object.keys(data).forEach((key, index) => {
        queryVariables.push(data[key]);
        queryUpdates += key + " = ?";
        if(index < siz-1) {
            queryUpdates += ", ";
        }
    });
    queryVariables.push(id);
    db.query("UPDATE "+tableName+" SET "+queryUpdates+" WHERE id = ?", queryVariables, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {   
            result(null, res);
        }
    }); 
};

Application.delete = function(id, result) {
    db.query("DELETE FROM "+tableName+" WHERE id = ?", [id], function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(err, null);
    }
    else{

     result(null, res);
    }
    }); 
};


Application.createApplicationExams = function(data, result){
    db.query("INSERT INTO "+applicationExamsTableName+" (application_id, exam_type_id) VALUES (?, ?)", [data.application_id, data.exam_type_id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

Application.selectExamQuestions = function(exam_type_id,callback){
    db.query('SELECT * FROM '+ questionTableName +'\
                WHERE exam_type_id = '+ exam_type_id +' \
                ORDER BY RAND()\
                LIMIT 5;',
                [], 
                function(err, result){
                    if(err) {
                        console.log("error: ", err);
                        callback(err, null);
                    }
                    else{
                        callback(null, result);
                    }

    });
};


Application.selectQuestionWrongAnswers = function(question_id,callback){
    db.query('SELECT * FROM '+ answersTableName +'\
                WHERE question_id = '+ question_id +' \
                AND is_correct = 0\
                ORDER BY RAND()\
                LIMIT 3;',
                function(err, result){
                    if(err) {
                        console.log("error: ", err);
                        callback(err, null);
                    }
                    else{
                        callback(null, result);
                    }

    });
};


Application.selectQuestionCorrectAnswer = function(question_id,callback){
    db.query(
    'SELECT * FROM '+ answersTableName +'\
            WHERE question_id = '+ question_id +' \
            AND is_correct = 1\
            ORDER BY RAND()\
            LIMIT 1;',
            function(err, result){
                if(err) {
                    console.log("error: ", err);
                    callback(err, null);
                }
                else{
                    callback(null, result.find(e => true));
                }
            });
};

Application.saveExamQuestion =  (data, callback) => {
    db.query("INSERT INTO application_exam_questions (application_exam_id, question_id, correct_answer_id) VALUES (?, ?, ?)", [data.application_exam_id, data.question_id, data.correct_answer_id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            callback(err, null);
        } else {
            callback(null, res.insertId);
        }
    });
};

Application.saveExamQuestionAnswer = (data, callback) => {
    db.query("INSERT INTO application_exam_question_answers (application_exam_question_id, answer_id) VALUES (?, ?)", [data.application_exam_question_id, data.answer_id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            callback(err, null);
        } else {
            callback(null, res.insertId);
        }
    });
};

Application.getUserEmail = function(application_id , next){
    let q = 'SELECT email\
            FROM users\
            JOIN applications\
            ON users.id = applications.user_id\
            WHERE applications.id = ? LIMIT 1;';

    db.query(q,[application_id],(err, result)=>{
        if(err) {
            console.log("error: ", err);
            next(err, null);
        }
        else if(result.length < 1){
            console.log('there is no such email');
            next('there is no such email', null);
        }else{
            next(null, result[0].email)
        }
    });
};

Application.findLiveApplication = function (id, userId, result) {
    db.query("SELECT * FROM "+ tableName+ "\
             WHERE id = ?\
             AND status=3\
             AND exams_deadline > now()\
             AND user_id = ?; ",
    [id, userId], 
    function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length < 1){
                result('there is no such valid exams', null);
            }else{
                result(null, res.find(e => true));
            }
        }
    });
};

function objectHasNoKeys(obj) {
    for(let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
}

Application.saveExamsOrders = (data, callback) => {
    if(objectHasNoKeys(data)) {
        callback("No data", null);
    } else {
        let query = "UPDATE application_exams SET application_exams.order = CASE id ";
        let where = " WHERE ID IN (";
        let isFirst = true;
        for (let id in data){
            if(data.hasOwnProperty(id)){
                query += " WHEN " + id + " THEN " + data[id] +" ";
                if(!isFirst) {
                    where += ", ";
                }
                where += id;
                isFirst = false;
            }
        }
        query += " ELSE 0 END "+ where + " );";

        db.query(query,(err, result)=>{
            if(err) {
                console.log("error: ", err);
                callback(err, null);
            }
            else {
                callback(null, result);
            }
        });
    }
};

Application.getExamIfAccessableForSession = (data, callback) => {
    exam_id = data.exam_id;
    application_id = data.application.id;
    session_id = data.session_id;
    let q = "SELECT * from application_exams where id = ? AND ";
    if(data.application.isExamsOrdered) {
        q += "id = (SELECT id FROM `application_exams` where application_id = ? AND (session_id = ? OR score = 0) ORDER BY application_exams.order limit 1);";
        db.query(q, [exam_id, application_id, session_id], (err, result) => {
            if(err) {
                console.log("error: ", err);
                callback(err, null);
            }
            else {
                Application.saveExamSession({session_id: data.session_id, exam_id: data.exam_id}, (err, data) => {
                    if(err) {
                        console.log("error: ", err);
                    } else {
                        callback(null, result.find(e => true));
                    }
                });
            }
        });
    } else {
        q += "(session_id = ? OR score = 0);";
        db.query(q, [exam_id, session_id],(err, result) => {
            if(err) {
                console.log("error: ", err);
                callback(err, null);
            }
            else {
                Application.saveExamSession({session_id: data.session_id, exam_id: data.exam_id}, (err, data) => {
                    if(err) {
                        console.log("error: ", err);
                    } else {
                        callback(null, result.find(e => true));
                    }
                });
            }
        });
    }
};

Application.saveExamSession = (data, callback) => {
    let query = "UPDATE `application_exams` SET `session_id`=? WHERE id = ?;";
    db.query(query, [data.session_id, data.exam_id], callback )
};


Application.findOrFailByUserId = function (userid, id, result) {
    db.query("Select * from "+tableName+" where id = ? AND user_id = ?", [id , userid], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(res.length > 0) {
                result(null, res.find(e => true));
            } else {
                result("Application not found", null);
            }
      
        }
    });
};

module.exports= Application;