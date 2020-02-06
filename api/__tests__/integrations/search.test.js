import request from 'supertest';
import Mongoose from 'mongoose';
import faker from 'faker';

import app from '../../src/app';
import factory from '../utils/factories';
import Developer from '../../src/app/models/Developer';

describe('Search', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of next developers', async () => {
    const techs = faker.lorem.word();
    const longitude = faker.address.longitude();
    const latitude = faker.address.latitude();

    const developers = await factory.createMany('Developer', 3, {
      techs: [techs],
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    const { body } = await request(app).get(
      `/search?latitude=${latitude}&longitude=${longitude}&techs=${techs}`
    );

    expect(Array.isArray(body)).toBe(true);
    developers.forEach(dev => {
      expect(body).toContainEqual(
        expect.objectContaining({
          _id: dev._id.toString(),
        })
      );
    });
  });

  it('should not be able to search', async () => {
    const techs = faker.lorem.word();
    const longitude = faker.address.longitude();
    const latitude = faker.address.latitude();

    await factory.createMany('Developer', 3, {
      techs: [techs],
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    const { body } = await request(app)
      .get(`/search?longitude=${longitude}&techs=${techs}`)
      .expect(400);

    expect(body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });
});
