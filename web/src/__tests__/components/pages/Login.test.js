import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import Login from '~/components/pages/Login';
import api from '~/services/api';

const api_mock = new MockAdapter(api);
const username = faker.internet.userName();
const developer = {
  _id: faker.random.number(),
};

api_mock.onPost('developers', { username }).reply(200, developer);

describe('Login', () => {
  it('should be able to login', async () => {
    const push = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <Login history={{ push }} />
    );

    fireEvent.change(getByPlaceholderText('Digite seu usuário no Github'), {
      target: {
        value: username,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('login'));
    });

    expect(push).toHaveBeenCalledWith(`/developers/${developer._id}`);
  });
});
