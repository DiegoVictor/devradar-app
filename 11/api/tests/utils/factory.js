import factory from 'factory-girl';
import faker from 'faker';

factory.define(
  'Ong',
  {},
  {
    name: faker.name.findName,
    email: faker.internet.email,
    whatsapp: () => faker.phone.phoneNumber('00000000000'),
    city: faker.address.city,
    uf: faker.address.stateAbbr,
  }
);

export default factory;
