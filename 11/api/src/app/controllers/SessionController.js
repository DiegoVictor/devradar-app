import jwt from 'jsonwebtoken';
import { badRequest } from '@hapi/boom';

import connection from '../../database/connection';

class SessionController {
  async store(req, res) {
    const { id } = req.body;
    const ngo = await connection('ngos').where('id', id).select('name').first();

    if (!ngo) {
      throw badRequest('Your NGO was not found', { code: 240 });
    }

    return res.json({
      ngo,
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}

export default new SessionController();
