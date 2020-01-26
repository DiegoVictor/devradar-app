import { badRequest } from '@hapi/boom';

import Booking from '../models/Booking';
import Spot from '../models/Spot';
import User from '../models/User';
import DeleteSpot from '../services/DeleteSpot';
import UpdateSpot from '../services/UpdateSpot';

class SpotController {
  async index(req, res) {
    const { tech } = req.query;
    return res.json(await Spot.find({ techs: tech }));
  }

  async show(req, res) {
    const { id } = req.params;
    const { thumbnail_url, company, price, techs, user } = await Spot.findById(
      id
    );
    const bookings = await Booking.find({
      spot: id,
      date: { $gte: new Date() },
      approved: true,
    }).populate('user');

    return res.json({
      user,
      company,
      price,
      techs,
      thumbnail_url,
      bookings,
    });
  }

  async store(req, res) {
    const { user_id } = req;
    const { company, techs, price } = req.body;
    let filename;

    if (typeof req.file === 'object') {
      filename = req.file.filename;
    }

    const user = await User.findById(user_id);
    if (!user) {
      throw badRequest('User does not exists');
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

  async update(req, res) {
    const { user_id: user } = req;
    const { id: _id } = req.params;
    const { company, techs, price } = req.body;
    let file;

    if (typeof req.file === 'object') {
      file = req.file;
    }

    const spot = await UpdateSpot.run({
      _id,
      file,
      user,
      company,
      techs,
      price,
    });

    return res.json(spot);
  }

  async delete(req, res) {
    const { id: _id } = req.params;
    const { user_id: user } = req;

    const spot = await DeleteSpot.run({ _id, user });
    return res.json(spot);
  }
}

export default new SpotController();
