import Spot from '../models/Spot';

class DashboardController {
  async index(req, res) {
    const { user_id } = req.headers;

    const spots = await Spot.find({ user_id });
    return res.json(spots);
  }
}

export default new DashboardController();
