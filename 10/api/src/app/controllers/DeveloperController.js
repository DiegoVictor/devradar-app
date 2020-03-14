import Developer from '../models/Developer';
import ExistsDeveloper from '../services/ExistsDeveloper';
import StoreDeveloper from '../services/StoreDeveloper';
import UpdateDeveloper from '../services/UpdateDeveloper';

class DeveloperController {
  async index(req, res) {
    return res.json(await Developer.find());
  }

  async store(req, res) {
    const { github_username } = req.body;

    let developer = await Developer.findOne({ github_username });
    if (!developer) {
      developer = await StoreDeveloper.run(req.body);
    }

    return res.json(developer);
  }

  async update(req, res) {
    const { id } = req.params;

    return res.json(
      await UpdateDeveloper.run({
        developer: await ExistsDeveloper.run({ id }),
        ...req.body,
      })
    );
  }

  async destroy(req, res) {
    const { id } = req.params;
    const developer = await ExistsDeveloper.run({ id });

    await developer.remove();

    return res.json(developer);
  }
}

export default new DeveloperController();
