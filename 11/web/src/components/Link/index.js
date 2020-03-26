import React from 'react';
import PropTypes from 'prop-types';

import { Container } from './styles';

export default function Link({ to, children }) {
  return <Container to={to}>{children}</Container>;
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.element,
  ]).isRequired,
};
