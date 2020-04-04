import request from 'supertest';
import crypto from 'crypto';
import { badRequest } from '@hapi/boom';

import app from '../../../src/app';
import closeRedis from '../../utils/close_redis';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import instance from '../../../src/database/redis';

describe('Session', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
    await closeRedis(instance);
  });

  it('should be able to logon', async () => {
    const ngo = await factory.attrs('Ngo');
    ngo.id = crypto.randomBytes(4).toString('HEX');

    await connection('ngos').insert(ngo);

    const response = await request(app)
      .post('/v1/sessions')
      .send({ id: ngo.id });

    expect(response.body).toStrictEqual({
      ngo: { name: ngo.name },
      token: expect.any(String),
    });
  });

  it('should not be able to logon with an ngo that not exists', async () => {
    const id = crypto.randomBytes(4).toString('HEX');

    const response = await request(app)
      .post('/v1/sessions')
      .expect(400)
      .send({ id });

    expect(response.body).toStrictEqual({
      ...badRequest('Your NGO was not found').output.payload,
      code: 240,
      docs: process.env.DOCS_URL,
    });
  });
});
