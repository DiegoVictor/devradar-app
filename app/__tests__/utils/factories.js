/* eslint-disable max-classes-per-file */
import { factory } from 'factory-girl';
import faker from 'faker';

class Spot {}

factory.define('Spot', Spot, {
  _id: faker.random.uuid,
  user: null,
  company: faker.company.companyName,
  price: () => Number(faker.finance.amount()),
  thumbnail: faker.image.image,
  thumbnail_url: faker.image.imageUrl,
  techs: () => {
    const techs = [];
    for (let i = 0; i < faker.random.number({ min: 1, max: 5 }); i += 1) {
      techs.push(faker.random.word());
    }
    return techs;
  },
});

export default factory;
