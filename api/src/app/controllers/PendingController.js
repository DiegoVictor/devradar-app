import Booking from '../models/Booking';
import Spot from '../models/Spot';

class PendingController {
  async index(req, res) {
    const { user_id: user } = req.headers;
    const spots = await Spot.find({ user });
    const bookings = await Booking.find({
      approved: { $exists: false },
      date: { $gte: new Date() },
      spot: { $in: spots.map(spot => spot._id) },
    })
      .populate('user')
      .populate('spot');

    return res.json(bookings);
  }
}

export default new PendingController();
