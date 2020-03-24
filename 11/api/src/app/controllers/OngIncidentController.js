import connection from '../../database/connection';

class OngIncidentController {
  async index(req, res) {
    const { authorization: ong_id } = req.headers;
    const incidents = await connection('incidents')
      .where('ong_id', ong_id)
      .select('*');

    return res.json(incidents);
  }
}

export default new OngIncidentController();
