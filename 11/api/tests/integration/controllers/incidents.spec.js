import request from 'supertest';
import faker from 'faker';

import app from '../../../src/app';
import closeRedis from '../../utils/close_redis';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import instance from '../../../src/database/redis';
import token from '../../utils/jwtoken';

describe('Incident', () => {
  const base_url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;
  let ong;
  let authorization;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    ong = await factory.attrs('Ong');
    await connection('ongs').insert(ong);

    authorization = `Bearer ${token(ong.id)}`;
  });

  afterAll(async () => {
    await connection.destroy();
    await closeRedis(instance);
  });

  it('should be able to get a page of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 5, {
      ong_id: ong.id,
    });
    await connection('incidents').insert(incidents);

    const response = await request(app).get('/v1/incidents').send();

    incidents.forEach((incident) => {
      expect(response.body).toContainEqual(
        expect.objectContaining({
          id: incident.id,
          title: incident.title,
          description: incident.description,
          value: incident.value,
          url: `${base_url}/incidents/${incident.id}`,
          ong: {
            id: incident.ong_id,
            name: ong.name,
            email: ong.email,
            whatsapp: ong.whatsapp,
            city: ong.city,
            uf: ong.uf,
            url: `${base_url}/ongs/${incident.ong_id}`,
          },
        })
      );
    });
  });

  it('should be able to get the second page of incidents', async () => {
    let incidents = await factory.attrsMany('Incident', 15, {
      ong_id: ong.id,
    });

    incidents = incidents.map((incident, index) => ({
      ...incident,
      id: index + 1,
    }));
    await connection('incidents').insert(incidents);

    const response = await request(app).get('/v1/incidents?page=2').send();

    incidents.slice(5, 10).forEach((incident) => {
      expect(response.body).toContainEqual({
        id: incident.id,
        title: incident.title,
        description: incident.description,
        value: incident.value,
        url: `${base_url}/incidents/${incident.id}`,
        ong: {
          id: incident.ong_id,
          name: ong.name,
          email: ong.email,
          whatsapp: ong.whatsapp,
          city: ong.city,
          uf: ong.uf,
          url: `${base_url}/ongs/${incident.ong_id}`,
        },
      });
    });
  });

  it('should be able to get an incident', async () => {
    const incident = await factory.attrs('Incident', { ong_id: ong.id });
    await connection('incidents').insert(incident);

    const response = await request(app)
      .get(`/v1/incidents/${incident.id}`)
      .send();

    expect(response.body).toStrictEqual({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      value: incident.value,
      url: `${base_url}/incidents/${incident.id}`,
      ong: {
        id: incident.ong_id,
        url: `${base_url}/ongs/${incident.ong_id}`,
      },
    });
  });

  it('should not be able to get an incident that not exists', async () => {
    const id = faker.random.number();

    const response = await request(app)
      .get(`/v1/incidents/${id}`)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      error: {
        message: 'Incident not found',
      },
    });
  });

  it('should be able to create a new incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');
    const response = await request(app)
      .post('/v1/incidents')
      .set('Authorization', authorization)
      .send({ title, description, value });

    expect(response.body).toHaveProperty('id');
  });

  it('should be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident', { ong_id: ong.id });
    await connection('incidents').insert(incident);

    await request(app)
      .delete(`/v1/incidents/${incident.id}`)
      .set('Authorization', authorization)
      .expect(204)
      .send();
  });

  it('should not be able to delete an incident that not exists', async () => {
    const { id } = await factory.attrs('Incident', { ong_id: ong.id });

    const response = await request(app)
      .delete(`/v1/incidents/${id}`)
      .set('Authorization', authorization)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      error: {
        message: 'Incident not found',
      },
    });
  });

  it('should not be able to delete an incident from another ONG', async () => {
    const incident = await factory.attrs('Incident');
    await connection('incidents').insert({ ...incident, ong_id: ong.id });

    const response = await request(app)
      .delete(`/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token(incident.ong_id)}`)
      .expect(401)
      .send();

    expect(response.body).toStrictEqual({
      error: {
        message: 'This incident is not owned by your ONG',
      },
    });
  });
});
