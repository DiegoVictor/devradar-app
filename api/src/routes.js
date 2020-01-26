import { Router } from 'express';
import Multer from 'multer';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import storage from './config/storage';
import SessionController from './app/controllers/SessionController';
import PendingController from './app/controllers/PendingController';
import SpotController from './app/controllers/SpotController';
import BookingController from './app/controllers/BookingController';
import DashboardController from './app/controllers/DashboardController';
import ApprovalController from './app/controllers/ApprovalController';
import RejectionController from './app/controllers/RejectionController';
import Authenticate from './app/middlewares/Authenticate';
import SessionStore from './app/validators/SessionStore';
import SpotStore from './app/validators/SpotStore';
import SpotUpdate from './app/validators/SpotUpdate';
import BookingStore from './app/validators/BookingStore';

const Route = Router();

Route.post(
  '/sessions',
  (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
      const BruteForce = new ExpressBrute(
        new RedisStore({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        })
      );
      return BruteForce.prevent;
    }
    return next();
  },
  SessionStore,
  SessionController.store
);

Route.use(Authenticate);

Route.get('/spots', SpotController.index);
Route.get('/spots/:id', SpotController.show);
Route.post(
  '/spots',
  Multer(storage).single('thumbnail'),
  SpotStore,
  SpotController.store
);
Route.put(
  '/spots/:id',
  Multer(storage).single('thumbnail'),
  SpotUpdate,
  SpotController.update
);
Route.post('/spots/:spot_id/booking', BookingStore, BookingController.store);
Route.delete('/spots/:id', SpotController.delete);

Route.get('/dashboard', DashboardController.index);

Route.get('/pending', PendingController.index);

Route.get('/bookings', BookingController.index);
Route.post('/bookings/:booking_id/approval', ApprovalController.store);
Route.post('/bookings/:booking_id/rejection', RejectionController.store);

export default Route;
