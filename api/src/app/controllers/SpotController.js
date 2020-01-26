import { badRequest } from '@hapi/boom';

import Booking from '../models/Booking';
import Spot from '../models/Spot';
import User from '../models/User';

class SpotController {
  async index(req, res) {
    const { tech } = req.query;

    return res.json(await Spot.find({ techs: tech }));
  }

  async show(req, res) {
    const { id } = req.params;

    const spot = await Spot.findById(id);

    const { thumbnail_url, company, price, techs, user } = spot;
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
    const { filename } = req.file;
    const { company, techs, price } = req.body;

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
    const data = {
      company,
      price,
    };

    if (techs) {
      data.techs = techs.split(',').map(tech => tech.trim());
    }

    if (typeof req.file === 'object') {
      data.thumbnail = req.file.filename;
    }

    const spot = await Spot.findOneAndUpdate(
      {
        _id: id,
        user,
      },
      data
    );

    return res.json({
      ...spot,
      ...data,
    });
  }

  async delete(req, res) {
    const { id: _id } = req.params;
    const { user_id: user } = req;

    const spot = await Spot.findOne({
      _id: id,
      user,
    });

    if (!spot) {
      return res.status(400).json({
        error: 'Spot does not exists',
      });
    }

    const bookings = await Booking.find({
      spot: id,
      approved: true,
      date: { $gte: new Date() },
    });

    if (bookings.length > 0) {
      return res.status(401).json({
        error: 'You can not remove spot with bookings approved',
      });
    }

    await spot.remove();
    return res.json(spot);
  }
}

export default new SpotController();
