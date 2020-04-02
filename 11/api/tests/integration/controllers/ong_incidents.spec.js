import request from 'supertest';
import crypto from 'crypto';

import app from '../../../src/app';
import closeRedis from '../../utils/close_redis';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import instance from '../../../src/database/redis';
import token from '../../utils/jwtoken';

describe("ONG's Incidents", () => {
  const base_url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
    await closeRedis(instance);
  });

  it("should be able to get ONG's incidents", async () => {
    const ong = await factory.attrs('Ong', {
      id: crypto.randomBytes(4).toString('HEX'),
    });
    await connection('ongs').insert(ong);

    let incidents = await factory.attrsMany('Incident', 10, {
      ong_id: ong.id,
    });
    incidents = incidents.map((incident, index) => ({
      ...incident,
      id: index + 1,
    }));
    await connection('incidents').insert(incidents);

    const response = await request(app)
      .get('/v1/ong_incidents')
      .set('Authorization', `Bearer ${token(ong.id)}`)
      .send();

    incidents.slice(0, 5).forEach(({ id, title, description, value }) => {
      expect(response.body).toContainEqual(
        expect.objectContaining({
          id,
          description,
          title,
          value,
          url: `${base_url}/incidents/${id}`,
          ong: {
            id: ong.id,
            url: `${base_url}/ongs/${ong.id}`,
          },
        })
      );
    });
  });
});
