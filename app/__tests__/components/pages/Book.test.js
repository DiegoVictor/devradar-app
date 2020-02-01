import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert, DatePickerAndroid, AsyncStorage } from 'react-native';
import faker from 'faker';
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
    const { getByPlaceholderText, getByTestId } = render(
      <Book navigation={{ navigate, getParam: jest.fn(() => _id) }} />
    );

    AsyncStorage.setItem = jest.fn(() => _id);

    fireEvent.changeText(
      getByPlaceholderText('Qual data você quer reservar?'),
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

    AsyncStorage.setItem = jest.fn(() => _id);

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

    AsyncStorage.setItem = jest.fn(() => _id);

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

    const { getByPlaceholderText, getByTestId } = render(
      <Book navigation={{ navigate, getParam: jest.fn(() => _id) }} />
    );

    fireEvent.focus(getByPlaceholderText('Qual data você quer reservar?'));

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Solicitação de reserva enviada');
    expect(navigate).toHaveBeenCalledWith('List');
  });
});
