import React from 'react';
import PropTypes from 'prop-types';
import { Container, Box } from './styles';
import Logo from '../assets/logo.svg';

export default function Default({ children }) {
  return (
    <Container>
      <img src={Logo} alt="Aircnc" />

      <Box>{children}</Box>
    </Container>
  );
}

Default.propTypes = {
  children: PropTypes.element.isRequired,
};
