import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { fireEvent, wait, render } from '@testing-library/react-native';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import factory from '../../utils/factories';
import Matches from '~/components/pages/Matches';
import api from '~/services/api';
import { emit } from '~/../__mocks__/socket.io-client';

const id = faker.random.number();
const token = faker.random.uuid();
const api_mock = new MockAdapter(api);

describe('Matches page', () => {
  it('should be able to logout', async () => {
    const developers = await factory.attrsMany('Developer', 3);
    const navigate = jest.fn();

    AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    api_mock.onGet('matches').reply(200, developers);

    const { getByTestId } = render(<Matches navigation={{ navigate }} />);

    await wait(() => fireEvent.press(getByTestId('logout')));

    expect(navigate).toHaveBeenCalledWith('Login');
  });

  it('should be able to have a match', async () => {
    const match_developer = await factory.attrs('Developer');

    AsyncStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    api_mock.onGet('developers').reply(200, []);

    const { getByTestId } = render(
      <Matches navigation={{ navigate: jest.fn() }} />
    );

    await wait(async () => emit(match_developer));

    expect(getByTestId('match')).toBeTruthy();
  });
});
