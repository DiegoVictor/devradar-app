const Router = require('express').Router();

// Controllers
const DeveloperConotroller = require('../controllers/DeveloperController');
const LikeController = require('../controllers/LikeController');
const DislikeController = require('../controllers/DislikeController');


Router.get('/developers', DeveloperConotroller.index);
Router.post('/developers', DeveloperConotroller.store);
Router.post('/developers/:liked_user_id/like', LikeController.store);
Router.post('/developers/:liked_user_id/dislike', DislikeController.store);


module.exports = Router;