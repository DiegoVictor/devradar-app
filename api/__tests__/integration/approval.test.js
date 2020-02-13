import request from 'supertest';
import faker from 'faker';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import { connect, emit, to } from '../../__mocks__/socket.io';
import '../utils/extend';
import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';
import Booking from '../../src/app/models/Booking';
import jwtoken from '../utils/jwtoken';

let token;
let user;

describe('Approval', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
    await Booking.deleteMany();

    user = await factory.create('User');
    token = jwtoken(user.id);
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to approve a booking', async () => {
    const { _id: spot_id } = await factory.create('Spot', { user: user._id });
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
      user: user._id.toString(),
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/approval`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toMatchObject({
      _id: booking_id.toString(),
      approved: true,
    });
  });

  it('should not be able to approve a booking with wrong user', async () => {
    const { _id: spot_id } = await factory.create('Spot');
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/approval`)
      .expect(401)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toMatchObject({
      error: 'Unauthorized',
      message: 'Only the spot owner can approve bookings',
    });
  });

  it('should be able to emit a approved booking event', async () => {
    const { _id: booking_user_id } = await factory.create('User');
    const spot = await factory.create('Spot', { user: user._id });
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
      .set('Authorization', `Bearer ${token}`);

    expect(to).toHaveBeenCalledWith(`${socket_id}`);
    expect(emit).toHaveBeenCalledWithMatch('booking_response', {
      approved: true,
      date,
      spot: spot.toJSON(),
      user: booking_user_id,
    });
  });
});
