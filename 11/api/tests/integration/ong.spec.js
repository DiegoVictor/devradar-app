import request from 'supertest';

import app from '../../src/app';
import connection from '../../src/database/connection';
import factory from '../utils/factory';

describe('ONG', () => {
  let ongs = [];

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    ongs = await factory.attrsMany('Ong', 5);
    await connection('ongs').insert(ongs);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to get a list of ONGs', async () => {
    const response = await request(app).get('/ongs').send();

    ongs.forEach((ong) => {
      expect(response.body).toContainEqual(expect.objectContaining(ong));
    });
  });

  it('should be able to create a new ONG', async () => {
    const { name, email, whatsapp, city, uf } = await factory.attrs('Ong');
    const response = await request(app)
      .post('/ongs')
      .send({ name, email, whatsapp, city, uf });

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });
});
