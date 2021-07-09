import React from 'react';
import { fireEvent, act } from 'react-native-testing-library';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { create } from 'react-test-renderer';

import { emit } from '../../mocks/socket.io-client';
import factory from '../utils/factory';
import { callbacks, state } from '../../mocks/react-native-maps';
import Main from '~/pages/Main';
import api from '~/services/api';
import {
  getCurrentPositionAsync,
  requestPermissionsAsync,
} from '~/../mocks/expo-location';

jest.mock('@react-navigation/native');

describe('Main page', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to search developers', async () => {
    const word = faker.lorem.word();
    const developers = await factory.attrsMany('Developer', 3, {
      techs: [word],
    });

    apiMock.onGet('search').reply(200, developers);

    let root;
    await act(async () => {
      root = create(<Main />);
    });

    fireEvent.changeText(
      root.root.findByProps({ placeholder: 'Buscar devs por tecnologia' }),
      word
    );

    await act(async () => {
      fireEvent.press(root.root.findByProps({ testID: 'search' }));
    });

    developers.forEach(dev => {
      expect(
        root.root.findByProps({ testID: `developer_${dev._id}` })
      ).toBeTruthy();
    });
  });

  it('should not be able to search developers without provide techs', async () => {
    const word = faker.lorem.word();
    const developers = await factory.attrsMany('Developer', 3, {
      techs: [word],
    });

    apiMock.onGet('search').reply(200, developers);

    let root;
    await act(async () => {
      root = create(<Main />);
    });

    await act(async () => {
      fireEvent.press(root.root.findByProps({ testID: 'search' }));
    });

    developers.forEach(dev => {
      expect(
        root.root.findAllByProps({ testID: `developer_${dev._id}` })
      ).toStrictEqual([]);
    });
  });

  it('should be able to update user current position', async () => {
    const latitude = faker.address.latitude();
    const longitude = faker.address.longitude();

    await act(async () => {
      create(<Main />);
    });

    await act(async () => {
      callbacks.onRegionChangeComplete({
        latitude,
        longitude,
      });
    });

    expect(state.initialRegion).toStrictEqual({
      latitude,
      longitude,
    });
  });

  it('should be able to receive new developer from socket', async () => {
    const word = faker.lorem.word();
    const developer = await factory.attrs('Developer', {
      techs: [word],
    });

    let root;
    await act(async () => {
      root = create(<Main />);
    });

    await act(async () => {
      emit('developer', developer);
    });

    expect(
      root.root.findByProps({ testID: `developer_${developer._id}` })
    ).toBeTruthy();
  });

  it('should not be able to get user current position', async () => {
    requestPermissionsAsync.mockImplementation(() => ({ granted: false }));

    await act(async () => {
      create(<Main />);
    });

    expect(getCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
