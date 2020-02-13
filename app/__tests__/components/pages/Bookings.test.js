import React from 'react';
import { act, fireEvent } from 'react-native-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import faker from 'faker';
import { create } from 'react-test-renderer';

import Bookings from '~/components/pages/Bookings';
import api from '~/services/api';
import factory from '../../utils/factories';

const api_mock = new MockAdapter(api);

describe('Bookings page', () => {
  it('should be able to see bookings', async () => {
    const spots = await factory.attrsMany('Spot', 3);
    const [booking, ...rest] = await factory.attrsMany('Booking', 3, spots);

    await AsyncStorage.setItem('aircnc_user', faker.random.number());
    api_mock.onGet('bookings').reply(200, [booking, ...rest]);

    let root;
    await act(async () => {
      root = create(<Bookings />);
    });

    const nodes = root.root
      .findAllByType('Text')
      .map(node => node.children.shift());

    [booking, ...rest].forEach(b => {
      expect(
        root.root.findByProps({ testID: `booking_status_${b._id}` })
      ).toHaveTextContent(b.approved ? 'Aprovado' : 'Em aprovação');

      expect(
        root.root.findByProps({ testID: `booking_date_${b._id}` })
      ).toHaveTextContent(
        format(parseISO(b.date), "dd'/'MM'/'yyyy", { locale: pt })
      );

      expect(nodes.includes(b.spot.company)).toBeTruthy();

      expect(
        root.root.findByProps({ testID: `booking_price_${b._id}` })
      ).toHaveTextContent(b.spot.price ? `R$ ${b.spot.price}/DIA` : 'GRATUITO');
    });
  });

  it('should be able to cancel a booking', async () => {
    const spot = await factory.attrs('Spot');
    const booking = await factory.attrs('Booking', spot);

    await AsyncStorage.setItem('aircnc_user', faker.random.number());
    api_mock.onGet('bookings').reply(200, [booking]);
    api_mock.onPost(`bookings/${booking._id}/rejection`).reply(200);

    Alert.alert = jest.fn();

    let root;
    await act(async () => {
      root = create(<Bookings />);
    });

    await act(async () => {
      fireEvent.press(
        root.root.findByProps({ testID: `booking_cancel_${booking._id}` })
      );
    });

    expect(Alert.alert).toHaveBeenCalledWith('Reserva cancelada');
  });

  it('should be able to catch error while canceling a booking', async () => {
    const spot = await factory.attrs('Spot');
    const booking = await factory.attrs('Booking', spot);
    const error = 'Error';

    await AsyncStorage.setItem('aircnc_user', faker.random.number());
    api_mock.onGet('bookings').reply(200, [booking]);
    api_mock.onPost(`bookings/${booking._id}/rejection`).reply(400, { error });

    Alert.alert = jest.fn();

    let root;
    await act(async () => {
      root = create(<Bookings />);
    });

    await act(async () => {
      fireEvent.press(
        root.root.findByProps({ testID: `booking_cancel_${booking._id}` })
      );
    });

    expect(Alert.alert).toHaveBeenCalledWith(error);
  });
});
