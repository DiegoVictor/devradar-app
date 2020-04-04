import { notFound, unauthorized } from '@hapi/boom';

import connection from '../../database/connection';
import PaginationLinks from '../services/PaginationLinks';

class IncidentController {
  async index(req, res) {
    const { base_url, resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;

    let incidents = await connection('incidents')
      .join('ngos', 'ngos.id', '=', 'incidents.ngo_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .select([
        'incidents.*',
        'ngos.id as ngo_id',
        'ngos.name',
        'ngos.email',
        'ngos.whatsapp',
        'ngos.city',
        'ngos.uf',
      ]);

    incidents = incidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      value: incident.value,
      url: `${resource_url}/${incident.id}`,
      ngo: {
        id: incident.ngo_id,
        name: incident.name,
        email: incident.email,
        whatsapp: incident.whatsapp,
        city: incident.city,
        uf: incident.uf,
        url: `${base_url}/v1/ngos/${incident.ngo_id}`,
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
      ngo: {
        id: incident.ngo_id,
        url: `${base_url}/v1/ngos/${incident.ngo_id}`,
      },
    });
  }

  async store(req, res) {
    const { title, description, value } = req.body;
    const { ngo_id } = req;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ngo_id,
    });

    return res.json({ id });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { ngo_id } = req;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ngo_id')
      .first();

    if (!incident) {
      throw notFound('Incident not found', { code: 144 });
    }

    if (incident.ngo_id !== ngo_id) {
      throw unauthorized('This incident is not owned by your NGO', 'sample', {
        code: 141,
      });
    }

    await connection('incidents').where('id', id).delete();

    return res.sendStatus(204);
  }
}

export default new IncidentController();
