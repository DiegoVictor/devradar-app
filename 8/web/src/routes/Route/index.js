import React from 'react';
import { Route as ReactRouterRoute, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/User';

export default function Route({
  privated,
  guest,
  component: Component,
  ...rest
}) {
  return (
    <UserContext.Consumer>
      {user => (
        <ReactRouterRoute
          {...rest}
          render={props => {
            if (!user.token) {
              if (privated) {
                return <Redirect to="/login" />;
              }
            } else if (guest) {
              return <Redirect to="/developers" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </UserContext.Consumer>
  );
}

Route.propTypes = {
  privated: PropTypes.bool,
  guest: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

Route.defaultProps = {
  privated: false,
  guest: false,
};
