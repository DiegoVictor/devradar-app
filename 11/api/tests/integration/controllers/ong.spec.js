import request from 'supertest';
import crypto from 'crypto';
import { notFound } from '@hapi/boom';

import app from '../../../src/app';
import closeRedis from '../../utils/close_redis';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import instance from '../../../src/database/redis';

describe('ONG', () => {
  const base_url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
    await closeRedis(instance);
  });

  it('should be able to get a list of ONGs', async () => {
    let ongs = await factory.attrsMany('Ong', 10);
    ongs = ongs.map((ong, index) => ({ ...ong, id: String(index + 1) }));
    await connection('ongs').insert(ongs);

    const response = await request(app).get('/v1/ongs').send();

    ongs.slice(0, 5).forEach((ong) => {
      expect(response.body).toContainEqual({
        ...ong,
        url: `${base_url}/ongs/${ong.id}`,
        incidents_url: `${base_url}/ong_incidents`,
      });
    });
  });

  it('should be able to get an ONG', async () => {
    const ong = await factory.attrs('Ong');
    await connection('ongs').insert(ong);

    const response = await request(app).get(`/v1/ongs/${ong.id}`).send();

    expect(response.body).toStrictEqual({
      ...ong,
      url: `${base_url}/ongs/${ong.id}`,
      incidents_url: `${base_url}/ong_incidents`,
    });
  });

  it('should not be able to get an ONG that not exists', async () => {
    const id = crypto.randomBytes(4).toString('HEX');
    const response = await request(app).get(`/v1/ongs/${id}`).send();

    expect(response.body).toStrictEqual({
      ...notFound('ONG not found').output.payload,
      code: 244,
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to create a new ONG', async () => {
    const { name, email, whatsapp, city, uf } = await factory.attrs('Ong');
    const response = await request(app)
      .post('/v1/ongs')
      .send({ name, email, whatsapp, city, uf });

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });
});
