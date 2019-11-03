import Developer from '../models/Developers';

class DislikeController {
  async store(req, res) {
    const { liked_user_id } = req.params;
    const { user: authenticated_user_id } = req.headers;

    const disliked_developer = await Developer.findById(liked_user_id);
    if (!disliked_developer) {
      res.status(400).json({
        error: 'Developer not exist!'
      });
    }

    const authenticated_developer = await Developer.findById(authenticated_user_id);

    if (!authenticated_developer.dislikes.includes(disliked_developer._id)) {
      authenticated_developer.dislikes.push(disliked_developer._id);
      await authenticated_developer.save();
    }

  }
  }

export default new DislikeController();
