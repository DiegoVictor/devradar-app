import faker from 'faker';

export async function requestPermissionsAsync() {
  return {
    granted: true,
  };
}

export const latitude = Number(faker.address.latitude());
export const longitude = Number(faker.address.longitude());

export async function getCurrentPositionAsync() {
  return {
    coords: {
      latitude: jest.fn(),
      longitude: jest.fn(),
    },
  };
}
