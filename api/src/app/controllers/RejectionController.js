import EmitBooking from '../services/EmitBooking';
import RejectBooking from '../services/RejectBooking';

class RejectionController {
  async store(req, res) {
    const { user_id: user } = req;
    const { booking_id } = req.params;

    const booking = await RejectBooking.run({ booking_id, user });

    await EmitBooking.run({
      user_id: booking.user,
      booking,
      event: 'booking_response',
    });

    return res.json(booking);
  }
}

export default new RejectionController();
