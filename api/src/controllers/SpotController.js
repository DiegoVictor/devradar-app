import Spot from '../models/Spot';
import User from '../models/User';

class SpotController {
  async index(req, res) {
    const { tech } = req.query;

    return res.json(await Spot.find({ techs: tech }));
  }

  async store(req, res) {
    const { filename } = req.file;
    const { company, techs, price } = req.body;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({
        error: 'User does not exists',
      });
    }

    const spot = await Spot.create({
      user: user_id,
      company,
      techs: techs.split(',').map(tech => tech.trim()),
      price,
      thumbnail: filename,
    });

    return res.json(spot);
  }
}

export default new SpotController();
