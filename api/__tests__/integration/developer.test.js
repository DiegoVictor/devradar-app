import request from 'supertest';
import MockAdapter from 'axios-mock-adapter';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import Developer from '../../src/app/models/Developer';
import Api from '../../src/app/services/Api';
import jwtoken from '../utils/jwtoken';

const api_mock = new MockAdapter(Api);

describe('Developer', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of developers', async () => {
    const [user] = await factory.createMany('Developer', 5);
    const token = jwtoken(user.id);
    const response = await request(app)
      .get('/developers')
      .set('Authorization', `Bearer ${token}`)
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
    const token = jwtoken(user.id);
    await user.delete();

    const response = await request(app)
      .get('/developers')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .send();

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Developer not exists',
    });
  });

  it('should be able to get a developer', async () => {
    const user = await factory.create('Developer');
    const token = jwtoken(user.id);
    const response = await request(app)
      .get(`/developers/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toStrictEqual({
      avatar: user.avatar,
      name: user.name,
    });
  });

  it('should be able to store a new developer', async () => {
    const { user, name, bio, avatar } = await factory.attrs('Developer');

    api_mock.onGet().reply(200, { name, bio, avatar_url: avatar });

    const response = await request(app)
      .post('/developers')
      .send({ username: user });

    expect(response.body).toMatchObject({
      developer: {
        name,
        user: user.toLowerCase(),
        bio,
        avatar,
      },
      token: expect.any(String),
    });
  });

  it('should not be able to store a new developer', async () => {
    const response = await request(app)
      .post('/developers')
      .send();

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });
});
