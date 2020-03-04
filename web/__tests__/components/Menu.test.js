import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Menu from '~/components/Menu';

const api_mock = new MockAdapter(api);
const id = faker.random.number();
const token = faker.random.uuid();
const developer = {
  avatar: faker.image.imageUrl(),
  name: faker.name.findName(),
};

api_mock.onGet(`/developers/${id}`).reply(200, developer);

jest.mock('~/services/history');

describe('Menu', () => {
  beforeAll(() => {
    localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
  });

  it('should be able to see the menu', async () => {
    let getByText;
    let getByAltText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Menu active="developers" />
          </Router>
        </UserContext.Provider>
      );
      getByText = component.getByText;
      getByAltText = component.getByAltText;
      getByTestId = component.getByTestId;
    });

    expect(getByText('developers')).toBeInTheDocument();
    expect(getByText('matches')).toBeInTheDocument();
    expect(getByTestId('logout')).toBeInTheDocument();
    expect(getByAltText(developer.name)).toHaveProperty(
      'src',
      developer.avatar
    );
  });

  it('should be able to logout', async () => {
    let getByTestId;

    history.push.mockImplementation(jest.fn());

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Menu active="developers" />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('logout'));
    expect(history.push).toHaveBeenCalledWith('/');
  });
});
