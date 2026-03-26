import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Developer',
  {},
  {
    _id: faker.number.int,
    github_username: faker.internet.username,
    name: faker.person.fullName,
    bio: faker.lorem.paragraph,
    techs: () => {
      const techs = [];
      for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i += 1) {
        techs.push(faker.lorem.word());
      }
      return techs;
    },
    avatar_url: faker.image.url,
    location: () => ({
      coordinates: [
        Number(faker.location.longitude()),
        Number(faker.location.latitude()),
      ],
    }),
  }
);

export default factory;
