import DeveloperExists from '../services/DeveloperExists';

class DislikeController {
  async store(req, res) {
    const { user_id } = req;
    const disliked_developer = await DeveloperExists.run({
      id: req.params.disliked_user_id,
    });
    const developer = await DeveloperExists.run({ id: user_id });

    if (!developer.dislikes.includes(disliked_developer._id)) {
      developer.dislikes.push(disliked_developer._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default new DislikeController();
