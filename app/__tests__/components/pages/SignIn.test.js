import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { render, fireEvent, act } from 'react-native-testing-library';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { create } from 'react-test-renderer';

import SignIn from '~/components/pages/SignIn';
import api from '~/services/api';
import SignIn from '~/pages/SignIn';

const _id = faker.random.number();
const api_mock = new MockAdapter(api);
const token = faker.random.uuid();

describe('SignIn page', () => {
  it('should be able to signin', async () => {
    const email = faker.internet.email();
    const tech = faker.random.word();
    const navigate = jest.fn();

    api_mock.onPost('sessions').reply(200, { token, user: { _id } });
    const { getByPlaceholder, getByTestId } = render(
      <SignIn navigation={{ navigate }} />
    );

    fireEvent.changeText(getByPlaceholder('Seu email'), email);
    fireEvent.changeText(getByPlaceholder('Tecnologias de interesse'), tech);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(await AsyncStorage.getItem('aircnc_user')).toBe(
      JSON.stringify({ token, _id })
    );
    expect(await AsyncStorage.getItem('aircnc_techs')).toBe(tech);
    expect(navigate).toHaveBeenCalledWith('App', { screen: 'List' });
  });

  it('should be redirected to List', async () => {
    const navigate = jest.fn();

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    await act(async () => {
      create(<SignIn navigation={{ navigate }} />);
    });

    expect(navigate).toHaveBeenCalledWith('App', { screen: 'List' });
  });
});
