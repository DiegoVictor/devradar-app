import { Router } from 'express';

import NgoController from './app/controllers/NgoController';
import IncidentController from './app/controllers/IncidentController';
import NgoIncidentController from './app/controllers/NgoIncidentController';
import SessionController from './app/controllers/SessionController';

import IncidentGet from './app/validators/Incidents/Get';
import IncidentShow from './app/validators/Incidents/Show';
import IncidentDelete from './app/validators/Incidents/Delete';
import IncidentStore from './app/validators/Incidents/Store';
import NgoGet from './app/validators/Ngos/Get';
import NgoShow from './app/validators/Ngos/Show';
import NgoStore from './app/validators/Ngos/Store';
import NgoIncidentsGet from './app/validators/NgoIncidents/Get';
import SessionStore from './app/validators/Sessions/Store';

import AuthToken from './app/middlewares/AuthToken';
import RateLimit from './app/middlewares/RateLimit';
import BruteForce from './app/middlewares/BruteForce';

const Route = Router();

Route.post(
  '/sessions',
  BruteForce.prevent,
  SessionStore,
  SessionController.store
);

Route.use(RateLimit);

Route.get('/ngos', NgoGet, NgoController.index);
Route.get('/ngos/:id', NgoShow, NgoController.show);
Route.post('/ngos', NgoStore, NgoController.store);

Route.get('/incidents', IncidentGet, IncidentController.index);
Route.get('/incidents/:id', IncidentShow, IncidentController.show);

Route.use(AuthToken);

Route.post('/incidents', IncidentStore, IncidentController.store);
Route.delete('/incidents/:id', IncidentDelete, IncidentController.destroy);

Route.get('/ngo_incidents', NgoIncidentsGet, NgoIncidentController.index);

export default Route;
