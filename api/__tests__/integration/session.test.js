import request from 'supertest';

import app from '../../src/app';
import factory from '../utils/factories';
import User from '../../src/app/models/User';

describe('Session', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  it('should be able to authenticate user', async () => {
    const { _id, email } = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({ email });

    expect(response.body).toMatchObject({ _id: _id.toString(), email });
  });

  it('should be able to authenticate with new user', async () => {
    const { email } = await factory.attrs('User');

    const response = await request(app)
      .post('/sessions')
      .send({ email });

    expect(response.body).toMatchObject({ email });
  });

  it('should fail in validation', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Validation fails' });
  });
});
