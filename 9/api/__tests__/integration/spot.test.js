import request from 'supertest';
import faker from 'faker';
import path from 'path';
import fs from 'fs';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';
import Booking from '../../src/app/models/Booking';
import jwtoken from '../utils/jwtoken';

let token;
let user;

describe('Spot', () => {
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

  it('should be able to get a list of spots', async () => {
    const tech = faker.random.word();

    await factory.createMany('Spot', 3, { techs: [tech] });

    const response = await request(app)
      .get(`/spots?tech=${tech}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body).toContainEqual(
      expect.objectContaining({
        _id: expect.any(String),
        techs: [tech],
      })
    );
  });

  it('should be able to get a spot details', async () => {
    const {
      _id,
      company,
      price,
      techs,
      user: spot_user,
      thumbnail_url,
    } = await factory.create('Spot');

    const response = await request(app)
      .get(`/spots/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toStrictEqual({
      company,
      price,
      techs: [...techs],
      user: spot_user,
      thumbnail_url,
      bookings: [],
    });
  });

  it('should be able to create a spot', async () => {
    const file_path = path.resolve(__dirname, '..', 'files', 'example.jpg');
    const { company, techs, price } = await factory.attrs('Spot');

    if (fs.existsSync(file_path)) {
      const response = await request(app)
        .post('/spots')
        .set('Authorization', `Bearer ${token}`)
        .attach('thumbnail', file_path)
        .field('company', company)
        .field('price', price)
        .field('techs', techs.join(','));

      expect(response.body).toMatchObject({
        techs,
        user: user._id.toString(),
        company,
        price,
        _id: expect.any(String),
        thumbnail: expect.any(String),
      });
    } else {
      throw Error('File does not exists!');
    }
  });

  it('should not be able to store a new spot', async () => {
    const { company } = await factory.attrs('Spot');

    const response = await request(app)
      .post('/spots')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .send({
        company,
      });

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });

  it('should not be able to create a spot with a user that not exists', async () => {
    const file_path = path.resolve(__dirname, '..', 'files', 'example.jpg');
    const { company, techs, price } = await factory.attrs('Spot');

    if (fs.existsSync(file_path)) {
      await user.remove();

      const response = await request(app)
        .post('/spots')
        .expect(400)
        .set('Authorization', `Bearer ${token}`)
        .attach('thumbnail', file_path)
        .field('company', company)
        .field('price', price)
        .field('techs', techs.join(', '));

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: 'User does not exists',
      });
    } else {
      throw Error('File does not exists!');
    }
  });

  it('should be able to update a spot', async () => {
    const file_path = path.resolve(__dirname, '..', 'files', 'example.jpg');
    const spot = await factory.create('Spot', {
      user: user._id.toString(),
    });
    const { company, price, techs } = await factory.attrs('Spot');

    if (fs.existsSync(file_path)) {
      const response = await request(app)
        .put(`/spots/${spot._id}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('thumbnail', file_path)
        .field('company', company)
        .field('price', price)
        .field('techs', techs.join(','));

      expect(response.body).toMatchObject({
        techs,
        company,
        price: price.toString(),
        thumbnail: expect.anything(),
      });
    } else {
      throw Error('File does not exists!');
    }
  });

  it('should not be able to update a spot', async () => {
    const spot = await factory.create('Spot');

    const response = await request(app)
      .put(`/spots/${spot._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .send({
        company: faker.random.number(),
        price: faker.random.boolean(),
      });

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });

  it('should be able to delete a spot', async () => {
    const spot = await factory.create('Spot', {
      user: user._id,
    });

    const response = await request(app)
      .delete(`/spots/${spot._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toStrictEqual({
      ...spot.toJSON(),
      _id: spot._id.toString(),
      user: user._id.toString(),
    });
  });

  it('should not be able to delete a spot that not exists', async () => {
    const spot = await factory.create('Spot', {
      user: user._id,
    });
    await spot.remove();

    const response = await request(app)
      .delete(`/spots/${spot._id}`)
      .expect(400)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Spot does not exists',
    });
  });

  it('should not be able to delete a spot that has bookings approved', async () => {
    const spot = await factory.create('Spot', {
      user: user._id.toString(),
    });
    await factory.create('Booking', {
      spot: spot._id,
      approved: true,
    });

    const response = await request(app)
      .delete(`/spots/${spot._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toMatchObject({
      error: 'Unauthorized',
      message: 'You can not remove spot with bookings approved',
    });
  });
});
