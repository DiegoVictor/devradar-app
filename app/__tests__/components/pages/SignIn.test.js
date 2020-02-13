import React from 'react';
import { AsyncStorage } from 'react-native';
import { render, fireEvent, act } from 'react-native-testing-library';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { create } from 'react-test-renderer';

import SignIn from '~/components/pages/SignIn';
import api from '~/services/api';

const _id = faker.random.number();
const api_mock = new MockAdapter(api);

describe('SignIn page', () => {
  it('should be able to signin', async () => {
    const email = faker.internet.email();
    const tech = faker.random.word();
    const navigate = jest.fn();

    api_mock.onPost(`sessions`).reply(200, { _id });
    const { getByPlaceholder, getByTestId } = render(
      <SignIn navigation={{ navigate }} />
    );
    AsyncStorage.setItem = jest.fn();

    fireEvent.changeText(getByPlaceholder('Seu email'), email);
    fireEvent.changeText(getByPlaceholder('Tecnologias de interesse'), tech);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, 'aircnc_user', _id);
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(
      2,
      'aircnc_techs',
      tech
    );
    expect(navigate).toHaveBeenCalledWith('List');
  });

  it('should be redirected to List', async () => {
    const navigate = jest.fn();

    AsyncStorage.getItem = jest.fn(() => _id);
    await act(async () => {
      create(<SignIn navigation={{ navigate }} />);
    });

    expect(navigate).toHaveBeenCalledWith('List');
  });
});
