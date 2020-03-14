import request from 'supertest';
import Mongoose from 'mongoose';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';

import '../utils/extend';
import app from '../../src/app';
import Api from '../../src/app/services/Api';
import factory from '../utils/factory';
import Developer from '../../src/app/models/Developer';
import { to, emit } from '../../__mocks__/socket.io';
import Connection from '../../src/app/models/Connection';

const api_mock = new MockAdapter(Api);

describe('Developer', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of developers', async () => {
    const developers = await factory.createMany('Developer', 3);

    const { body } = await request(app)
      .get('/developers')
      .send();

    expect(Array.isArray(body)).toBe(true);
    developers.forEach(dev => {
      expect(body).toContainEqual(
        expect.objectContaining({
          _id: dev._id.toString(),
        })
      );
    });
  });

  it('should be able to store a developer', async () => {
    const {
      name,
      bio,
      avatar_url,
      github_username,
      techs,
      location,
    } = await factory.attrs('Developer');
    const [longitude, latitude] = location.coordinates;

    api_mock
      .onGet(`https://api.github.com/users/${github_username}`)
      .reply(200, {
        login: faker.internet.userName(),
        name,
        avatar_url,
        bio,
      });

    const { body } = await request(app)
      .post('/developers')
      .send({ github_username, techs: techs.join(', '), latitude, longitude });

    expect(body).toMatchObject({
      github_username,
      techs,
      location: {
        coordinates: [longitude, latitude],
      },
    });
  });

  it('should not be able to store a developer with wrong params', async () => {
    const { body } = await request(app)
      .post('/developers')
      .expect(400)
      .send();

    expect(body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });

  it('should be able to emit a new developer', async () => {
    const {
      name,
      bio,
      avatar_url,
      github_username,
      techs,
      location,
    } = await factory.attrs('Developer');
    const [longitude, latitude] = location.coordinates;
    const { socket_id } = await Connection.create({
      socket_id: faker.random.number(),
      coordinates: { longitude, latitude },
      techs,
    });

    api_mock
      .onGet(`https://api.github.com/users/${github_username}`)
      .reply(200, {
        login: faker.internet.userName(),
        name,
        avatar_url,
        bio,
      });

    await request(app)
      .post('/developers')
      .send({ github_username, techs: techs.join(', '), latitude, longitude });

    expect(to).toHaveBeenCalledWith(socket_id);
    expect(emit).toHaveBeenCalledWithMatch('new_developers', {
      name,
      bio,
      avatar_url,
      github_username,
      techs,
      location,
    });
  });

  it('should be able to update a developer', async () => {
    const { _id } = await factory.create('Developer');
    const { name, avatar_url, bio, techs } = await factory.attrs('Developer');

    const { body } = await request(app)
      .put(`/developers/${_id}`)
      .send({ techs: techs.join(', '), name, avatar_url, bio });

    expect(body).toMatchObject({
      _id: _id.toString(),
      name,
      bio,
      avatar_url,
      techs,
    });
  });

  it('should not be able to update a developer with wrong params', async () => {
    const { _id } = await factory.create('Developer');

    const { body } = await request(app)
      .put(`/developers/${_id}`)
      .expect(400)
      .send({
        techs: faker.random.number(),
        name: faker.random.boolean(),
      });

    expect(body).toMatchObject({
      error: 'Bad Request',
      message: 'Validation fails',
    });
  });

  it('should not be able to update a developer that not exists', async () => {
    const developer = await factory.create('Developer');
    await developer.remove();

    const { body } = await request(app)
      .put(`/developers/${developer._id}`)
      .expect(400)
      .send({ name: faker.name.findName() });

    expect(body).toMatchObject({
      error: 'Bad Request',
      message: 'Developer does not exists',
    });
  });

  it('should be able to delete a developer', async () => {
    const { _id } = await factory.create('Developer');

    const { body } = await request(app).delete(`/developers/${_id}`);

    expect(body).toMatchObject({
      _id: _id.toString(),
    });
    expect(await Developer.findById(_id)).toBeNull();
  });

  it('should not be able to delete a developer that not exists', async () => {
    const developer = await factory.create('Developer');
    await developer.remove();

    const { body } = await request(app)
      .delete(`/developers/${developer._id}`)
      .expect(400)
      .send();

    expect(body).toMatchObject({
      error: 'Bad Request',
      message: 'Developer does not exists',
    });
  });
});
