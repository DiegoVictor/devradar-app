import React from 'react';
import { act } from 'react-native-testing-library';
import faker from 'faker';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MockAdapter from 'axios-mock-adapter';
import { format, parseISO } from 'date-fns';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';

import List from '~/components/pages/List';
import api from '~/services/api';
import factory from '../../utils/factories';
import { emit } from '../../../__mocks__/socket.io-client';

jest.mock('@react-navigation/native');

const _id = faker.random.number();
const token = faker.random.uuid();
const api_mock = new MockAdapter(api);
const navigate = jest.fn();

useNavigation.mockReturnValue({ navigate });

describe('List page', () => {
  it('should be able to receive a booking confirmation', async () => {
    const booking = await factory.attrs('Booking', { approved: true });
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    await AsyncStorage.setItem('aircnc_techs', tech);
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id, token }));
    Alert.alert = jest.fn();

    await act(async () => {
      create(<List />);
    });

    emit(booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(Alert.alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi APROVADA`
    );
  });

  it('should be able to receive a booking confirmation', async () => {
    const booking = await factory.attrs('Booking', { approved: false });
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    await AsyncStorage.setItem('aircnc_techs', tech);
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    Alert.alert = jest.fn();

    await act(async () => {
      create(<List />);
    });

    emit(booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(Alert.alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi REJEITADA`
    );
  });
});
