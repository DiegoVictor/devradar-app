import Api from './Api';
import parseStringAsArray from '../helpers/parseStringAsArray';
import { sendMessage, findConnection } from '../../websocket';
import Developer from '../models/Developer';

class StoreDeveloper {
  async run({ github_username, techs, latitude, longitude }) {
    const { data } = await Api.get(`/users/${github_username}`);
    // eslint-disable-next-line no-undef
    const { name = login, avatar_url, bio } = data;

    const techs_array = parseStringAsArray(techs);
    const developer = await Developer.create({
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

    sendMessage(
      await findConnection({ latitude, longitude }, techs_array),
      'new_developers',
      developer
    );

    return developer;
  }
}

export default new StoreDeveloper();
