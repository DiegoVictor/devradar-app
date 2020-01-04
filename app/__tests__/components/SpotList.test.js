import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { render, waitForElement } from '@testing-library/react-native';
import faker from 'faker';

import api from '~/services/api';
import { SpotList } from '../../src/components/SpotList';
import factories from '../utils/factories';

const api_mock = new MockAdapter(api);

describe('SpotList component', () => {
  it('should be able to see spot list', async () => {
    const tech = faker.random.word();
    const spots = await factories.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('spots', { params: { tech } }).reply(200, spots);

    const { getByTestId, getByText } = render(
      <SpotList tech={tech} navigation={{ navigate: jest.fn() }} />
    );

    await waitForElement(() => getByTestId(`spot_${spots[0]._id}`));

    spots.forEach(spot => {
      expect(getByTestId(`spot_${spot._id}`)).toBeTruthy();
      expect(getByText(spot.company)).toBeTruthy();

    });
  });
});
