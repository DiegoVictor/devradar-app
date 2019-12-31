import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';

import history from '~/services/history';
import Spot from '~/components/pages/Spot';
import api from '~/services/api';
import factory from '../utils/factories';

const id = faker.random.number();
const api_mock = new MockAdapter(api);

describe('Spot page', () => {
  it('should be able to edit a spot ', async () => {
    const spot = await factory.attrs('Spot');
    const { company, techs, price } = await factory.attrs('Spot');

    api_mock.onGet(`/spots/${id}`).reply(200, spot);
    api_mock.onPut(`spots/${id}`).reply(200);
    history.push = jest.fn();

    let getByPlaceholderText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Spot history={history} match={{ params: { id } }} />
        </Router>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(
      getByPlaceholderText('Sua empresa incrível', {
        target: { value: company },
      })
    );
    fireEvent.change(
      getByPlaceholderText('Quais tecnologias usam?', {
        target: { value: techs.join(',') },
      })
    );
    fireEvent.change(
      getByPlaceholderText('Valor cobrado por dia', {
        target: { value: price },
      })
    );

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith(`/spots/${id}`);
  });

  it('should be able to create a new spot ', async () => {
    const { company, price, techs } = await factory.attrs('Spot');

    api_mock.onPost('spots').reply(200);
    history.push = jest.fn();
    global.URL.createObjectURL = jest.fn(() => {
      return faker.image.imageUrl();
    });

    let getByPlaceholderText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Spot history={history} match={{ params: { id: null } }} />
        </Router>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(
      getByPlaceholderText('Sua empresa incrível', {
        target: { value: company },
      })
    );
    fireEvent.change(
      getByPlaceholderText('Quais tecnologias usam?', {
        target: { value: techs.join(',') },
      })
    );
    fireEvent.change(
      getByPlaceholderText('Valor cobrado por dia', {
        target: { value: price },
      })
    );

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
