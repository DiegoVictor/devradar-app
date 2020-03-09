import React from 'react';
import PropTypes from 'prop-types';

import Logo from '~/assets/logo.svg';
import Theme, { Container } from './styles';

export default function Layout({ children }) {
  return (
    <Container>
      <Theme />

      <img src={Logo} alt="Aircnc" />
      {children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
