import faker from 'faker';

export const requestPermissionsAsync = jest.fn(async () => {
  return {
    granted: true,
  };
});

export const latitude = Number(faker.address.latitude());
export const longitude = Number(faker.address.longitude());

export const getCurrentPositionAsync = jest.fn(async () => {
  return {
    coords: {
      latitude: jest.fn(),
      longitude: jest.fn(),
    },
  };
});
