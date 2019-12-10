import { factory } from 'factory-girl';
import faker from 'faker';

import Developer from '../../src/app/models/Developer';

factory.define('Developer', Developer, {
  name: faker.name.firstName(),
  user: faker.internet.userName(),
  bio: faker.lorem.paragraph(),
  avatar: faker.image.imageUrl(),
  likes: [],
  dislikes: [],
});

export default factory;
