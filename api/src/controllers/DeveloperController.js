import Axios from 'axios';
import Developer from '../models/Developers';

class DeveloperController {
  async index(req, res) {
    const { user: authenticated_user_id } = req.headers;

    const authenticated_developer = await Developer.findById(authenticated_user_id);
    const developers = await Developer.find({
      $and: [
        { _id: { $ne: authenticated_user_id }},
        { _id: { $nin: authenticated_developer.likes }},
        { _id: { $nin: authenticated_developer.dislikes }}
      ]
    });

  }

  async show(req, res) {
    const { avatar, name } = await Developer.findById(req.params.id);
  }

  async store(req, res) {
    const username = req.body.username.toLowerCase();

    let developer = await Developer.findOne({ user: username });

    if (!developer) {
      const response = await Axios.get(
        `https://api.github.com/users/${username}`
      );
      const { name, bio, avatar_url: avatar} = response.data;
  
      developer = await Developer.create({
        name,
        user: username,
        bio,
        avatar
      });
    }

  }
  }

export default new DeveloperController();
