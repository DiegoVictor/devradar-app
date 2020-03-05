import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Login from '~/pages/Login';

const api_mock = new MockAdapter(api);
const username = faker.internet.userName();
const id = faker.random.number();
const token = faker.random.uuid();

api_mock
  .onPost('developers', { username })
  .reply(200, { token, developer: { _id: id } });

jest.mock('~/services/history');
history.push.mockImplementation(jest.fn());

describe('Login', () => {
  it('should be able to login', async () => {
    const user = {};
    const { getByPlaceholderText, getByTestId } = render(
      <UserContext.Provider value={user}>
        <Login />
      </UserContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Digite seu usuário no Github'), {
      target: {
        value: username,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('login'));
    });

    expect(history.push).toHaveBeenCalledWith(`/developers`);
    expect(user).toStrictEqual({ id, token });
    expect(localStorage.getItem('tindev_user')).toBe(
      JSON.stringify({
        token,
        id,
      })
    );
  });
});
