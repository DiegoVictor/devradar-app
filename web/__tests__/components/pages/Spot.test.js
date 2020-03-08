import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../../utils/factories';
import Spot from '~/pages/Spot';

const id = faker.random.number();
const token = faker.random.uuid();
const api_mock = new MockAdapter(api);

jest.mock('~/services/history');
history.push.mockImplementation(jest.fn());

describe('Spot page', () => {
  beforeEach(async () => {
    await act(async () => {
      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
    });
  });

  it('should be able to edit a spot ', async () => {
    const spot = await factory.attrs('Spot');
    const { company, techs, price } = await factory.attrs('Spot');

    api_mock
      .onGet(`/spots/${spot._id}`)
      .reply(200, spot)
      .onPut(`spots/${spot._id}`)
      .reply(200);

    let getByPlaceholderText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Spot match={{ params: { id: spot._id } }} />
          </Router>
        </UserContext.Provider>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(getByPlaceholderText('Sua empresa incrível'), {
      target: { value: company },
    });
    fireEvent.change(getByPlaceholderText('Quais tecnologias usam?'), {
      target: { value: techs.join(',') },
    });
    fireEvent.change(getByPlaceholderText('Valor cobrado por dia'), {
      target: { value: price },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith(`/spots/${spot._id}`);
  });

  it('should be able to create a new spot ', async () => {
    const { company, price, techs } = await factory.attrs('Spot');

    api_mock.onPost('spots').reply(200);
    global.URL.createObjectURL = jest.fn(() => {
      return faker.image.imageUrl();
    });

    let getByPlaceholderText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Spot match={{ params: { id: null } }} />
          </Router>
        </UserContext.Provider>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(getByPlaceholderText('Sua empresa incrível'), {
      target: { value: company },
    });
    fireEvent.change(getByPlaceholderText('Quais tecnologias usam?'), {
      target: { value: techs.join(',') },
    });
    fireEvent.change(getByPlaceholderText('Valor cobrado por dia'), {
      target: { value: price },
    });

    await act(async () => {
      fireEvent.change(getByTestId('banner'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });
});
