import axios from 'axios';

import Developer from '../models/Developer';
import parseStringAsArray from '../helpers/parseStringAsArray';

class DeveloperController {
  async index(req, res) {
    const developers = await Developer.find();
    res.json(developers);
  }

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let developer = await Developer.findOne({ github_username });
    if (!developer) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );
      const { name = login, avatar_url, bio } = response.data;

      const techs_array = parseStringAsArray(techs);
      developer = await Developer.create({
        name,
        avatar_url,
        bio,
        github_username,
        techs: techs_array,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      });
    }

    return res.json(developer);
  }

  async update(req, res) {
    const { id } = req.params;
    const { techs } = req.body;

    let developer = await Developer.findById(id);
    if (!developer) {
      return res.status(400).json({
        error: 'Developer does not exists',
      });
    }

    if (typeof techs === 'string') {
      developer.techs = parseStringAsArray.run(techs);
    }

    ['name', 'avatar_url', 'bio'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        developer[field] = req.body[field];
      }
    });

    return res.json(await developer.save());
  }

  async destroy(req, res) {
    const { id } = req.params;

    const developer = await Developer.findById(id);
    if (!developer) {
      return res.status(400).json({
        error: 'Developer does not exists',
      });
    }

    await developer.remove();
    return res.json(developer);
  }
}

export default new DeveloperController();
