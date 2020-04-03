import jwt from 'jsonwebtoken';
import { badRequest } from '@hapi/boom';

import connection from '../../database/connection';

class SessionController {
  async store(req, res) {
    const { id } = req.body;
    const ong = await connection('ongs').where('id', id).select('name').first();

    if (!ong) {
      throw badRequest('Your ONG was not found', { code: 240 });
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
