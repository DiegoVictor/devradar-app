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

describe('Rejection', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
    await Booking.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to reject a booking', async () => {
    const { _id } = await factory.create('User');
    const { _id: booking_user_id } = await factory.create('User');
    const { _id: spot_id } = await factory.create('Spot', { user: _id });
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
      user: booking_user_id,
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/rejection`)
      .set('user_id', _id);

    expect(response.body).toMatchObject({
      _id: booking_id.toString(),
      approved: false,
    });
  });

  it('should not be able to approve a booking with wrong user', async () => {
    const { _id } = await factory.create('User');
    const { _id: booking_user_id } = await factory.create('User');
    const { _id: spot_id } = await factory.create('Spot');
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
      user: booking_user_id,
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/rejection`)
      .expect(401)

    expect(response.body).toMatchObject({
      error: 'Unauthorized',
      message:
        "You dind't request a booking to this spot or is not the spot owner",
    });
  });

  it('should not be able to reject a booking that happens in the next 24 hours', async () => {
    const { _id } = await factory.create('User');
    const { _id: spot_id } = await factory.create('Spot', { user: _id });
    const { _id: booking_id } = await factory.create('Booking', {
      spot: spot_id,
      user: _id,
      date: (() => {
        const date = new Date();
        date.setHours(date.getHours() + 12);
        return date;
      })(),
    });

    const response = await request(app)
      .post(`/bookings/${booking_id}/rejection`)
      .expect(401)

    expect(response.body).toMatchObject({
      error: 'Unauthorized',
      message: 'You can only cancel bookings with 24 hours in advance',
    });
  });

  it('should be able to emit a rejection booking event', async () => {
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
      .post(`/bookings/${booking_id}/rejection`)
      .set('user_id', _id);

    expect(to).toHaveBeenCalledWith(socket_id);
    expect(emit).toHaveBeenCalledWithMatch('booking_response', {
      approved: false,
      date,
      spot: spot.toJSON(),
      user: booking_user_id,
    });
  });
});
