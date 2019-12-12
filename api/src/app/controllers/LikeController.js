import Developer from '../models/Developer';

class LikeController {
  async store(req, res) {
    const { liked_user_id } = req.params;
    const { user_id } = req.headers;

    const liked_developer = await Developer.findById(liked_user_id);
    if (!liked_developer) {
      return res.status(400).json({
        error: 'Developer not exists!',
      });
    }

    const developer = await Developer.findById(user_id);
    if (!developer) {
      return res.status(400).json({
        error: 'Developer not exists!',
      });
    }

    if (liked_developer.likes.includes(developer._id)) {
      const developer_socket = req.connected[user_id];
      const liked_developer_socket = req.connected[liked_user_id];

      if (developer_socket) {
        req.io.to(developer_socket).emit('match', liked_developer);
      }

      if (liked_developer_socket) {
        req.io.to(liked_developer_socket).emit('match', developer);
      }
    }

    if (!developer.likes.includes(liked_developer._id)) {
      developer.likes.push(liked_developer._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default new LikeController();
