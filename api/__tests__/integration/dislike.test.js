import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import Developer from '../../src/app/models/Developer';

describe('Dislike', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to dislike an user', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);
    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.dislikes).toContain(dislike_user._id.toString());
  });

  it('should not be able to dislike an user', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);
    await user.delete();

    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toStrictEqual({
      error: 'Developer not exists',
    });
  });

  it('should not be able to dislike an user that not exists', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);
    dislike_user.remove();

    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toStrictEqual({
      error: 'Developer not exists!',
    });
  });

  it('should be able to dislike an user twice', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);

    user.dislikes.push(dislike_user._id);
    await user.save();

    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.dislikes).toContain(dislike_user._id.toString());
  });
});
