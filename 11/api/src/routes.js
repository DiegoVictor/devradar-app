import { Router } from 'express';

import OngController from './app/controllers/OngController';
import IncidentController from './app/controllers/IncidentController';
import OngIncidentController from './app/controllers/OngIncidentController';
import SessionController from './app/controllers/SessionController';

import IncidentGet from './app/validators/Incidents/Get';
import IncidentDelete from './app/validators/Incidents/Delete';
import IncidentStore from './app/validators/Incidents/Store';
import OngStore from './app/validators/Ongs/Store';
import OngIncidentsGet from './app/validators/OngIncidents/Get';
import SessionStore from './app/validators/Sessions/Store';

const Route = Router();

Route.post('/sessions', SessionStore, SessionController.store);

Route.get('/ongs', OngController.index);
Route.post('/ongs', OngStore, OngController.store);

Route.get('/incidents', IncidentGet, IncidentController.index);
Route.post('/incidents', IncidentStore, IncidentController.store);
Route.delete('/incidents/:id', IncidentDelete, IncidentController.destroy);

Route.get('/ong_incidents', OngIncidentsGet, OngIncidentController.index);

export default Route;
