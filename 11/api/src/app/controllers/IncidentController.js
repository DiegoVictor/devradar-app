import { notFound, unauthorized } from '@hapi/boom';

import connection from '../../database/connection';
import PaginationLinks from '../services/PaginationLinks';

class IncidentController {
  async index(req, res) {
    const { base_url, resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;

    let incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .select([
        'incidents.*',
        'ongs.id as ong_id',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf',
      ]);

    incidents = incidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      value: incident.value,
      url: `${resource_url}/${incident.id}`,
      ong: {
        id: incident.ong_id,
        name: incident.name,
        email: incident.email,
        whatsapp: incident.whatsapp,
        city: incident.city,
        uf: incident.uf,
        url: `${base_url}/v1/ongs/${incident.ong_id}`,
      },
    }));

    const [count] = await connection('incidents').count();
    res.header('X-Total-Count', count['count(*)']);

    const links = PaginationLinks.run({
      resource_url,
      page,
      pages_total: Math.ceil(count['count(*)'] / limit),
    });
    if (Object.keys(links).length > 0) {
      res.links(links);
    }

    return res.json(incidents);
  }

  async show(req, res) {
    const { base_url, resource_url } = req;
    const { id } = req.params;
    const incident = await connection('incidents').where('id', id).first();

    if (!incident) {
      throw notFound('Incident not found', { code: 144 });
    }

    return res.json({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      value: incident.value,
      url: resource_url,
      ong: {
        id: incident.ong_id,
        url: `${base_url}/v1/ongs/${incident.ong_id}`,
      },
    });
  }

  async store(req, res) {
    const { title, description, value } = req.body;
    const { ong_id } = req;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });

    return res.json({ id });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { ong_id } = req;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (!incident) {
      throw notFound('Incident not found', { code: 144 });
    }

    if (incident.ong_id !== ong_id) {
      throw unauthorized('This incident is not owned by your ONG', 'sample', {
        code: 141,
      });
    }

    await connection('incidents').where('id', id).delete();

    return res.sendStatus(204);
  }
}

export default new IncidentController();
