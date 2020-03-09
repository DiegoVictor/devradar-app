import { factory } from 'factory-girl';
import faker from 'faker';

import User from '../../src/app/models/User';
import Spot from '../../src/app/models/Spot';
import Booking from '../../src/app/models/Booking';

factory.define('Booking', Booking, {
  date: faker.date.future,
  user: null,
  spot: null,
});

factory.define('User', User, {
  email: faker.internet.email,
});

factory.define('Spot', Spot, {
  user: null,
  company: faker.company.companyName,
  price: () => Number(faker.finance.amount()),
  thumbnail: faker.image.image,
  techs: () => {
    const techs = [];
    for (let i = 0; i < faker.random.number({ min: 1, max: 5 }); i += 1) {
      techs.push(faker.random.word());
    }
    return techs;
  },
});

export default factory;
