import parseStringAsArray from '../helpers/parseStringAsArray';
import Developer from '../models/Developer';

class SearchController {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    return res.json(
      await Developer.find({
        techs: {
          $in: parseStringAsArray(techs),
        },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000,
          },
        },
      })
    );
  }
}

export default new SearchController();
