import React from 'react';
import { render, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';

import { UserContext } from '~/contexts/User';
import { emit } from '../../../__mocks__/socket.io-client';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../../utils/factories';
import Matches from '~/pages/Matches';

const api_mock = new MockAdapter(api);
const id = faker.random.number();
const token = faker.random.uuid();

describe('Matches', () => {
  beforeEach(async () => {
    await act(async () => {
      localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    });
  });

  it('should be able to see a list of matches', async () => {
    const matches = await factory.attrsMany('Developer', 3);
    const developer = await factory.attrs('Developer');

    let getByTestId;

    api_mock
      .onGet(`/developers/${id}`)
      .reply(200, developer)
      .onGet('/matches')
      .reply(200, matches);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Matches />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    matches.forEach(dev => {
      expect(getByTestId(`developer_${dev._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to show a match', async () => {
    const match_developer = await factory.attrs('Developer');
    const developers = await factory.attrsMany('Developer', 3);

    let getByAltText;
    let getByText;

    api_mock.onGet('/developers').reply(200, developers);

    await act(async () => {
      const components = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Matches />
          </Router>
        </UserContext.Provider>
      );
      getByAltText = components.getByAltText;
      getByText = components.getByText;
    });

    await act(async () => {
      emit(match_developer);
    });

    expect(getByAltText(match_developer.name)).toHaveProperty(
      'src',
      match_developer.avatar
    );
    expect(getByAltText("It's a Match")).toBeInTheDocument();
    expect(getByText(match_developer.name)).toBeInTheDocument();
    expect(getByText(match_developer.bio)).toBeInTheDocument();
  });
});
