import React from 'react';
import PropTypes from 'prop-types';

import ItsAMatch from '~/assets/itsamatch.png';
import { Container, Avatar } from './styles';

export default function Match({ developer, setDeveloper }) {
  return (
    <Container>
      <img src={ItsAMatch} alt="It's a Match" />

      <Avatar className="avatar" src={developer.avatar} alt={developer.name} />
      <strong>{developer.name}</strong>
      <p>{developer.bio}</p>
      <button type="button" onClick={() => setDeveloper(null)}>
        Fechar
      </button>
    </Container>
  );
}

Match.propTypes = {
  developer: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }).isRequired,
  setDeveloper: PropTypes.func.isRequired,
};
