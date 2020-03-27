import { Router } from 'express';

import OngController from './app/controllers/OngController';
import IncidentController from './app/controllers/IncidentController';
import OngIncidentController from './app/controllers/OngIncidentController';
import SessionController from './app/controllers/SessionController';

import IncidentGet from './app/validators/Incident/Get';
import IncidentDelete from './app/validators/Incident/Delete';
import OngStore from './app/validators/Ong/Store';
import OngIncidentsGet from './app/validators/OngIncidents/Get';

const Route = Router();

Route.post('/sessions', SessionController.store);

Route.get('/ongs', OngController.index);
Route.post('/ongs', OngStore, OngController.store);

Route.get('/incidents', IncidentGet, IncidentController.index);
Route.post('/incidents', IncidentController.store);
Route.delete('/incidents/:id', IncidentDelete, IncidentController.destroy);

Route.get('/ong_incidents', OngIncidentsGet, OngIncidentController.index);

export default Route;
