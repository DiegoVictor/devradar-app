import React from 'react';
import PropTypes from 'prop-types';

import { Github } from './styles';

export default function Profile({ navigation }) {
  const github_username = navigation.getParam('github_username');
  return <Github source={{ uri: `https://github.com/${github_username}` }} />;
}

Profile.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
