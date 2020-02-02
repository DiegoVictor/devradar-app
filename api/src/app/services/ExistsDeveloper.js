import { badRequest } from '@hapi/boom';

import Developer from '../models/Developer';

class ExistsDeveloper {
  async run({ id }) {
    const developer = await Developer.findById(id);
    if (!developer) {
      throw badRequest('Developer does not exists');
    }

    return developer;
  }
}

export default new ExistsDeveloper();
