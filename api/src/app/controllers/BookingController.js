import Booking from '../models/Booking';
import EmitBooking from '../services/EmitBooking';

class BookingController {
  async index(req, res) {
    const { user_id: user } = req;
    const bookings = await Booking.find({
      date: { $gte: new Date() },
      approved: { $ne: false },
      user,
    }).populate('spot');
    return res.json(bookings);
  }

  async store(req, res) {
    const { user_id: user } = req;
    const { spot_id: spot } = req.params;
    const { date } = req.body;

    let booking = await Booking.create({ user, spot, date });

    booking = await booking
      .populate('spot')
      .populate('user')
      .execPopulate();

    await EmitBooking.run({
      user_id: booking.spot.user,
      booking,
      event: 'booking_request',
    });

    return res.json(booking);
  }
}

export default new BookingController();
