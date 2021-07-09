import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { useNavigation } from '@react-navigation/native';
import factory from '../utils/factory';
import { Dev } from '~/components/Dev';

jest.mock('@react-navigation/native');

describe('Dev component', () => {
  it('should be able to create a map marker', async () => {
    const dev = await factory.attrs('Developer');
    const { getByText, getByTestId } = render(
      <Dev testID="marker" dev={dev} />
    );

    expect(getByTestId('avatar')).toHaveProp('source', {
      uri: dev.avatar_url,
    });
    expect(getByText(dev.name)).toBeTruthy();
    expect(getByText(dev.bio)).toBeTruthy();
    expect(getByText(dev.techs.join(', '))).toBeTruthy();
  });

  it('should be able to navigate to user profile', async () => {
    const dev = await factory.attrs('Developer');

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });

    const { getByTestId } = render(<Dev dev={dev} />);

    fireEvent.press(getByTestId('profile'));

    expect(navigate).toHaveBeenCalledWith('Profile', {
      githubUsername: dev.github_username,
    });
  });
});
