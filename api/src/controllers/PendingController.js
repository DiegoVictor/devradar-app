import Booking from '../models/Booking';

class PendingController {
  async index(req, res) {
    const { user_id: user } = req.headers;
    const bookings = await Booking.find({
      approved: { $exists: false },
      date: { $gte: new Date() },
      user,
    })
      .populate('user')
      .populate('spot');

    return res.json(bookings);
  }
}

export default new PendingController();
