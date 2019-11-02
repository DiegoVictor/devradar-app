import { isAfter, subDays } from 'date-fns';
import Booking from '../models/Booking';

class RejectionController {
  async store(req, res) {
    const { user_id: user } = req.headers;
    const { booking_id } = req.params;
    const booking = await Booking.findById(booking_id).populate('spot');

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

    if (!user) {
      const booking_user = req.connections[booking.user];
      if (booking_user) {
        req.io.to(booking_user).emit('booking_response', booking);
      }
    }

    return res.json(booking);
  }
}

export default new RejectionController();
