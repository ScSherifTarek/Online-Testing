'use strict';

const Question = require('../../models/question.js');
const Answer = require('../../models/answer.js');

/**
 * Show all exam types
 */
exports.index = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    Answer.all(function(err, answers) {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      else {
        res.render('hrs/answers/index', {
          answers: answers
        });
      }
    });
  } else {
    res.redirect('/hrs/')
  }
  
};

/**
 * Show exam type create form
 */
exports.create = function(req, res){
  if (req.session.loggedin && req.session.hr) {
    Question.all((err, questions) => {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      else {
        res.render('hrs/answers/createForm', {
          questions: questions,
          old: req.flash('old'),
          errors: req.flash('errors')
        });
      }
    });
  } else {
    res.redirect('/hrs/')
  }
};

/**
 * Store new exam type
 */
exports.store = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    // Validation
  validateRequest(req, res, (req, res) => {
    Answer.create(req.body, function(err, id) {
      if (err) {
        res.status(500).json({
          error: true,
          message: err
        });
      } else {
        res.redirect('/hrs/answers');
      }
    });
  });
  } else {
    res.redirect('/hrs/')
  }
  
};

exports.show = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
  returnAnswerWithId(req.params.resourceId, res);
  } else {
    res.redirect('/hrs/')
  }
};

exports.edit = function(req, res){
  if (req.session.loggedin && req.session.hr) {
    Answer.findOrFail(req.params.resourceId, function(err, answer) {
      if (err) {
        res.status(400).json({
          error: true,
          message: err
        });
      } else {
        Question.all((err, questions) => {
          if (err) {
            res.status(500).send({
              error: true,
              message: err
            });
          }
          else {
            res.render('hrs/answers/updateForm', {
              questions: questions,
              answer: answer,
              old: req.flash('old'),
              errors: req.flash('errors')
            });
          }
        });
      }
    });
  } else {
    res.redirect('/hrs/')
  }
};

exports.update = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    validateRequest(req, res, (req, res) => {
      Answer.findOrFail(req.params.resourceId, function (err, answer) {
        if (err) {
          res.status(400).json({
            error: true,
            message: err
          });
        } else {
          Answer.updateById(req.params.resourceId, new Answer(req.body), function (err, answer) {
            if (err) {
              res.send(err);
            } else {
              res.redirect('/hrs/answers');
            }
          });
        }
      });
    });
  } else {
    res.redirect('/hrs/')
  }
};


exports.destroy = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    Answer.delete(req.params.resourceId, function(err, answer) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/hrs/answers')
      }
    });
  } else {
    res.redirect('/hrs/')
  }
};

function returnAnswerWithId(id, res) {
  Answer.findOrFail(id, function(err, e) {
    if (err) {
      res.status(400).json({
        error: true,
        message: err
      }).end();
    } else {
      res.json(e);
    }
  });
}

const validateRequest = function(req, res, callback) {
  let errors = [];

  if(!req.body.body) {
    errors.push("Answer body is required");
  }
  if(req.body.is_correct != "0" && req.body.is_correct != "1") {
    errors.push("You must define if the answer is correct or not");
  }

  if(!req.body.question_id) {
    errors.push("Question is required");
  } else {
    Question.findOrFail(req.body.question_id, (err, e) => {
      if(err) {
        errors.push("Question you entered is not in our database");
      }
      if(errors.length){
        req.flash('old', [
          req.body.question_id,
          req.body.body,
          req.body.is_correct,
        ]);
        req.flash('errors', errors);
        res.redirect('back');
      } else {
        callback(req, res);
      }
    });
  }
};