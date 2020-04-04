import request from 'supertest';
import crypto from 'crypto';
import { notFound } from '@hapi/boom';

import app from '../../../src/app';
import closeRedis from '../../utils/close_redis';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import instance from '../../../src/database/redis';

describe('NGO', () => {
  const base_url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
    await closeRedis(instance);
  });

  it('should be able to get a list of NGOs', async () => {
    let ngos = await factory.attrsMany('Ngo', 10);
    ngos = ngos.map((ngo, index) => ({ ...ngo, id: String(index + 1) }));
    await connection('ngos').insert(ngos);

    const response = await request(app).get('/v1/ngos').send();

    ngos.slice(0, 5).forEach((ngo) => {
      expect(response.body).toContainEqual({
        ...ngo,
        url: `${base_url}/ngos/${ngo.id}`,
        incidents_url: `${base_url}/ngo_incidents`,
      });
    });
  });

  it('should be able to get an NGO', async () => {
    const ngo = await factory.attrs('Ngo');
    await connection('ngos').insert(ngo);

    const response = await request(app).get(`/v1/ngos/${ngo.id}`).send();

    expect(response.body).toStrictEqual({
      ...ngo,
      url: `${base_url}/ngos/${ngo.id}`,
      incidents_url: `${base_url}/ngo_incidents`,
    });
  });

  it('should not be able to get an NGO that not exists', async () => {
    const id = crypto.randomBytes(4).toString('HEX');
    const response = await request(app).get(`/v1/ngos/${id}`).send();

    expect(response.body).toStrictEqual({
      ...notFound('NGO not found').output.payload,
      code: 244,
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to create a new NGO', async () => {
    const { name, email, whatsapp, city, uf } = await factory.attrs('Ngo');
    const response = await request(app)
      .post('/v1/ngos')
      .send({ name, email, whatsapp, city, uf });

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });
});
