import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factories';
import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';
import jwtoken from '../utils/jwtoken';

let token;
let user;

describe('Dashboard', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();

    user = await factory.create('User');
    token = jwtoken(user.id);
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be get a list of spots of one user', async () => {
    const spots = await factory.createMany('Spot', 3, { user: user._id });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .send();

    spots.forEach(spot => {
      expect(response.body).toContainEqual(
        expect.objectContaining({
          _id: spot._id.toString(),
        })
      );
    });
  });
});
