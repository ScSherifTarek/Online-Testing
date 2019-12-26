'use strict';
var userController = require('../controllers/users/userController');
var hrController = require('../controllers/hrs/hrController');
var examTypesController = require('../controllers/hrs/examTypesController');
var questionsController = require('../controllers/hrs/questionsController');
var applicationsController = require('../controllers/hrs/applicationController');
var answersController = require('../controllers/hrs/answersController');
var hrsPositionsController = require('../controllers/hrs/positionsController');
var usersPositionsController = require('../controllers/users/positionsController');
var examController = require('../controllers/users/examController');

module.exports = function(app) {
  var resourceRoutes = require('./resourceRoutes');
  var userRoutes = require('./userRoutes');
  var userApisRoutes = require('./userApiRoutes');
  var hrRoutes = require('./hrRoutes');
  
    
  // Users routes
  app.get('/', (req, res) => {
    res.redirect('/users');
  });
  app.use('/users', userRoutes(userController));
  app.use('/api/users', userApisRoutes(userController));
  app.get('/users/home', usersPositionsController.index);
  app.post('/users/positions/:position_id/apply', usersPositionsController.apply);
  app.get('/users/applications/:application_id/exams', examController.showExams);
  app.get('/users/applications/:application_id/exams/:exam_id', examController.displyExam);


  // register resource controller for the "tasks"
  app.use('/hrs', hrRoutes(hrController));
  app.use('/hrs/exam-types', resourceRoutes(examTypesController));
  app.use('/hrs/questions', resourceRoutes(questionsController));
  app.use('/hrs/answers', resourceRoutes(answersController));
  app.use('/hrs/positions', resourceRoutes(hrsPositionsController));
  app.get('/hrs/applications', applicationsController.index);
  app.get('/hrs/applications/:application_id/', applicationsController.index);
  app.post('/hrs/applications/:application_id/approve' , applicationsController.approve);
  app.post('/hrs/applications/:application_id/disapprove', applicationsController.disapprove);
  app.get('/hrs/applications/:application_id/createExams', applicationsController.showCreateExamsForm);
  app.post('/hrs/applications/:application_id/createExams', applicationsController.createExams);
  app.get('/hrs/applications/:application_id/wantToOrderExams', applicationsController.wantToOrderExams);
  app.get('/hrs/applications/:application_id/orderExams', applicationsController.orderExamsForm);
  app.post('/hrs/applications/:application_id/orderExams', applicationsController.orderExams);
  app.get('/hrs/applications/:application_id/examsDeadline', applicationsController.examsDeadlineForm);
  app.post('/hrs/applications/:application_id/examsDeadline', applicationsController.examsDeadline);
};