import { Router } from 'express';

import OngController from './app/controllers/OngController';
import IncidentController from './app/controllers/IncidentController';
import OngIncidentController from './app/controllers/OngIncidentController';
import SessionController from './app/controllers/SessionController';

const Route = Router();

Route.post('/sessions', SessionController.store);

Route.get('/ongs', OngController.index);
Route.post('/ongs', OngController.store);

Route.get('/incidents', IncidentController.index);
Route.post('/incidents', IncidentController.store);
Route.delete('/incidents/:id', IncidentController.destroy);

Route.get('/ong_incidents', OngIncidentController.index);

export default Route;
