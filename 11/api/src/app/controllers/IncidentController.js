import connection from '../../database/connection';
import PaginationLinks from '../services/PaginationLinks';

class IncidentController {
  async index(req, res) {
    const { resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;
    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf',
      ]);

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
      return res.status(404).json({
        error: {
          message: 'Incident not found',
        },
      });
    }

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({
        error: {
          message: 'This incident is not owned by your ONG',
        },
      });
    }

    await connection('incidents').where('id', id).delete();

    return res.sendStatus(204);
  }
}

export default new IncidentController();
