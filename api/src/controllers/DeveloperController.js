import axios from 'axios';
import Developer from '../models/Developers';

class DeveloperController {
  async index(req, res) {
    const { user_id } = req.headers;

    const user = await Developer.findById(user_id);
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
    const { avatar, name } = await Developer.findById(req.params.id);
    return res.json({ avatar, name });
  }

  async store(req, res) {
    const username = req.body.username.toLowerCase();

    let developer = await Developer.findOne({ user: username });

    if (!developer) {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const { name, bio, avatar_url: avatar } = response.data;

      developer = await Developer.create({
        name,
        user: username,
        bio,
        avatar,
      });
    }

    return res.json(developer);
  }
}

export default new DeveloperController();
