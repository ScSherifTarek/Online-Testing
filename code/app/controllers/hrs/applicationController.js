'use strict';

const App = require('../../models/application');
const ExamType = require('../../models/exam-type');
const Mail = require('../../helpers/mail');

exports.index = (req, res) => {
    if (req.session.loggedin && req.session.hr) {
        App.all(function (err, applications) {
            if (err) {
                res.status(500).send({
                    error: true,
                    message: err
                });
            } else {
                res.render('hrs/applications/index', {applications: applications});
            }
        });
    }else{
        res.redirect('/hrs/');
    }
};

// approve user
exports.approve = function(req, res){
    if (req.session.loggedin && req.session.hr) {
        var appid = req.params.application_id;
        App.updateById(appid, {status:2}, (err, result) => {
            res.redirect('/hrs/applications/'+ appid+ '/createExams');
        });
    }else{
        res.redirect('/hrs/');
    }
};



// disapprove user

exports.disapprove = function(req, res){
    if (req.session.loggedin && req.session.hr) {
        var appid = req.params.application_id;
        App.updateById(appid, {status:1} , (err, result) => {
            if(err){
                console.log(err);
                res.send(err);
            }else{
                App.getUserEmail(appid , (err, email)=>{
                    if(err){
                        console.log(err);
                        res.send(err);
                    }else{
                        var mail = {
                            to: email,
                            subject:'online testing feedback' ,
                            text: 'Dear Applicant,\n    sorry to tell you that you are not accepted to do the exams\n\
you can reapply for another position'
                        };
                        Mail.sendmail(mail);
                        res.redirect('/hrs/applications');
                    }
                });

            }
        });
    }else{
        res.redirect('/hrs/');
    }  
};

exports.showCreateExamsForm = (req, res) => {
    if(req.session.loggedin && req.session.hr){
        App.findOrFail(req.params.application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if (application.status == 2) {
                    App.applicationExams(application.id, (err, exams) => {
                        if (err) {
                            console.log(err);
                            res.json(err);
                        } else if (exams.length > 0) {
                            if(exams[0].order == null) {
                                res.redirect('/hrs/applications/' + application.id + '/wantToOrderExams');
                            } else {
                                res.redirect('/hrs/applications/' + application.id + '/examsDeadline');
                            }
                        }
                        else {
                            ExamType.all((err, examTypes) => {
                                if (err) {
                                    res.status(500).send({
                                        error: true,
                                        message: err
                                    });
                                }
                                else {
                                    res.render('hrs/applications/exams/createForm', {
                                        application: application,
                                        examTypes: examTypes
                                    });
                                }
                            });
                        }
                    });

                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};

exports.createExams = function(req, res) {
    if(req.session.loggedin && req.session.hr) {
        let exams_types = req.body.exams_types,
            application_id = req.params.application_id;

        App.findOrFail(application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if (application.status == 2) {
                    App.applicationExams(application.id, (err, exams) => {
                        if (err) {
                            console.log(err);
                            res.json(err);
                        } else if (exams.length > 0) {
                            if(exams[0].order == null) {
                                res.redirect('/hrs/applications/' + application.id + '/wantToOrderExams');
                            } else {
                                res.redirect('/hrs/applications/' + application.id + '/examsDeadline');
                            }
                        }
                        else {
                            exams_types.forEach((exam_type_id, index) => {
                                console.log(exam_type_id);
                                ExamType.findOrFail(exam_type_id, (err, exam) => {
                                    if (err) {
                                        console.log(err);
                                        res.json(err);
                                    } else {
                                        createApplicationExam(application.id, exam.id);
                                    }
                                });
                            });

                            setTimeout(() => res.redirect('/hrs/applications/' + application.id + '/wantToOrderExams'), 3000);
                        }
                    });

                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};

const createApplicationExam = (application_id, exam_type_id) => {
    App.createApplicationExams({exam_type_id: exam_type_id, application_id: application_id}, (err, application_exam_id) => {
        console.log(application_exam_id);
        if(err) {
            console.log(err);
        } else {
            App.selectExamQuestions(exam_type_id, (err, questions) => {
                if(err) {
                    console.log(err);
                } else if(questions.length < 1) {
                    console.log("No Questions", null);
                } else {
                    const questionsSize = questions.length;
                    questions.forEach((question, index) => {
                        selectRandomAnswersForQuestion(question.id, (err, answers) => {
                            if(err) {
                                console.log(err);
                            } else {
                                saveExamQuestionAndAnswers(application_exam_id, question.id, answers);
                            }
                        })
                    });
                }
            });
        }
    });
};

const selectRandomAnswersForQuestion = (question_id, callback) => {
    App.selectQuestionWrongAnswers(question_id, (err, wrongAnswers) => {
        if(err) {
            callback(err, null);
        } else if(wrongAnswers.length < 1 ) {
            callback("There's no wrong answers", null);
        } else {
            App.selectQuestionCorrectAnswer(question_id,(err, correctAnswer) => {
                if(err) {
                    callback(err, null);
                } else if(!correctAnswer) {
                    callback("There's no correct answers", null);
                } else {
                    callback(null, {wrongAnswers: wrongAnswers, correctAnswer: correctAnswer});
                }
            });
        }
    });
};

const saveExamQuestionAndAnswers = (application_exam_id, question_id, answers) => {

    App.saveExamQuestion({application_exam_id: application_exam_id, question_id: question_id, correct_answer_id: answers.correctAnswer? answers.correctAnswer.id: null}, (err, exam_question_id) => {
        if(err) {
            console.log(err);
        } else {
            let answersArray = answers.wrongAnswers;
            answersArray.push(answers.correctAnswer);

            // Save Answers
            answersArray.forEach((answer, index) => {
                App.saveExamQuestionAnswer({application_exam_question_id: exam_question_id, answer_id: answer.id}, (err, answer_id) => {
                    if(err) {
                        console.log(err);
                    }
                });
            });
        }
    });
};

exports.wantToOrderExams = (req, res) => {
    if(req.session.loggedin && req.session.hr) {
        App.findOrFail(req.params.application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if(application.status == 2) {
                    App.applicationExams(application.id, (err, exams) => {
                        if (err) {
                            res.json(err);
                        } else if (exams.length < 1 ) {
                            res.redirect('/hrs/applications/' + application.id + '/createExams');
                        } else {
                            if (exams[0].order == null) {
                                res.render('hrs/applications/exams/wantToOrderExams', {application: application});
                            } else {
                                res.redirect('/hrs/applications/' + application.id + '/examsDeadline');
                            }
                        }
                    });
                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};

exports.orderExamsForm = (req, res) => {
    if(req.session.loggedin && req.session.hr) {
        App.findOrFail(req.params.application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if(application.status == 2) {
                    App.applicationExams(application.id, (err, exams) => {
                        if (err) {
                            res.json(err);
                        } else if (exams.length < 1 ) {
                            res.redirect('/hrs/applications/' + application.id + '/createExams');
                        } else {
                            if (exams[0].order == null) {
                                console.log(exams);
                                res.render('hrs/applications/exams/orderExams', {application: application, exams: exams});
                            } else {
                                res.redirect('/hrs/applications/' + application.id + '/examsDeadline');
                            }
                        }
                    });
                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};

exports.orderExams = (req, res) => {
    if(req.session.loggedin && req.session.hr) {
        App.findOrFail(req.params.application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if(application.status == 2) {
                    App.updateById(application.id, {isExamsOrdered: 1}, (err, data) => {
                        if(err) {
                            res.json(err);
                        }
                        else {
                            App.saveExamsOrders(req.body, (err, data) => {
                                if (err) {
                                    res.json(err);
                                } else {
                                    res.redirect('/hrs/applications/' + application.id + '/examsDeadline');
                                }
                            });
                        }
                    });
                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};

exports.examsDeadlineForm = (req, res) => {
    if(req.session.loggedin && req.session.hr) {
        App.findOrFail(req.params.application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if(application.status == 2) {
                    res.render('hrs/applications/exams/examDeadline', {application: application});
                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};

exports.examsDeadline = (req, res) => {
    if(req.session.loggedin && req.session.hr) {
        App.findOrFail(req.params.application_id, (err, application) => {
            if (err) {
                res.json(err);
            } else {
                if(application.status == 2) {
                    let deadline = new Date(req.body.deadline);
                    deadline = deadline.toISOString().split('T')[0] + ' '
                    + deadline.toTimeString().split(' ')[0];
                    App.updateById(application.id, {exams_deadline: deadline, status: 3} , (err, result) => {
                        if(err) {
                            res.json(err);
                        } else {
                            App.getUserEmail(application.id , (err, email)=>{
                                if(err){
                                    console.log(err);
                                    res.send(err);
                                }else{
                                    var mail = {
                                        to: email,
                                        subject:'Application next step' ,
                                        text: 'Dear Applicant,\n    Please use the following link to solve exams required for the position you applied for '+
                                            '/users/applications/'+application.id+'/exams'
                                    };
                                    Mail.sendmail(mail);
                                    res.redirect('/hrs/applications');
                                }
                            });
                        }
                    })
                } else {
                    res.redirect('/hrs/applications');
                }
            }
        });
    } else {
        res.redirect('/hrs/');
    }
};