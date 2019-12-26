'use strict';

const ExamType = require('../../models/exam-type.js');

/**
 * Show all exam types
 */
exports.index = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    ExamType.all(function(err, examTypes) {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      else {
        res.render('hrs/exam-types/index', {examTypes: examTypes});
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
  if (req.session.loggedin && req.session.hr) {
    res.render('hrs/exam-types/createForm', {
      old: req.flash('old'),
      errors: req.flash('errors')
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
      ExamType.create(req.body, function(err, id) {
        if (err) {
          res.status(500).json({
            error: true,
            message: err
          });
        } else {
          res.redirect('/hrs/exam-types');
        }
      });
    });
  }else{
    res.redirect('/hrs/' );
  }
    

};

// TODO all the next methods
exports.show = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    returnExamTypeWithId(req.params.resourceId, res);
  }else{
    res.redirect('/hrs/');
  }
};

exports.edit = function(req, res){
  if (req.session.loggedin && req.session.hr) {
    ExamType.findOrFail(req.params.resourceId, function(err, examType) {
      if (err) {
        res.status(400).json({
          error: true,
          message: err
        });
      } else {
        res.render('hrs/exam-types/updateForm', {
          examType: examType,
          old: req.flash('old'),
          errors: req.flash('errors')
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
      ExamType.findOrFail(req.params.resourceId, function(err, examType) {
        if (err) {
          res.status(400).json({
            error: true,
            message: err
          });
        } else {
          ExamType.updateById(req.params.resourceId, new ExamType(req.body), function(err, examType) {
            if (err) {
              res.send(err);
            } else {
              res.redirect('/hrs/exam-types');
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
    ExamType.delete(req.params.resourceId, function(err, examType) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/hrs/exam-types')
      }
    });
  }else{
    res.redirect('/hrs/');
  }
  
  
};

function returnExamTypeWithId(id, res) {
  ExamType.findOrFail(id, function(err, examType) {
    if (err) {
      res.status(400).json({
        error: true,
        message: err
      }).end();
    } else {
      res.json(examType);
    }
  });
}

const validateRequest = function(req, res, callback) {
  let errors = [];
  if(!req.body.type) {
    errors.push("Type is required");
  }

  if(errors.length){
    req.flash('old', [
      req.body.type
    ]);
    req.flash('errors', errors);
    res.redirect('back');
  } else {
    callback(req, res);
  }
};