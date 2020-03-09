import Spot from '../models/Spot';

class DashboardController {
  async index(req, res) {
    const { user_id: user } = req;
    const spots = await Spot.find({ user });
    return res.json(spots);
  }
}

export default new DashboardController();
