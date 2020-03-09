import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import SignIn from '~/pages/SignIn';

const id = faker.random.number();
const token = faker.random.uuid();
const email = faker.internet.email();
const api_mock = new MockAdapter(api);

jest.mock('~/services/history');
history.push.mockImplementation(jest.fn());

describe('SignIn page', () => {
  it('should be able to login', async () => {
    const user = {};
    api_mock.onPost('sessions').reply(200, { user: { _id: id }, token });

    const { getByPlaceholderText, getByTestId } = render(
      <UserContext.Provider value={user}>
        <SignIn />
      </UserContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu melhor email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
    expect(user).toStrictEqual({ id, token });
    expect(localStorage).toHaveProperty(
      'aircnc_user',
      JSON.stringify({ id, token })
    );
  });
});
