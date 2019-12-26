'use strict';
module.exports = (controller) => {
    var express = require('express')
    var router = express.Router()
  
    router.route('/checkEmail')
        .post(controller.checkIfExist) // check if an email existing or not


  return router;
};