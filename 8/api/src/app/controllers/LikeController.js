import DeveloperExists from '../services/DeveloperExists';
import MatchDevelopers from '../services/MatchDevelopers';

class LikeController {
  async store(req, res) {
    const { user_id } = req;
    const liked_developer = await DeveloperExists.run({
      id: req.params.liked_user_id,
    });
    const developer = await DeveloperExists.run({ id: user_id });

    await MatchDevelopers.run({ developer, liked_developer });

    if (!developer.likes.includes(liked_developer._id)) {
      developer.likes.push(liked_developer._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default new LikeController();
