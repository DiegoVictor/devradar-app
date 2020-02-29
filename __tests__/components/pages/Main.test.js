import React from 'react';
import { fireEvent, act } from 'react-native-testing-library';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { create } from 'react-test-renderer';

import factory from '../../utils/factories';
import { callbacks, state } from '../../../__mocks__/react-native-maps';
import Main from '~/components/pages/Main';
import api from '~/services/api';
import { emit } from '~/../__mocks__/socket.io-client';

const api_mock = new MockAdapter(api);

describe('Main page', () => {
  it('should be able to search developers', async () => {
    const word = faker.lorem.word();
    const developers = await factory.attrsMany('Developer', 3, {
      techs: [word],
    });

    api_mock.onGet('search').reply(200, developers);

    let root;
    await act(async () => {
      root = create(<Main />);
    });

    fireEvent.changeText(
      root.root.findByProps({ placeholder: 'Buscar devs por tecnologia' }),
      word
    );

    await act(async () => {
      fireEvent.press(root.root.findByProps({ testID: 'search' }));
    });

    developers.forEach(dev => {
      expect(
        root.root.findByProps({ testID: `developer_${dev._id}` })
      ).toBeTruthy();
    });
  });

  it('should be able to update user current position', async () => {
    const latitude = faker.address.latitude();
    const longitude = faker.address.longitude();

    await act(async () => {
      create(<Main />);
    });

    await act(async () => {
      callbacks.onRegionChangeComlpete({
        latitude,
        longitude,
      });
    });

    expect(state.initialRegion).toStrictEqual({
      latitude,
      longitude,
    });
  });

  it('should be able to receive new developer from socket', async () => {
    const word = faker.lorem.word();
    const developer = await factory.attrs('Developer', {
      techs: [word],
    });

    let root;
    await act(async () => {
      root = create(<Main />);
    });

    await act(async () => {
      emit(developer);
    });

    expect(
      root.root.findByProps({ testID: `developer_${developer._id}` })
    ).toBeTruthy();
  });
});
