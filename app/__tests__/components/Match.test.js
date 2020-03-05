import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import factory from '../utils/factories';
import Match from '~/components/Match';

describe('Match component', () => {
  it('should be able to see the match information', async () => {
    const developer = await factory.attrs('Developer');

    const { getByText, getByTestId } = render(
      <Match developer={developer} setDeveloper={jest.fn()} />
    );

    expect(getByText(developer.name)).toBeTruthy();
    expect(getByText(developer.bio)).toBeTruthy();
    expect(getByTestId('avatar')).toHaveProp('source', {
      uri: developer.avatar,
    });
  });

  it('should be able to close the match screen', async () => {
    const developer = await factory.attrs('Developer');
    const setDeveloper = jest.fn();

    const { getByTestId } = render(
      <Match developer={developer} setDeveloper={setDeveloper} />
    );

    fireEvent.press(getByTestId('close'));

    expect(setDeveloper).toHaveBeenCalledWith(null);
  });
});
