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

describe('Booking', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
    await Booking.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it("should be able to user's bookings", async () => {
    const { _id } = await factory.create('User');
    const bookings = await factory.createMany('Booking', 3, { user: _id });

    const response = await request(app)
      .get('/bookings')
      .set('user_id', _id);

    bookings.forEach(booking => {
      expect(response.body).toContainEqual(
        expect.objectContaining({
          _id: booking._id.toString(),
        })
      );
    });
  });

  it('should be able to book a spot', async () => {
    const user = await factory.create('User');
    let spot = await factory.create('Spot');
    const date = faker.date.future();

    const response = await request(app)
      .post(`/spots/${spot._id}/booking`)
      .set('user_id', user._id)
      .send({
        date,
      });

    spot.techs.forEach(tech => {
      expect(response.body.spot.techs).toContainEqual(tech);
    });

    delete response.body.spot.techs;

    spot = spot.toJSON();
    delete spot.techs;
    spot._id = spot._id.toString();

    expect(response.body).toMatchObject({
      spot,
      date: date.toISOString(),
    });
  });

  it('should be able to fail on validation', async () => {
    const user = await factory.create('User');
    const spot = await factory.create('Spot');

    const response = await request(app)
      .expect(400)
      .send();

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });

  it('should be able to emit event to requested spot', async () => {
    const user = await factory.create('User');
    const { _id: spot_owner_id } = await factory.create('User');
    const spot = await factory.create('Spot', {
      user: spot_owner_id,
    });
    const date = faker.date.future();
    const socket_id = faker.random.number();

    connect({
      id: socket_id,
      handshake: {
        query: {
          user_id: spot_owner_id.toString(),
        },
      },
    });

    await request(app)
      .post(`/spots/${spot._id}/booking`)
      .set('user_id', user._id)
      .send({
        date,
      });

    expect(to).toHaveBeenCalledWith(socket_id);
    expect(emit).toHaveBeenCalledWithMatch('booking_request', {
      spot: spot.toJSON(),
      user: user.toJSON(),
      date,
    });
  });
});
