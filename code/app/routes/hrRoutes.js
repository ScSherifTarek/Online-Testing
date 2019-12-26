'use strict';

module.exports = (controller) => {
    
    var express = require('express');
    var router = express.Router();

    router.get('/', controller.index); // display login page
    router.post('/', controller.store);//  store new hr

    router.post('/auth', controller.authenticate); // authenticate the hr
    
    // the main page the will displayed for the hr
    router.get('/home', controller.showHomepage);
    
    router.get('/sign-up', controller.create); // display sign-up page

    router.get('/logout', controller.logout);

  return router;
};