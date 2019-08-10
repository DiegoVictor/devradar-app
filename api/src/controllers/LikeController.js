const Developer = require('../models/Developers');

module.exports = {
  async store(req, res) {
    const { liked_user_id } = req.params;
    const { user: authenticated_user_id } = req.headers;

    const liked_developer = await Developer.findById(liked_user_id);
    if (!liked_developer) {
      res.status(400).json({
        error: 'Developer not exist!'
      });
    }

    const authenticated_developer = await Developer.findById(authenticated_user_id);

    if (liked_developer.likes.includes(authenticated_developer._id)) {
      const authenticated_developer_socket = req.connected[authenticated_user_id];
      const liked_developer_socket = req.connected[liked_user_id];

      if (authenticated_developer_socket) {
        req.io.to(authenticated_developer_socket).emit('match', liked_developer);
      }

      if (liked_developer_socket) {
        req.io.to(liked_developer_socket).emit('match', authenticated_developer);
      }
    }

    if (!authenticated_developer.likes.includes(liked_developer._id)) {
      authenticated_developer.likes.push(liked_developer._id);
      await authenticated_developer.save();
    }

    res.json({
      success: true,
      data: authenticated_developer
    });
  }
};