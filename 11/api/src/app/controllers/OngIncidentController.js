import connection from '../../database/connection';
import PaginationLinks from '../services/PaginationLinks';

class OngIncidentController {
  async index(req, res) {
    const { resource_url, ong_id } = req;
    const { page = 1 } = req.query;
    const limit = 5;

    const incidents = await connection('incidents')
      .where('ong_id', ong_id)
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

    const [count] = await connection('incidents')
      .where('ong_id', ong_id)
      .count();
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
}

export default new OngIncidentController();
