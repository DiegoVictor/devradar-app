import React from 'react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { act, fireEvent, render } from '@testing-library/react-native';

import { emit } from '../../mocks/socket.io-client';
import factory from '../utils/factory';
import { callbacks, state } from '../../mocks/react-native-maps';
import Main from '~/pages/Main';
import api from '~/services/api';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from '~/../mocks/expo-location';
import wait from '../utils/wait';

jest.mock('@react-navigation/native');

describe('Main page', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to search developers', async () => {
    const word = faker.lorem.word();
    const developers = await factory.attrsMany('Developer', 3, {
      techs: [word],
    });

    apiMock.onGet('search').reply(200, developers);
    const { getByPlaceholderText, getByTestId } = render(<Main />);

    await wait(() =>
      expect(getByPlaceholderText('Buscar devs por tecnologia')).toBeTruthy()
    );

    fireEvent.changeText(
      getByPlaceholderText('Buscar devs por tecnologia'),
      word
    );

    await act(async () => {
      fireEvent.press(getByTestId('search'));
    });

    developers.forEach((dev) => {
      expect(getByTestId(`developer_${dev._id}`)).toBeTruthy();
    });
  });

  it('should not be able to search developers without provide techs', async () => {
    const word = faker.lorem.word();
    const developers = await factory.attrsMany('Developer', 3, {
      techs: [word],
    });

    apiMock.onGet('search').reply(200, developers);

    const { getByTestId, queryAllByTestId } = render(<Main />);
    await wait(() => expect(getByTestId('search')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByTestId('search'));
    });

    developers.forEach((dev) => {
      expect(queryAllByTestId(`developer_${dev._id}`)).toStrictEqual([]);
    });
  });

  it('should be able to update user current position', async () => {
    const latitude = faker.address.latitude();
    const longitude = faker.address.longitude();

    const { getByPlaceholderText } = render(<Main />);

    await wait(() =>
      expect(getByPlaceholderText('Buscar devs por tecnologia')).toBeTruthy()
    );

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

    const { getByTestId, getByPlaceholderText } = render(<Main />);

    await wait(() =>
      expect(getByPlaceholderText('Buscar devs por tecnologia')).toBeTruthy()
    );

    await act(async () => {
      emit('developer', developer);
    });

    expect(getByTestId(`developer_${developer._id}`)).toBeTruthy();
  });

  it('should not be able to get user current position', async () => {
    requestForegroundPermissionsAsync.mockImplementation(() => ({
      granted: false,
    }));

    render(<Main />);

    expect(getCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
