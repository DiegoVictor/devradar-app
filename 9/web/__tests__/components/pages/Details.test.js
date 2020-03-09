import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../../utils/factories';
import Details from '~/pages/Details';

const api_mock = new MockAdapter(api);
const id = faker.random.number();
const token = faker.random.uuid();

jest.mock('~/services/history');
history.push.mockImplementation(jest.fn());

describe('Details page', () => {
  beforeEach(async () => {
    await act(async () => {
      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
    });
  });

  it('should be able to see spot details', async () => {
    const spot = await factory.attrs('Spot');

    api_mock.onGet(`/spots/${spot._id}`).reply(200, {
      ...spot,
      bookings: [],
    });

    let getByText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details match={{ params: { id: spot._id } }} />
          </Router>
        </UserContext.Provider>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    expect(getByTestId('edit')).toBeInTheDocument();
    expect(getByText(spot.company)).toBeInTheDocument();
    expect(getByTestId('banner')).toHaveStyle(
      `background-color: url('${spot.thumbnail_url}')`
    );

    spot.techs.forEach(tech => {
      expect(getByText(tech)).toBeInTheDocument();
    });

    if (spot.price > 0) {
      expect(getByText(`R$ ${spot.price}/DIA`)).toBeInTheDocument();
    } else {
      expect(getByText('GRATUITO')).toBeInTheDocument();
    }
  });

  it('should be able to delete a spot', async () => {
    const spot = await factory.attrs('Spot');

    api_mock
      .onGet(`/spots/${spot._id}`)
      .reply(200, {
        ...spot,
        bookings: [],
      })
      .onDelete(`/spots/${spot._id}`)
      .reply(200);

    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details match={{ params: { id: spot._id } }} />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId('delete'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should be able to reject spot booking request', async () => {
    const spot = await factory.attrs('Spot');
    const request = await factory.attrs('Booking');

    api_mock
      .onGet(`/spots/${spot._id}`)
      .reply(200, {
        ...spot,
        bookings: [request],
      })
      .onPost(`bookings/${request._id}/rejection`)
      .reply(200);

    let getByTestId;
    let queryByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details match={{ params: { id: spot._id } }} />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`booking_reject_${request.id}`));
    });

    expect(queryByTestId(`booking_reject_${request.id}`)).toBeNull();
  });
});
