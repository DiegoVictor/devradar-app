import { faker } from '@faker-js/faker';

export const requestForegroundPermissionsAsync = jest.fn(async () => {
  return {
    granted: true,
  };
});

export const latitude = Number(faker.location.latitude());
export const longitude = Number(faker.location.longitude());

export const getCurrentPositionAsync = jest.fn(async () => {
  return {
    coords: {
      latitude: jest.fn(),
      longitude: jest.fn(),
    },
  };
});
