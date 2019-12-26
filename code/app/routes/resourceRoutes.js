'use strict';
module.exports = (controller) => {
  var express = require('express')
  var router = express.Router()
  
  router.route('/')
    .get(controller.index) // show all resource records
    .post(controller.store);//  store new resource
     

  router.route('/create')
    .get(controller.create); // show create form for a new resource
    
  router.route('/:resourceId/edit')
    .get(controller.edit); // show edit form for an existing resource

  router.route('/:resourceId')
    .get(controller.show) // show an existing resource
    .put(controller.update) // update an existing resource
    .delete(controller.destroy); // delete an existing resource\

  return router;
};