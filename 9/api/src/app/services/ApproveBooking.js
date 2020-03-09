import { unauthorized } from '@hapi/boom';

import Booking from '../models/Booking';
import Spot from '../models/Spot';

class ApproveBooking {
  async run({ booking_id, user }) {
    const spots = await Spot.find({ user });
    const booking = await Booking.findOne({
      _id: booking_id,
      spot: { $in: spots.map(spot => spot._id) },
    }).populate('spot');

    if (!booking) {
      throw unauthorized('Only the spot owner can approve bookings');
    }

    booking.approved = true;
    await booking.save();

    return booking;
  }
}

export default new ApproveBooking();
