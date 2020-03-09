import React from 'react';
import { render, fireEvent, act } from 'react-native-testing-library';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';

import api from '~/services/api';
import Book from '~/pages/Book';

const _id = faker.random.uuid();
const api_mock = new MockAdapter(api);
const navigate = jest.fn();

jest.mock('@react-navigation/native');
useNavigation.mockReturnValue({ navigate });

describe('Book page', () => {
  it('should be able to book a spot', async () => {
    const date = faker.date.future();

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    api_mock.onPost(`spots/${_id}/booking`).reply(({ data }) => {
      const { date: received_date } = JSON.parse(data);
      expect(received_date).toBe(date.toISOString());
      return [200, {}];
    });
    Alert.alert = jest.fn();

    let root;
    await act(async () => {
      root = create(<Book route={{ params: { id: _id } }} />);
    });

    await act(async () => {
      fireEvent(root.root.findByProps({ testID: 'date' }), 'onFocus');
    });

    expect(root.root.findByProps({ testID: 'datepicker' })).toBeTruthy();

    await act(async () => {
      fireEvent(
        root.root.findByProps({ testID: 'datepicker' }),
        'onChange',
        {},
        date
      );
    });

    await act(async () => {
      fireEvent.press(root.root.findByProps({ testID: 'submit' }));
    });

    expect(Alert.alert).toHaveBeenCalledWith('Solicitação de reserva enviada');
    expect(navigate).toHaveBeenCalledWith('List');
  });

  it('should be able to back to List', async () => {
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));

    const { getByTestId } = render(<Book route={{ params: { id: _id } }} />);

    await act(async () => {
      fireEvent.press(getByTestId('cancel'));
    });

    expect(navigate).toHaveBeenCalledWith('List');
  });
});
