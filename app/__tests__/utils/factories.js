import { factory } from 'factory-girl';
import faker from 'faker';

factory.define(
  'Spot',
  {},
  {
    _id: () => String(faker.random.number()),
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
  }
);

factory.define(
  'Booking',
  {},
  {
    _id: () => String(faker.random.number()),
    date: () => faker.date.future().toISOString(),
    user: {
      email: faker.internet.email,
    },
    spot: {
      company: faker.company.companyName,
      thumbnail_url: faker.image.imageUrl,
      price: () => Number(faker.finance.amount()),
    },
    approved: faker.random.boolean,
  }
);

export default factory;
