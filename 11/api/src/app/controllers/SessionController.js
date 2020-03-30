import jwt from 'jsonwebtoken';

import connection from '../../database/connection';

class SessionController {
  async store(req, res) {
    const { id } = req.body;
    const ong = await connection('ongs').where('id', id).select('name').first();

    if (!ong) {
      return res.status(400).json({
        error: {
          message: 'ONG not found',
        },
      });
    }

    return res.json({
      ong,
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}

export default new SessionController();
