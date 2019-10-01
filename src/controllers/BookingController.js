import Booking from '../models/Booking';

class BookingController {
  async store(req, res) {
    const { user_id: user } = req.headers;
    const { spot_id: spot } = req.params;
    const { date } = req.body;

    const booking = await Booking.create({ user, spot, date });

    booking.populate('spot').populate('user');
    return res.json(await booking.execPopulate());
  }
}

export default new BookingController();
