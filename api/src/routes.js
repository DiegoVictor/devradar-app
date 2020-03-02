import { Router } from 'express';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import DeveloperConotroller from './app/controllers/DeveloperController';
import LikeController from './app/controllers/LikeController';
import DislikeController from './app/controllers/DislikeController';
import MatchController from './app/controllers/MatchController';
import DeveloperStore from './app/validators/Developer/Store';
import Authenticate from './app/middlewares/Authenticate';

const Route = Router();

Route.post(
  '/developers',
  (() => {
    if (process.env.NODE_ENV !== 'test') {
      const BruteForce = new ExpressBrute(
        new RedisStore({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        })
      );
      return BruteForce.prevent;
    }
    return (req, res, next) => {
      return next();
    };
  })(),
  DeveloperStore,
  DeveloperConotroller.store
);

Route.use(Authenticate);

Route.get('/developers', DeveloperConotroller.index);
Route.get('/developers/:id', DeveloperConotroller.show);

Route.post('/developers/:liked_user_id/like', LikeController.store);
Route.post('/developers/:disliked_user_id/dislike', DislikeController.store);

Route.get('/matches', MatchController.index);

export default Route;
