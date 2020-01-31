import React from 'react';
import { wait, render, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { API_URL } from 'react-native-dotenv';

import factory from '../../utils/factories';
import Main from '~/components/pages/Main';
import api from '~/services/api';
import { emit } from '~/../__mocks__/socket.io-client';

const id = faker.random.number();
const token = faker.random.uuid();
const api_mock = new MockAdapter(api);

describe('Main page', () => {
  it('should be able to logout', async () => {
    const developers = await factory.attrsMany('Developer', 3);
    const navigate = jest.fn();

    AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    api_mock.onGet(`${API_URL}/developers`).reply(200, developers);

    const { getByTestId } = render(<Main navigation={{ navigate }} />);

    await wait(() => fireEvent.press(getByTestId('logout')));

    expect(navigate).toHaveBeenCalledWith('Login');
  });

  it('should be able to like a developer', async () => {
    const [developer, ...rest] = await factory.attrsMany('Developer', 3);

    AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    api_mock.onGet(`${API_URL}/developers`).reply(200, [developer, ...rest]);
    api_mock.onPost(`${API_URL}/developers/${developer._id}/like`).reply(200);

    const { getByTestId, queryByTestId } = render(
      <Main navigation={{ navigate: jest.fn() }} />
    );

    await wait(() => fireEvent.press(getByTestId('like')));

    expect(queryByTestId(`developer_${developer._id}`)).toBeFalsy();
  });

  it('should be able to dislike a developer', async () => {
    const [developer, ...rest] = await factory.attrsMany('Developer', 3);

    AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    api_mock.onGet(`${API_URL}/developers`).reply(200, [developer, ...rest]);
    api_mock
      .onPost(`${API_URL}/developers/${developer._id}/dislike`)
      .reply(200);

    const { getByTestId, queryByTestId } = render(
      <Main navigation={{ navigate: jest.fn() }} />
    );

    await wait(() => fireEvent.press(getByTestId('dislike')));

    expect(queryByTestId(`developer_${developer._id}`)).toBeFalsy();
  });

  it('should be able to have a match', async () => {
    const match_developer = await factory.attrs('Developer');

    AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    api_mock.onGet(`${API_URL}/developers`).reply(200, []);

    const { getByTestId } = render(
      <Main navigation={{ navigate: jest.fn() }} />
    );

    await wait(async () => emit(match_developer));

    expect(getByTestId('match')).toBeTruthy();
  });
});
