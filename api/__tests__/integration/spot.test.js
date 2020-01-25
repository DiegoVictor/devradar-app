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

describe('Spot', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
    await Booking.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of spots', async () => {
    const tech = faker.random.word();

    await factory.createMany('Spot', 3, { techs: [tech] });

    const response = await request(app)
      .get(`/spots?tech=${tech}`)
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
      user,
      thumbnail_url,
    } = await factory.create('Spot');

    const response = await request(app)
      .get(`/spots/${_id}`)
      .send();

    expect(response.body).toStrictEqual({
      company,
      price,
      techs: [...techs],
      user,
      thumbnail_url,
      bookings: [],
    });
  });

  it('should be able to create a spot', async () => {
    const { _id } = await factory.create('User');
    const file_path = path.resolve(__dirname, '..', 'files', 'example.jpg');
    const { company, techs, price } = await factory.attrs('Spot');

    if (fs.existsSync(file_path)) {
      const response = await request(app)
        .post('/spots')
        .set('user_id', _id)
        .attach('thumbnail', file_path)
        .field('company', company)
        .field('price', price)
        .field('techs', techs.join(','));

      expect(response.body).toMatchObject({
        techs,
        user: _id.toString(),
        company,
        price,
        _id: expect.any(String),
        thumbnail: expect.any(String),
      });
    } else {
      throw Error('File does not exists!');
    }
  });

  it('should be able to fail on validation while creating', async () => {
    const { _id } = await factory.create('User');
    const { company, techs } = await factory.attrs('Spot');

    const response = await request(app)
      .post('/spots')
      .set('user_id', _id)
      .send({
        company,
        techs,
      });

    expect(response.body).toMatchObject({
      error: 'Validation fails',
    });
  });

  it('should not be able to create a spot with a user that not exists', async () => {
    const user = await factory.create('User');
    const file_path = path.resolve(__dirname, '..', 'files', 'example.jpg');
    const { company, techs, price } = await factory.attrs('Spot');

    if (fs.existsSync(file_path)) {
      await user.remove();

      const response = await request(app)
        .post('/spots')
        .set('user_id', user._id)
        .attach('thumbnail', file_path)
        .field('company', company)
        .field('price', price)
        .field('techs', techs);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        error: 'User does not exists',
      });
    } else {
      throw Error('File does not exists!');
    }
  });

  it('should be able to update a spot', async () => {
    const { _id } = await factory.create('User');
    const file_path = path.resolve(__dirname, '..', 'files', 'example.jpg');
    const spot = await factory.create('Spot');
    const { company, price, techs } = await factory.attrs('Spot');

    if (fs.existsSync(file_path)) {
      const response = await request(app)
        .put(`/spots/${spot._id}`)
        .set('user_id', _id)
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

  it('should be able to update a spot', async () => {
    const { _id } = await factory.create('User');
    const spot = await factory.create('Spot');

    const response = await request(app)
      .put(`/spots/${spot._id}`)
      .set('user_id', _id)
      .send({
        company: faker.random.number(),
        price: faker.random.boolean(),
      });

    expect(response.body).toMatchObject({
      error: 'Validation fails',
    });
  });

  it('should be able to delete a spot', async () => {
    const { _id } = await factory.create('User');
    const spot = await factory.create('Spot', {
      user: _id,
    });

    const response = await request(app)
      .delete(`/spots/${spot._id}`)
      .set('user_id', _id);

    expect(response.body).toStrictEqual({
      ...spot.toJSON(),
      _id: spot._id.toString(),
      user: spot.user.toString(),
    });
  });

  it('should not be able to delete a spot that not exists', async () => {
    const { _id } = await factory.create('User');
    const spot = await factory.create('Spot', {
      user: _id,
    });
    await spot.remove();

    const response = await request(app)
      .delete(`/spots/${spot._id}`)
      .set('user_id', _id);

    expect(response.body).toStrictEqual({
      error: 'Spot does not exists',
    });
  });

  it('should not be able to delete a spot that has bookings approved', async () => {
    const { _id } = await factory.create('User');
    const spot = await factory.create('Spot', {
      user: _id.toString(),
    });
    await factory.create('Booking', {
      spot: spot._id,
      approved: true,
    });

    const response = await request(app)
      .delete(`/spots/${spot._id}`)
      .set('user_id', _id);

    expect(response.body).toStrictEqual({
      error: 'You can not remove spot with bookings approved',
    });
  });
});
