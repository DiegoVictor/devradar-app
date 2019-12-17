import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';

import Menu from '~/components/Menu';
import api from '~/services/api';

const api_mock = new MockAdapter(api);
const id = faker.random.number();
const developer = {
  avatar: faker.image.imageUrl(),
  name: faker.name.findName(),
};

api_mock.onGet(`/developers/${id}`).reply(200, developer);

describe('Menu', () => {
  it('should be able to see the menu', async () => {
    const push = jest.fn();
    let getByText;
    let getByAltText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <MemoryRouter>
          <Menu history={{ push }} id={id} active="developers" />
        </MemoryRouter>
      );
      getByText = component.getByText;
      getByAltText = component.getByAltText;
      getByTestId = component.getByTestId;
    });

    expect(getByText('Developers')).toBeInTheDocument();
    expect(getByText('Matches')).toBeInTheDocument();
    expect(getByTestId('logout')).toBeInTheDocument();
    expect(getByAltText(developer.name)).toHaveProperty(
      'src',
      developer.avatar
    );
  });

  it('should be able to logout', async () => {
    const push = jest.fn();
    let getByTestId;

    await act(async () => {
      const component = render(
        <MemoryRouter>
          <Menu history={{ push }} id={id} active="developers" />
        </MemoryRouter>
      );
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('logout'));
    expect(push).toHaveBeenCalledWith('/');
  });
});
