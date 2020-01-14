import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SearchController from './app/controllers/SearchController';

const Route = Router();

Route.get('/developers', DeveloperController.index);
Route.post('/developers', DeveloperController.store);
Route.put('/developers/:id', DeveloperController.update);
Route.delete('/developers/:id', DeveloperController.destroy);

Route.get('/search', SearchController.index);

export default Route;
