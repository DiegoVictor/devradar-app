import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import Developer from '../../src/app/models/Developer';
import jwtoken from '../utils/jwtoken';

describe('Match', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it("should be able to get a list of users' matches", async () => {
    const user = await factory.create('Developer');
    const developers = await factory.createMany('Developer', 3, {
      likes: [user._id],
    });
    const token = jwtoken(user.id);

    developers.forEach(({ _id }) => {
      user.likes.push(_id);
    });
    await user.save();

    const response = await request(app)
      .get('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.length).toBe(3);
    expect(Array.isArray(response.body)).toBe(true);
    developers.forEach(({ _id: id }) => {
      expect(response.body).toContainEqual(
        expect.objectContaining({
          _id: id.toString(),
        })
      );
    });
  });
});
