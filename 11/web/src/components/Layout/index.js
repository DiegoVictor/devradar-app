import React from 'react';
import PropTypes from 'prop-types';

import Theme, { Container } from './styles';

export default function Layout({ children }) {
  return (
    <Container>
      <Theme />
      {children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
