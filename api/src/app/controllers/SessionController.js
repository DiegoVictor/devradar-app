import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    return res.json({
      user,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}

export default new SessionController();
