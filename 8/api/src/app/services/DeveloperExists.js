import { badRequest } from '@hapi/boom';

import Developer from '../models/Developer';

class DeveloperExists {
  async run({ id }) {
    const user = await Developer.findById(id);
    if (!user) {
      throw badRequest('Developer not exists');
    }

    return user;
  }
}

export default new DeveloperExists();
