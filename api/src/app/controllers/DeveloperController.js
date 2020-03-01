import jwt from 'jsonwebtoken';

import Api from '../services/Api';
import Developer from '../models/Developer';
import DeveloperExists from '../services/DeveloperExists';

class DeveloperController {
  async index(req, res) {
    const { user_id } = req;

    const user = await DeveloperExists.run({ id: user_id });
    const developers = await Developer.find({
      $and: [
        { _id: { $ne: user_id } },
        { _id: { $nin: user.likes } },
        { _id: { $nin: user.dislikes } },
      ],
    });

    return res.json(developers);
  }

  async show(req, res) {
    const { avatar, name } = await DeveloperExists.run({ id: req.params.id });
    return res.json({ avatar, name });
  }

  async store(req, res) {
    const user = req.body.username.toLowerCase();

    let developer = await Developer.findOne({ user });
    if (!developer) {
      const { data } = await Api.get(`users/${user}`);
      const { name, bio, avatar_url: avatar } = data;

      developer = await Developer.create({ name, user, bio, avatar });
    }

    return res.json({
      developer,
      token: jwt.sign({ id: developer._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}

export default new DeveloperController();
