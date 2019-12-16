import React from 'react';

import { Container, Dot } from './styles';

export default function Loading() {
  return (
    <Container>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(key => (
        <Dot key={key} />
      ))}
    </Container>
  );
}
