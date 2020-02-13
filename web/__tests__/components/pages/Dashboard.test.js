import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { Router } from 'react-router-dom';

import factory from '../../utils/factories';
import api from '~/services/api';
import Dashboard from '~/components/pages/Dashboard';
import history from '~/services/history';
import { run } from '../../../__mocks__/socket.io-client';

const api_mock = new MockAdapter(api);
let spots;

describe('Dashboard page', () => {
  beforeAll(async () => {
    spots = await factory.attrsMany('Spot', 3);
    api_mock.onGet('/dashboard').reply(200, spots);
  });

  beforeEach(async () => {
    await act(async () => {
      localStorage.clear();
      localStorage.setItem(
        'aircnc_user',
        JSON.stringify({
          id: faker.random.number(),
          token: faker.random.uuid(),
        })
      );
    });
  });

  it('should be able to list spots', async () => {
    let getByTestId;

    api_mock.onGet('/pending').reply(200, []);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
    });

    spots.forEach(spot => {
      expect(getByTestId(`spot_${spot._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to go to new spot page', async () => {
    api_mock.onGet('/pending').reply(200, []);

    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('new'));
    expect(history.location.pathname).toBe('/spot');
  });

  it('should be able to list pending spot requests', async () => {
    const requests = await factory.attrsMany('Booking', 3);
    let getByTestId;

    api_mock.onGet('/pending').reply(200, requests);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
    });

    requests.forEach(request => {
      expect(getByTestId(`notification_${request._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to receive booking request', async () => {
    let getByTestId;
    const booking = await factory.attrs('Booking');

    api_mock.onGet('/pending').reply(200, []);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      run(booking);
    });

    expect(getByTestId(`notification_${booking._id}`)).toBeInTheDocument();
  });

  it('should be able to approve a booking spot request', async () => {
    const [request, ...rest] = await factory.attrsMany('Booking', 3);
    let getByTestId;
    let queryByTestId;

    api_mock.onGet('/pending').reply(200, [request, ...rest]);
    api_mock.onPost(`/bookings/${request._id}/approval`).reply(200);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`notification_approve_${request._id}`));
    });

    expect(
      queryByTestId(`[data-testid="notification_approve_${request._id}"]`)
    ).toBeNull();
  });

  it('should be able to reject a booking spot request', async () => {
    const [request, ...rest] = await factory.attrsMany('Booking', 3);
    let getByTestId;
    let queryByTestId;

    api_mock.onGet('/pending').reply(200, [request, ...rest]);
    api_mock.onPost(`/bookings/${request._id}/rejection`).reply(200);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`notification_reject_${request._id}`));
    });

    expect(
      queryByTestId(`[data-testid="notification_reject_${request._id}"]`)
    ).toBeNull();
  });
});
