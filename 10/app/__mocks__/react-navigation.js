import React from 'react';

export function withNavigation(Component) {
  return props => {
    return <Component navigation={{ navigate: jest.fn() }} {...props} />;
  };
}
