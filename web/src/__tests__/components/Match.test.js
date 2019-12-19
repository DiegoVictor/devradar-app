import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import faker from 'faker';

import Match from '~/components/Match';

describe('Match', () => {
  it('should be able to the match information', () => {
    const developer = {
      avatar: faker.image.imageUrl(),
      bio: faker.lorem.paragraph(),
      name: faker.name.findName(),
    };

    const { getByAltText, getByText, getByTestId } = render(
      <Match developer={developer} setDeveloper={jest.fn()} />
    );

    expect(getByAltText(developer.name)).toHaveProperty(
      'src',
      developer.avatar
    );
    expect(getByAltText("It's a Match")).toBeInTheDocument();
    expect(getByText(developer.name)).toBeInTheDocument();
    expect(getByText(developer.bio)).toBeInTheDocument();

    expect(getByTestId('close')).toBeInTheDocument();
  });

  it('should be able to the close the match', () => {
    const developer = {
      avatar: faker.image.imageUrl(),
      bio: faker.lorem.paragraph(),
      name: faker.name.findName(),
    };
    const setDeveloper = jest.fn();

    const { getByTestId } = render(
      <Match developer={developer} setDeveloper={setDeveloper} />
    );

    fireEvent.click(getByTestId('close'));

    expect(setDeveloper).toHaveBeenCalledWith(null);
  });
});
