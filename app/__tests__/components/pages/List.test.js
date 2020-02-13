import React from 'react';
import { act } from 'react-native-testing-library';
import faker from 'faker';
import { Alert, AsyncStorage } from 'react-native';
import MockAdapter from 'axios-mock-adapter';
import { format, parseISO } from 'date-fns';
import { create } from 'react-test-renderer';

import List from '~/components/pages/List';
import api from '~/services/api';
import factory from '../../utils/factories';
import { emit } from '../../../__mocks__/socket.io-client';

const _id = faker.random.number();
const api_mock = new MockAdapter(api);

describe('List page', () => {
  it('should be able to receive a booking confirmation', async () => {
    const booking = await factory.attrs('Booking');
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    AsyncStorage.setItem = jest.fn(key => {
      if (key === 'aircnc_techs') {
        return tech;
      }
      return _id;
    });

    Alert.alert = jest.fn();

    await act(async () => {
      create(<List />);
    });
    emit(booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(Alert.alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi ${
        booking.approved ? 'APROVADA' : 'REJEITADA'
      }`
    );
  });
});
