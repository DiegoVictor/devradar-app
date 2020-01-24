import { factory } from 'factory-girl';
import faker from 'faker';

class Developer {}

factory.define('Developer', Developer, {
  _id: faker.random.uuid,
  name: faker.name.firstName,
  bio: faker.lorem.paragraph,
  avatar: faker.image.imageUrl,
});

export default factory;
