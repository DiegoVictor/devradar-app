import connection from '../../database/connection';
import generateUniqueId from '../../utils/generateUniqueId';
import PaginationLinks from '../services/PaginationLinks';

class OngController {
  async index(req, res) {
    const { resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;
    const ongs = await connection('ongs')
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

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

  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
    const id = generateUniqueId();
    await connection('ongs').insert({ id, name, email, whatsapp, city, uf });

    return res.json({ id });
  }
}

export default new OngController();
