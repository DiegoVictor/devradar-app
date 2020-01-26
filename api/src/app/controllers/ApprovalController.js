import Booking from '../models/Booking';
import Spot from '../models/Spot';

class ApprovalController {
  async store(req, res) {
    const { booking_id } = req.params;
    const { user_id: user } = req;

    const spots = await Spot.find({ user });
    const booking = await Booking.findOne({
      _id: booking_id,
      spot: { $in: spots.map(spot => spot._id) },
    }).populate('spot');

    if (!booking) {
      return res.status(401).json({
        error: 'Only the spot owner can approve bookings',
      });
    }

    booking.approved = true;
    await booking.save();

    const booking_user = req.connections[booking.user];
    if (booking_user) {
      req.io.to(booking_user).emit('booking_response', booking);
    }

    return res.json(booking);
  }
}

export default new ApprovalController();
