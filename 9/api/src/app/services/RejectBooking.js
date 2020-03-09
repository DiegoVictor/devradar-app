import { unauthorized } from '@hapi/boom';
import { isAfter, subDays } from 'date-fns';

import Spot from '../models/Spot';
import Booking from '../models/Booking';

class RejectBooking {
  async run({ booking_id, user }) {
    const spots = await Spot.find({ user });
    const booking = await Booking.findOne({
      _id: booking_id,
      $or: [{ user }, { spot: spots.map(spot => spot._id) }],
    }).populate('spot');

    if (!booking) {
      throw unauthorized(
        "You dind't request a booking to this spot or is not the spot owner"
      );
    }

    if (
      booking.user.equals(user) &&
      isAfter(new Date(), subDays(booking.date, 1))
    ) {
      throw unauthorized(
        'You can only cancel bookings with 24 hours in advance'
      );
    }

    booking.approved = false;
    await booking.save();

    return booking;
  }
}

export default new RejectBooking();
