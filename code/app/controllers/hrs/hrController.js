'use strict';

var Hr = require('../../models/hrModel.js');

/**
 * display login page
 */
exports.index = function(req, res) {
  if(req.session.loggedin && req.session.hr){
    res.redirect('/hrs/home')
  }else{
    res.render('hrs/index');    
  }
  
};

/**
 * display sign-up page
 */
exports.create = function(req, res){
  res.render('hrs/createForm');
}

/**
 * Store new hr
 */

exports.store = (req, res)=>{

  Hr.create(req.body, function(err, userID) {
    if (err) {
      res.status(500).json({
      error: true,
      message: err
      });
    }else {
      res.redirect('/hrs');
    }
    
  });
}
      
/**
 * check if the hr is exist or not
 */
exports.authenticate = function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  if (email && password) {
    Hr.checkIfHrExist(email, password, function(err, hr){
      if(err){ // user enterd not valid data
        response.redirect('/users/');
      }else{
        if(hr){ // user is existing
          request.session.loggedin = true;
          request.session.hr = hr.id;
          request.session.name = hr.name;
          response.redirect('/hrs/applications');
        }else{ // there is no such user
          response.redirect('/hrs/');
        }
      }
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
}

/**
 * display the homepage to the hr
 */
exports.showHomepage = function(req, res){
  if (req.session.loggedin && req.session.hr) {
    res.render('hrs/homepage', {session: req.session});

  } else {
    res.redirect('/hrs/')
  }
  res.end();
}

/**
 * logout the hr
 */
exports.logout = function(req,res){    
  req.session.destroy(function(err){  
      if(err){  
          throw err;  
      }  
      else{  // redirect to the login page
          res.redirect('/hrs/');  
      }  
  });  
}
