'use strict';

const ExamType = require('../../models/exam-type.js');
const Question = require('../../models/question.js');

/**
 * Show all exam types
 */
exports.index = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    Question.all(function(err, questions) {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      else {
        res.render('hrs/questions/index', {
          questions: questions
        });
      }
    });
  }else{
      res.redirect('/hrs/');
  }
  
};

/**
 * Show exam type create form
 */
exports.create = function(req, res){
  if(req.session.loggedin && req.session.hr){
    ExamType.all((err, examTypes) => {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      else {
        res.render('hrs/questions/createForm', {
          examTypes: examTypes,
          old: req.flash('old'),
          errors: req.flash('errors')
        });
      }
    });
  }else{
    res.redirect('/hrs/');
  }
  
};

/**
 * Store new exam type
 */
exports.store = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    // Validation
  validateRequest(req, res, (req, res) => {
    Question.create(req.body, function(err, id) {
      if (err) {
        res.status(500).json({
          error: true,
          message: err
        });
      } else {
        res.redirect('/hrs/questions');
      }
    });
  });
  }else{
    res.redirect('/hrs/');
  }
  
};

exports.show = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    returnQuestionWithId(req.params.resourceId, res);
  }else{
    res.redirect('/hrs/');
  }

};

exports.edit = function(req, res){
  if(req.session.loggedin && req.session.hr){
    Question.findOrFail(req.params.resourceId, function(err, question) {
      if (err) {
        res.status(400).json({
          error: true,
          message: err
        });
      } else {
        ExamType.all((err, examTypes) => {
          if (err) {
            res.status(500).send({
              error: true,
              message: err
            });
          }
          else {
            res.render('hrs/questions/updateForm', {
              examTypes: examTypes,
              question: question,
              old: req.flash('old'),
              errors: req.flash('errors')
            });
          }
        });
      }
    });
  }else{
    res.redirect('/hrs/');
  }
  
};

exports.update = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    validateRequest(req, res, (req, res) => {
      Question.findOrFail(req.params.resourceId, function (err, question) {
        if (err) {
          res.status(400).json({
            error: true,
            message: err
          });
        } else {
          Question.updateById(req.params.resourceId, new Question(req.body), function (err, question) {
            if (err) {
              res.send(err);
            } else {
              res.redirect('/hrs/questions');
            }
          });
        }
      });
    });
  }else{
    res.redirect('/hrs/');
  }
  
};


exports.destroy = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    Question.delete(req.params.resourceId, function(err, question) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/hrs/questions')
      }
    });
  }else{
    res.redirect('/hrs/');
  }
  
};

function returnQuestionWithId(id, res) {
  Question.findOrFail(id, function(err, q) {
    if (err) {
      res.status(400).json({
        error: true,
        message: err
      }).end();
    } else {
      res.json(q);
    }
  });
}

const validateRequest = function(req, res, callback) {
  let errors = [];

  if(!req.body.body) {
    errors.push("Question body is required");
  }

  if(!req.body.exam_type_id) {
    errors.push("Exam type is required");
  } else {
    ExamType.findOrFail(req.body.exam_type_id, (err, examType) => {
      if(err) {
        errors.push("Exam type you entered is not in our database");
      }
      if(errors.length){
        req.flash('old', [
          req.body.body,
          req.body.exam_type_id
        ]);
        req.flash('errors', errors);
        res.redirect('back');
      } else {
        callback(req, res);
      }
    });
  }
};