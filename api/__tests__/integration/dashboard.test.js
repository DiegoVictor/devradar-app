import request from 'supertest';

import app from '../../src/app';
import factory from '../utils/factories';
import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';

describe('Dashboard', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Spot.deleteMany();
  });

  it('should be get a list of spots of one user', async () => {
    const { _id } = await factory.create('User');
    const spots = await factory.createMany('Spot', 3, { user: _id });

    const response = await request(app)
      .get('/dashboard')
      .set('user_id', _id)
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
