import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import history from '~/services/history';
import Back from '~/components/Back';

jest.mock('~/services/history');
history.goBack.mockImplementation(jest.fn());

describe('Back component', () => {
  it('should be able to bac to previous page', () => {
    const { getByTestId } = render(<Back />);

    fireEvent.click(getByTestId('back'));
    expect(history.goBack).toHaveBeenCalled();
  });
});
