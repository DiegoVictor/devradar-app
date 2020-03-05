import { findConnection, emit } from '../../websocket';

class MatchDevelopers {
  async run({ developer, liked_developer }) {
    if (liked_developer.likes.includes(developer._id)) {
      const dev_socket_id = await findConnection(developer._id);
      const liked_dev_socket_id = await findConnection(liked_developer._id);

      if (dev_socket_id) {
        emit(dev_socket_id, 'match', liked_developer.toObject());
      }

      if (liked_dev_socket_id) {
        emit(liked_dev_socket_id, 'match', developer.toObject());
      }
    }
  }
}

export default new MatchDevelopers();
