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
      console.log('Match developers');
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