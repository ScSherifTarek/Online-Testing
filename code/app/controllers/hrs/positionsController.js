'use strict';

const Position = require('../../models/position.js');

/**
 * Show all exam types
 */
exports.index = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    Position.all(function(err, positions) {
      if (err) {
        res.status(500).send({
          error: true,
          message: err
        });
      }
      else {
        res.render('hrs/positions/index', {positions: positions});
      }
    })
  } else {
    res.redirect('/hrs/')
  }
  ;
};

/**
 * Show exam type create form
 */
exports.create = function(req, res){
  if (req.session.loggedin && req.session.hr) {
    res.render('hrs/positions/createForm', {
      old: req.flash('old'),
      errors: req.flash('errors')
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
    Position.create(req.body, function(err, id) {
      if (err) {
        res.status(500).json({
          error: true,
          message: err
        });
      } else {
        res.redirect('/hrs/positions');
      }
    });
  });
  } else {
    res.redirect('/hrs/')
  }
};

exports.show = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    returnPositionsWithId(req.params.resourceId, res);
  } else {
    res.redirect('/hrs/')
  }
};

exports.edit = function(req, res){
  if (req.session.loggedin && req.session.hr) {
    Position.findOrFail(req.params.resourceId, function(err, position) {
      if (err) {
        res.status(400).json({
          error: true,
          message: err
        });
      } else {
        res.render('hrs/positions/updateForm', {
          position: position,
          old: req.flash('old'),
          errors: req.flash('errors')
        });
      }
    });
  } else {
    res.redirect('/hrs/')
  }
};

exports.update = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    Position.findOrFail(req.params.resourceId, function(err, position) {
      if (err) {
        res.status(400).json({
          error: true,
          message: err
        });
      } else {
        Position.updateById(req.params.resourceId, new Position(req.body), function(err, position) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/hrs/positions');
          }
        });
      }
    });
  } else {
    res.redirect('/hrs/')
  }
};


exports.destroy = function(req, res) {
  if (req.session.loggedin && req.session.hr) {
    Position.delete(req.params.resourceId, function(err, position) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/hrs/positions')
      }
    });
  } else {
    res.redirect('/hrs/')
  }
};

function returnPositionWithId(id, res) {
  Position.findOrFail(id, function(err, e) {
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

  if(!req.body.title) {
    errors.push("Title is required");
  }

  if(!req.body.details) {
    errors.push("Details is required");
  }

  if(errors.length){
    req.flash('old', [
        req.body.title,
        req.body.details
    ]);
    req.flash('errors', errors);
    res.redirect('back');
  } else {
    callback(req, res);
  }
};