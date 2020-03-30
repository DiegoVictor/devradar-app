import request from 'supertest';
import crypto from 'crypto';

import app from '../../src/app';
import connection from '../../src/database/connection';
import factory from '../utils/factory';
import token from '../utils/jwtoken';

describe("ONG's Incidents", () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be able to get ONG's incidents", async () => {
    const ong = await factory.attrs('Ong', {
      id: crypto.randomBytes(4).toString('HEX'),
    });
    await connection('ongs').insert(ong);

    const incidents = await factory.attrsMany('Incident', 1, {
      ong_id: ong.id,
    });
    await connection('incidents').insert(incidents);

    const response = await request(app)
      .get('/ong_incidents')
      .set('Authorization', `Bearer ${token(ong.id)}`)
      .send();

    incidents.forEach((incident) => {
      expect(response.body).toContainEqual(expect.objectContaining(incident));
    });
  });
});
