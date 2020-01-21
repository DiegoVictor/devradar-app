import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import Developer from '../../src/app/models/Developer';

describe('Developer', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of developers', async () => {
    const [user] = await factory.createMany('Developer', 5);
    const response = await request(app)
      .get('/developers')
      .set('user_id', user._id)
      .send();

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toContainEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
  });

  it('should not be able to get a list of developers', async () => {
    const [user] = await factory.createMany('Developer', 5);
    await user.delete();

    const response = await request(app)
      .get('/developers')
      .set('user_id', user._id)
      .send();

    expect(response.body).toStrictEqual({
      error: 'User not exists',
    });
  });

  it('should be able to get a developer', async () => {
    const user = await factory.create('Developer');
    const response = await request(app)
      .get(`/developers/${user._id}`)
      .send();

    expect(response.body).toStrictEqual({
      avatar: user.avatar,
      name: user.name,
    });
  });

  it('should be able to store a new developer', async () => {
    const { user, name, bio, avatar } = await factory.attrs('Developer');

    axios.get = jest.fn(() => {
      return new Promise(resolve => {
        resolve({
          data: {
            name,
            bio,
            avatar_url: avatar,
          },
        });
      });
    });

    const response = await request(app)
      .post('/developers')
      .send({ username: user });

    expect(response.body).toMatchObject({
      name,
      user: user.toLowerCase(),
      bio,
      avatar,
    });
  });
});
