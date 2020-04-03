import { notFound } from '@hapi/boom';

import connection from '../../database/connection';
import generateUniqueId from '../../utils/generateUniqueId';
import PaginationLinks from '../services/PaginationLinks';

class OngController {
  async index(req, res) {
    const { base_url, resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;
    let ongs = await connection('ongs')
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

    ongs = ongs.map((ong) => ({
      ...ong,
      url: `${resource_url}/${ong.id}`,
      incidents_url: `${base_url}/v1/ong_incidents`,
    }));

    const [count] = await connection('ongs').count();
    res.header('X-Total-Count', count['count(*)']);

    const links = PaginationLinks.run({
      resource_url,
      page,
      pages_total: Math.ceil(count['count(*)'] / limit),
    });
    if (Object.keys(links).length > 0) {
      res.links(links);
    }

    return res.json(ongs);
  }

  async show(req, res) {
    const { base_url, resource_url } = req;
    const { id } = req.params;
    const ong = await connection('ongs').where('id', id).first();

    if (!ong) {
      throw notFound('ONG not found', { code: 244 });
    }

    return res.json({
      ...ong,
      url: resource_url,
      incidents_url: `${base_url}/v1/ong_incidents`,
    });
  }

  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
    const id = generateUniqueId();
    await connection('ongs').insert({ id, name, email, whatsapp, city, uf });

    return res.json({ id });
  }
}

export default new OngController();
