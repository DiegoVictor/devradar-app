import { isAfter, subDays } from 'date-fns';
import Spot from '../models/Spot';
import Booking from '../models/Booking';

class RejectionController {
  async store(req, res) {
    const { user_id: user } = req.headers;
    const { booking_id } = req.params;

    const spots = await Spot.find({ user });
    const booking = await Booking.findOne({
      _id: booking_id,
      $or: [{ user }, { spot: spots.map(spot => spot._id) }],
    }).populate('spot');

    if (!booking) {
      return res.status(401).json({
        error:
          "You did't request a booking to this spot or is not the spot owner",
      });
    }

    if (
      booking.user.equals(user) &&
      isAfter(new Date(), subDays(booking.date, 1))
    ) {
      return res.status(401).json({
        error: 'You can only cancel bookings with 24 hours in advance',
      });
    }

    booking.approved = false;
    await booking.save();

    const booking_user = req.connections[booking.user];
    if (booking_user) {
      req.io.to(booking_user).emit('booking_response', booking);
    }

    return res.json(booking);
  }
}

export default new RejectionController();
