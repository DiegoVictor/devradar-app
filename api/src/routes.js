import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SearchController from './app/controllers/SearchController';
import DeveloperStore from './app/validators/DeveloperStore';
import DeveloperUpdate from './app/validators/DeveloperUpdate';
import DeveloperSearch from './app/validators/DeveloperSearch';

const Route = Router();

Route.get('/developers', DeveloperController.index);
Route.post('/developers', DeveloperStore, DeveloperController.store);
Route.put('/developers/:id', DeveloperUpdate, DeveloperController.update);
Route.delete('/developers/:id', DeveloperController.destroy);

Route.get('/search', DeveloperSearch, SearchController.index);

export default Route;
