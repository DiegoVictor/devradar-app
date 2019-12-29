import React from 'react';
import PropTypes from 'prop-types';

import { Container } from './styles';

export default function Box({ children }) {
  return <Container>{children}</Container>;
}

Box.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element])
    .isRequired,
};
