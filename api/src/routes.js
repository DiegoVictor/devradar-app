import { Router } from 'express';
import DeveloperConotroller from './controllers/DeveloperController';
import LikeController from './controllers/LikeController';
import DislikeController from './controllers/DislikeController';

const Route = Router();

Route.get('/developers', DeveloperConotroller.index);
Route.get('/developer/:id', DeveloperConotroller.show);
Route.post('/developers', DeveloperConotroller.store);

Route.post('/developers/:liked_user_id/like', LikeController.store);
Route.post('/developers/:liked_user_id/dislike', DislikeController.store);

export default Route;
