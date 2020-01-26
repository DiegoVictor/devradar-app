import EmitBooking from '../services/EmitBooking';
import ApproveBooking from '../services/ApproveBooking';

class ApprovalController {
  async store(req, res) {
    const { booking_id } = req.params;
    const { user_id: user } = req;

    const booking = await ApproveBooking.run({ booking_id, user });

    await EmitBooking.run({
      user_id: booking.user,
      booking,
      event: 'booking_response',
    });

    return res.json(booking);
  }
}

export default new ApprovalController();
