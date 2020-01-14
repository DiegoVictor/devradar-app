import ParseStringAsArray from '../services/ParseStringAsArray';
import Developer from '../models/Developer';

class SearchController {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    const developers = await Developer.find({
      techs: {
        $in: ParseStringAsArray.run(techs),
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
    });
    return res.json(developers);
  }
}

export default new SearchController();
