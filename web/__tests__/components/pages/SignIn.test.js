import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import SignIn from '~/components/pages/SignIn';
import history from '~/services/history';
import api from '~/services/api';

const _id = faker.random.number();
const token = faker.random.uuid();
const email = faker.internet.email();
const api_mock = new MockAdapter(api);

describe('SignIn page', () => {
  it('should be able to login', async () => {
    api_mock.onPost('sessions').reply(200, { user: { _id }, token });
    history.push = jest.fn();

    const { getByPlaceholderText, getByTestId } = render(
      <SignIn history={history} />
    );

    fireEvent.change(getByPlaceholderText('Seu melhor email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
    expect(localStorage).toHaveProperty(
      'aircnc_user',
      JSON.stringify({ _id, token })
    );
  });
});
