import React from 'react';

import history from '~/services/history';
import { Button } from './styles';

export default function Back() {
  return (
    <Button type="button" onClick={() => history.goBack()}>
      <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24">
        <path
          fill="#FFFFFF"
          d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
        />
      </svg>
    </Button>
  );
}
