import Developer from '../models/Developer';

class DislikeController {
  async store(req, res) {
    const { disliked_user_id } = req.params;
    const { user_id } = req.headers;

    const disliked_developer = await Developer.findById(disliked_user_id);
    if (!disliked_developer) {
      return res.status(400).json({
        error: 'Developer not exist!',
      });
    }

    const developer = await Developer.findById(user_id);

    if (!developer.dislikes.includes(disliked_developer._id)) {
      developer.dislikes.push(disliked_developer._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default new DislikeController();
