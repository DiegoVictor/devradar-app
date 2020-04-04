import request from 'supertest';
import faker from 'faker';
import { notFound, unauthorized } from '@hapi/boom';

import app from '../../../src/app';
import closeRedis from '../../utils/close_redis';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import instance from '../../../src/database/redis';
import token from '../../utils/jwtoken';

describe('Incident', () => {
  const base_url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;
  let ngo;
  let authorization;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    ngo = await factory.attrs('Ngo');
    await connection('ngos').insert(ngo);

    authorization = `Bearer ${token(ngo.id)}`;
  });

  afterAll(async () => {
    await connection.destroy();
    await closeRedis(instance);
  });

  it('should be able to get a page of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 5, {
      ngo_id: ngo.id,
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
          ngo: {
            id: incident.ngo_id,
            name: ngo.name,
            email: ngo.email,
            whatsapp: ngo.whatsapp,
            city: ngo.city,
            uf: ngo.uf,
            url: `${base_url}/ngos/${incident.ngo_id}`,
          },
        })
      );
    });
  });

  it('should be able to get the second page of incidents', async () => {
    let incidents = await factory.attrsMany('Incident', 15, {
      ngo_id: ngo.id,
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
        ngo: {
          id: incident.ngo_id,
          name: ngo.name,
          email: ngo.email,
          whatsapp: ngo.whatsapp,
          city: ngo.city,
          uf: ngo.uf,
          url: `${base_url}/ngos/${incident.ngo_id}`,
        },
      });
    });
  });

  it('should be able to get an incident', async () => {
    const incident = await factory.attrs('Incident', { ngo_id: ngo.id });
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
      ngo: {
        id: incident.ngo_id,
        url: `${base_url}/ngos/${incident.ngo_id}`,
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
      ...notFound('Incident not found').output.payload,
      docs: process.env.DOCS_URL,
      code: 144,
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
    const incident = await factory.attrs('Incident', { ngo_id: ngo.id });
    await connection('incidents').insert(incident);

    await request(app)
      .delete(`/v1/incidents/${incident.id}`)
      .set('Authorization', authorization)
      .expect(204)
      .send();
  });

  it('should not be able to delete an incident that not exists', async () => {
    const { id } = await factory.attrs('Incident', { ngo_id: ngo.id });

    const response = await request(app)
      .delete(`/v1/incidents/${id}`)
      .set('Authorization', authorization)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      ...notFound('Incident not found').output.payload,
      docs: process.env.DOCS_URL,
      code: 144,
    });
  });

  it('should not be able to delete an incident from another NGO', async () => {
    const incident = await factory.attrs('Incident');
    await connection('incidents').insert({ ...incident, ngo_id: ngo.id });

    const response = await request(app)
      .delete(`/v1/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token(incident.ngo_id)}`)
      .expect(401)
      .send();

    const message = 'This incident is not owned by your NGO';
    expect(response.body).toStrictEqual({
      ...unauthorized(message).output.payload,
      attributes: {
        code: 141,
        error: message,
      },
      docs: process.env.DOCS_URL,
    });
  });
});
