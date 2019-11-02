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

    const booking = await Booking.create({ user, spot, date });

    booking.populate('spot').populate('user', (err, book) => {
      const spot_owner = req.connections[book.spot.user];
      if (spot_owner) {
        req.io.to(spot_owner).emit('booking_request', booking);
      }
    });

    return res.json(await booking);
  }
}

export default new BookingController();
