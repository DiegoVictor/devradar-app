import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import {
  render,
  waitForElement,
  fireEvent,
} from 'react-native-testing-library';
import faker from 'faker';

import api from '~/services/api';
import { SpotList } from '~/components/SpotList';
import factory from '../utils/factories';

const api_mock = new MockAdapter(api);

describe('SpotList component', () => {
  it('should be able to see spot list', async () => {
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('/spots', { params: { tech } }).reply(200, [spot, ...rest]);

    const { getByTestId, getByText } = render(
      <SpotList tech={tech} navigation={{ navigate: jest.fn() }} />
    );

    await waitForElement(() => getByTestId(`spot_${spot._id}`));

    [spot, ...rest].forEach(s => {
      expect(getByTestId(`spot_${s._id}`)).toBeTruthy();
      expect(getByText(s.company)).toBeTruthy();
      if (spot.price) {
        expect(getByText(`R$ ${spot.price}/DIA`)).toBeTruthy();
      }
    });
  });

  it('should be able to book a spot', async () => {
    const navigate = jest.fn();
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    const { getByTestId } = render(
      <SpotList tech={tech} navigation={{ navigate }} />
    );

    await waitForElement(() => getByTestId(`spot_${spot._id}`));

    fireEvent.press(getByTestId(`spot_book_${spot._id}`));
    expect(navigate).toHaveBeenCalledWith('Book', { id: spot._id });
  });
});
