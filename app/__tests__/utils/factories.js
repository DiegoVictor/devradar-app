import { factory } from 'factory-girl';
import faker from 'faker';

factory.define(
  'Developer',
  {},
  {
    _id: faker.random.number,
    github_username: faker.internet.userName,
    name: faker.name.findName,
    bio: faker.lorem.paragraph,
    techs: () => {
      const techs = [];
      for (let i = 0; i < faker.random.number({ min: 1, max: 5 }); i += 1) {
        techs.push(faker.random.word());
      }
      return techs;
    },
    avatar_url: faker.image.imageUrl,
    location: () => ({
      coordinates: [
        Number(faker.address.longitude()),
        Number(faker.address.latitude()),
      ],
    }),
  }
);

export default factory;
