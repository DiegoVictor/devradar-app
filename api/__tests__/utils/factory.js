import { factory } from 'factory-girl';
import faker from 'faker';

import Developer from '../../src/app/models/Developer';

factory.define('Developer', Developer, {
  name: faker.name.findName,
  github_username: faker.internet.userName,
  bio: faker.lorem.paragraph,
  avatar_url: faker.image.imageUrl,
  techs: () => {
    const techs = [];
    for (let i = 0; i < faker.random.number({ min: 1, max: 5 }); i += 1) {
      techs.push(faker.random.word());
    }
    return techs;
  },
  location: {
    type: 'Point',
    coordinates: [
      Number(faker.address.longitude()),
      Number(faker.address.latitude()),
    ],
  },
});

export default factory;
