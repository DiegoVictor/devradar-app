import axios from 'axios';

import Api from '../services/Api';
import Developer from '../models/Developer';
import DeveloperExists from '../services/DeveloperExists';

class DeveloperController {
  async index(req, res) {
    const { user_id } = req.headers;

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

      developer = await Developer.create({
        name,
        user,
        bio,
        avatar,
      });
    }

    return res.json(developer);
  }
}

export default new DeveloperController();
