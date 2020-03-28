import request from 'supertest';
import crypto from 'crypto';

import factory from '../utils/factory';
import connection from '../../src/database/connection';
import app from '../../src/app';

describe('Session', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to logon', async () => {
    const ong = await factory.attrs('Ong');
    ong.id = crypto.randomBytes(4).toString('HEX');

    await connection('ongs').insert(ong);

    const response = await request(app).post('/sessions').send({ id: ong.id });

    expect(response.body).toStrictEqual({ name: ong.name });
  });

  it('should not be able to logon with an ong that not exists', async () => {
    const id = crypto.randomBytes(4).toString('HEX');

    const response = await request(app)
      .post('/sessions')
      .expect(400)
      .send({ id });

    expect(response.body).toStrictEqual({
      error: { message: 'ONG not found' },
    });
  });
});
