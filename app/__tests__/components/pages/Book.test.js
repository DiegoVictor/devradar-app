import React from 'react';
import { render, fireEvent, act } from 'react-native-testing-library';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { format, getDate, getMonth, getYear } from 'date-fns';
import MockAdapter from 'axios-mock-adapter';

import api from '~/services/api';
import Book from '~/components/pages/Book';

const _id = faker.random.number();
const api_mock = new MockAdapter(api);

describe('Book page', () => {
  it('should be able to book a spot', async () => {
    api_mock.onPost(`spots/${_id}/booking`).reply(200);
    Alert.alert = jest.fn();

    const navigate = jest.fn();
    const date = format(faker.date.future(), "dd'/'MM'/'yyyy");
    const { getByPlaceholder, getByTestId } = render(
      <Book navigation={{ navigate, getParam: jest.fn(() => _id) }} />
    );

    await AsyncStorage.setItem('aircnc_user', _id);

    fireEvent.changeText(
      getByPlaceholder('Qual data você quer reservar?'),
      date
    );

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(Alert.alert).toHaveBeenCalledWith('Solicitação de reserva enviada');
    expect(navigate).toHaveBeenCalledWith('List');
  });

  it('should be able to back to List', async () => {
    const navigate = jest.fn();
    const { getByTestId } = render(
      <Book navigation={{ navigate, getParam: jest.fn(() => _id) }} />
    );

    await AsyncStorage.setItem('aircnc_user', _id);

    await act(async () => {
      fireEvent.press(getByTestId('cancel'));
    });

    expect(navigate).toHaveBeenCalledWith('List');
  });

  it('should be able to open the datepicker', async () => {
    const navigate = jest.fn();
    const date = faker.date.future();
    api_mock
      .onPost(`spots/${_id}/booking`, {
        params: { date: date.toISOString() },
      })
      .reply(200);

    await AsyncStorage.setItem('aircnc_user', _id);

    DatePickerAndroid.open = () =>
      new Promise(resolve => {
        resolve({
          action: DatePickerAndroid.dateSetAction,
          year: getYear(date),
          month: getMonth(date),
          day: getDate(date),
        });
      });

    Alert.alert = jest.fn();

    const { getByPlaceholder, getByTestId } = render(
      <Book navigation={{ navigate, getParam: jest.fn(() => _id) }} />
    );

    fireEvent(getByPlaceholder('Qual data você quer reservar?'), 'onFocus');

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Solicitação de reserva enviada');
    expect(navigate).toHaveBeenCalledWith('List');
  });
});
