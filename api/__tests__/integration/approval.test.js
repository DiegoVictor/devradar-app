import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import factory from '../utils/factories';
import { connect, emit, to } from '../../__mocks__/socket.io';
import '../utils/extend';
import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';
import Booking from '../../src/app/models/Booking';

describe('Approval', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
    await Booking.deleteMany();
  });

  it('should be able to approve a booking', async () => {
    const { _id } = await factory.create('User');
    const { _id: spot_id } = await factory.create('Spot', { user: _id });
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/approval`)
      .set('user_id', _id);

    expect(response.body).toMatchObject({
      _id: booking_id.toString(),
      approved: true,
    });
  });

  it('should not be able to approve a booking with wrong user', async () => {
    const { _id } = await factory.create('User');
    const { _id: spot_id } = await factory.create('Spot');
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/approval`)
      .set('user_id', _id);

    expect(response.body).toStrictEqual({
      error: 'Only the spot owner can approve bookings',
    });
  });

  it('should be able to emit a approved booking event', async () => {
    const { _id } = await factory.create('User');
    const { _id: booking_user_id } = await factory.create('User');
    const spot = await factory.create('Spot', { user: _id });
    const { _id: booking_id, date } = await factory.create('Booking', {
      spot: spot._id,
      user: booking_user_id,
    });
    const socket_id = faker.random.number();

    connect({
      id: socket_id,
      handshake: {
        query: {
          user_id: booking_user_id.toString(),
        },
      },
    });

    await request(app)
      .post(`/bookings/${booking_id}/approval`)
      .set('user_id', _id);

    expect(to).toHaveBeenCalledWith(socket_id);
    expect(emit).toHaveBeenCalledWithMatch('booking_response', {
      approved: true,
      date,
      spot: spot.toJSON(),
      user: booking_user_id,
    });
  });
});
