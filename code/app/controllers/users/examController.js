'use strict';

const App = require('../../models/application');

/**
 * Show all exams for this user
 */
exports.showExams = function(req, res) {
    if (req.session.loggedin && req.session.user) {
        var appId = req.params.application_id;
        var userId = req.session.user;
        App.findLiveApplication(appId, userId, (err, application)=>{
            if(err){
                res.send(err);
            }else{
                // show all exams 
                console.log(JSON.stringify(application));
                App.applicationExams(application.id,(err, results)=>{
                    if(err){
                        res.send(err);
                    }else if(results.length < 1){
                        res.send('there is no exams');
                    }else{
                        res.render('users/userExams', {exams: results , application: application});
                    }
                });
            }
        });

    } else {
        res.redirect('/users');
    }
};



exports.displyExam = function(req, res) {
    if (req.session.loggedin && req.session.user) {
        let userId = req.session.user;
        let appId = req.params.application_id;
        App.findOrFailByUserId(userId, appId,(err, application)=>{
            if(err){
                res.send(err);
            }else{
                let data = {
                    session_id: req.session.id,
                    application: application,
                    exam_id: req.params.exam_id,
                };

                App.getExamIfAccessableForSession(data , (err, exam)=>{
                    if(err){
                        res.send(err);
                    }else if(exam){
                        res.json(exam);
                    } else {
                        res.redirect('/users/applications/' + application.id + '/exams');
                    }
                });
            }
        })
    }else{
        res.redirect('/users');
    };
};
