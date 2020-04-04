import { notFound } from '@hapi/boom';

import connection from '../../database/connection';
import generateUniqueId from '../../utils/generateUniqueId';
import PaginationLinks from '../services/PaginationLinks';

class NgoController {
  async index(req, res) {
    const { base_url, resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;
    let ngos = await connection('ngos')
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

    ngos = ngos.map((ngo) => ({
      ...ngo,
      url: `${resource_url}/${ngo.id}`,
      incidents_url: `${base_url}/v1/ngo_incidents`,
    }));

    const [count] = await connection('ngos').count();
    res.header('X-Total-Count', count['count(*)']);

    const links = PaginationLinks.run({
      resource_url,
      page,
      pages_total: Math.ceil(count['count(*)'] / limit),
    });
    if (Object.keys(links).length > 0) {
      res.links(links);
    }

    return res.json(ngos);
  }

  async show(req, res) {
    const { base_url, resource_url } = req;
    const { id } = req.params;
    const ngo = await connection('ngos').where('id', id).first();

    if (!ngo) {
      throw notFound('NGO not found', { code: 244 });
    }

    return res.json({
      ...ngo,
      url: resource_url,
      incidents_url: `${base_url}/v1/ngo_incidents`,
    });
  }

  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
    const id = generateUniqueId();
    await connection('ngos').insert({ id, name, email, whatsapp, city, uf });

    return res.json({ id });
  }
}

export default new NgoController();
