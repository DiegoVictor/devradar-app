import connection from '../../database/connection';

class IncidentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
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

    return res.json(incidents);
  }

  async store(req, res) {
    const { title, description, value } = req.body;
    const { authorization: ong_id } = req.headers;

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
    const { authorization: ong_id } = req.headers;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({
        error: {
          message: 'This incident is not owned by your NGO',
        },
      });
    }

    await connection('incidents').where('id', id).delete();

    return res.sendStatus(204);
  }
}

export default new IncidentController();
