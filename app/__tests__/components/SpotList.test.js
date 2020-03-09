import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, fireEvent } from 'react-native-testing-library';
import AsyncStorage from '@react-native-community/async-storage';
import faker from 'faker';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';

import api from '~/services/api';
import factory from '../utils/factories';
import SpotList from '~/components/SpotList';

const token = faker.random.uuid();
const api_mock = new MockAdapter(api);
const navigate = jest.fn();

jest.mock('@react-navigation/native');
useNavigation.mockReturnValue({ navigate });

describe('SpotList component', () => {
  it('should be able to see spot list', async () => {
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ token }));
    api_mock.onGet('/spots', { params: { tech } }).reply(200, [spot, ...rest]);

    let root;
    await act(async () => {
      root = create(<SpotList tech={tech} />);
    });

    const nodes = root.root
      .findAllByType('Text')
      .map(node => node.children.shift());

    [spot, ...rest].forEach(s => {
      expect(root.root.findByProps({ testID: `spot_${s._id}` })).toBeTruthy();

      expect(nodes.includes(s.company)).toBeTruthy();
      if (s.price) {
        expect(nodes.includes(`R$ ${s.price}/DIA`)).toBeTruthy();
      }
    });
  });

  it('should be able to book a spot', async () => {
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    api_mock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    let root;
    await act(async () => {
      root = create(<SpotList tech={tech} />);
    });

    fireEvent.press(root.root.findByProps({ testID: `spot_book_${spot._id}` }));
    expect(navigate).toHaveBeenCalledWith('Book', { id: spot._id });
  });
});
