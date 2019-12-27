import request from 'supertest';

import app from '../../src/app';
import factory from '../utils/factories';
import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';
import Booking from '../../src/app/models/Booking';

describe('Peding', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
    await Booking.deleteMany();
  });

  it('should be able to get a list of peding bookings', async () => {
    const { _id } = await factory.create('User');
    const { _id: spot_id } = await factory.create('Spot', { user: _id });
    const bookings = await factory.createMany('Booking', 3, { spot: spot_id });
    const response = await request(app)
      .get('/pending')
      .set('user_id', _id);

    bookings.forEach(booking => {
      expect(response.body).toContainEqual(
        expect.objectContaining({
          _id: booking._id.toString(),
        })
      );
    });
  });
});
