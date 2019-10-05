import { Router } from 'express';
import Multer from 'multer';

import SessionController from './controllers/SessionController';
import SpotController from './controllers/SpotController';
import BookingController from './controllers/BookingController';
import DashboardController from './controllers/DashboardController';
import ApprovalController from './controllers/ApprovalController';
import RejectionController from './controllers/RejectionController';
import storage from './config/storage';

const Route = Router();

Route.post('/sessions', SessionController.store);

Route.get('/spots', SpotController.index);
Route.post('/spots', Multer(storage).single('thumbnail'), SpotController.store);
Route.post('/spots/:spot_id/booking', BookingController.store);

Route.get('/dashboard', DashboardController.index);

Route.post('/bookings/:booking_id/approval', ApprovalController.store);
Route.post('/bookings/:booking_id/rejection', RejectionController.store);

export default Route;
