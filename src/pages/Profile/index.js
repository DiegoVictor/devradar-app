import React from 'react';
import { useRoute } from '@react-navigation/native';

import { Github } from './styles';

export default () => {
  const { params } = useRoute();
  const { githubUsername } = params;
  return <Github source={{ uri: `https://github.com/${githubUsername}` }} />;
};
