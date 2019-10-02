import { Router } from 'express';
import Multer from 'multer';

import SessionController from './controllers/SessionController';
import SpotController from './controllers/SpotController';
import BookingController from './controllers/BookingController';
import DashboardController from './controllers/DashboardController';
import storage from './config/storage';

const Route = Router();

Route.post('/sessions', SessionController.store);

Route.get('/spots', SpotController.index);
Route.post('/spots', Multer(storage).single('thumbnail'), SpotController.store);
Route.post('/spots/:spot_id/booking', BookingController.store);

Route.get('/dashboard', DashboardController.index);

export default Route;
