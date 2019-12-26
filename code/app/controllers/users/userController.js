'use strict';
const formidable = require('formidable');
const fs = require('fs');
var User = require('../../models/userModel.js');



/**
 * display login page
 */
exports.index = function(req, res) {
  if(req.session.loggedin && req.session.user){
    res.redirect('/users/home');
  }else{
    res.render('users/index' );
  }
};

/**
 * display sign-up page
 */
exports.create = function(req, res){
  res.render('users/createForm')
}

/**
 * Store new user
 */

exports.store = (req, res)=>{

  var form = new formidable.IncomingForm();
    form.parse(req, function (err1, fields, files) {

      if(err1) res.status(500).json({
        error: true,
        message: err
        });

      User.create(fields, function(err2, userID, cv_name) {
          if (err2) {
            res.status(500).json({
              error: true,
              message: err2
            });
          } else {
            
            // save the file 
            var oldpath = files.cv.path;
            var newpath = __dirname + '/../../../public/uploads/cvs/' + cv_name ;
            
            fs.rename(oldpath, newpath, function (err3) {
        
              if (err3) { 
                res.status(500).json({
                error: true,
                message: err3
                });
              } else {
                res.redirect('/users');
              }
      
            });

            
          }
        });
      
    })
}
      
/**
 * check if the user is exist or not
 */
exports.authenticate = function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  if (email && password) {
    User.checkIfUserExist(email, password, function(err, user){
      if(err){ // user enterd not valid data
        response.redirect('/users/');
      }else{
        if(user){ // user is existing
          request.session.loggedin = true;
          request.session.user = user.id;
          request.session.name = user.name;
          response.redirect('/users/home');
        }else{ // there is no such user
          response.redirect('/users/');
        }
      }
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
}

/**
 * display the homepage to the user
 */
exports.showHomepage = function(req, res){
  if (req.session.loggedin && req.session.user) {
    res.render('users/homepage', {session: req.session});

  } else {
    res.redirect('/users/')
  }
  res.end();
}

/**
 * logout the user
 */
exports.logout = function(req,res){    
  req.session.destroy(function(err){  
      if(err){  
          throw err;  
      }  
      else{  // redirect to the login page
          res.redirect('/users/');  
      }  
  });  
}


/**
 * check if the email is existing in the system or not
 */
exports.checkIfExist = function(req, res) {
  returnEmailExistance(req.body.email, res);
};

/**
 * check if an email is exist
 */
function returnEmailExistance(email ,response){
  User.checkIfEmailExist(email, function(err, res){
    if(err){ // this email is existing in the system
      response.send('something went wrong');
    }else{
      if(res) response.send('this email is existing')
      else response.send(null);
    }
  });
}