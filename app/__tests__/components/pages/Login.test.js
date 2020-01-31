import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { API_URL } from 'react-native-dotenv';

import Login from '~/components/pages/Login';
import api from '~/services/api';

const id = faker.random.number();
const token = faker.random.uuid();
const api_mock = new MockAdapter(api);

describe('Login page', () => {
  it('should be able to login', async () => {
    const navigate = jest.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <Login navigation={{ navigate, getParam: jest.fn() }} />
    );

    api_mock
      .onPost(`${API_URL}/developers`)
      .reply(200, { developer: { _id: id }, token });

    fireEvent.changeText(
      getByPlaceholderText('Digite seu usuáro no Github'),
      faker.internet.userName()
    );

    await wait(() => fireEvent.press(getByTestId('submit')));

    expect(await AsyncStorage.getItem('tindev_user')).toBe(
      JSON.stringify({ id, token })
    );
    expect(navigate).toHaveBeenCalledWith('Main');
  });

  it('should be able to already be logged in', async () => {
    const navigate = jest.fn();
    await AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));

    await wait(() =>
      render(<Login navigation={{ navigate, getParam: jest.fn() }} />)
    );

    expect(navigate).toHaveBeenCalledWith('Main', { id, token });
  });
});
