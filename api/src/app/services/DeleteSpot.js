import { badRequest, unauthorized } from '@hapi/boom';

import Booking from '../models/Booking';
import Spot from '../models/Spot';

class DeleteSpot {
  async run({ _id, user }) {
    const spot = await Spot.findOne({ _id, user });

    if (!spot) {
      throw badRequest('Spot does not exists');
    }

    const bookings = await Booking.find({
      spot: _id,
      approved: true,
      date: { $gte: new Date() },
    });

    if (bookings.length > 0) {
      throw unauthorized('You can not remove spot with bookings approved');
    }

    await spot.remove();

    return spot;
  }
}

export default new DeleteSpot();
