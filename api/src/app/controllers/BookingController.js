import Booking from '../models/Booking';

class BookingController {
  async index(req, res) {
    const { user_id: user } = req.headers;
    const bookings = await Booking.find({
      date: { $gte: new Date() },
      approved: { $ne: false },
      user,
    }).populate('spot');
    return res.json(bookings);
  }

  async store(req, res) {
    const { user_id: user } = req.headers;
    const { spot_id: spot } = req.params;
    const { date } = req.body;

    let booking = await Booking.create({ user, spot, date });

    booking = await booking
      .populate('spot')
      .populate('user')
      .execPopulate();

    const spot_owner = req.connections[booking.spot.user];
    if (spot_owner) {
      req.io.to(spot_owner).emit('booking_request', booking);
    }

    return res.json(booking);
  }
}

export default new BookingController();
