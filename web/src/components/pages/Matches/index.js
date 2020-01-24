import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { connect, subscribe, disconnect } from '~/services/socket';
import Match from '~/components/Match';
import api from '~/services/api';
import Menu from '~/components/Menu';
import {
  Container,
  Developers,
  Developer,
  Avatar,
  Description,
  Bio,
} from './styles';

export default function Matches({ history }) {
  const id = localStorage.getItem('tindev_user');
  const [developer, setDeveloper] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    disconnect();
    connect({ developer_id: id });
    subscribe('match', dev => {
      setDeveloper(dev);
    });
  }, [id]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('matches', {
        headers: {
          user_id: id,
        },
      });
      setMatches(data);
    })();
  }, [id]);

  return (
    <Container>
      <Menu history={history} id={id} active="matches" />

      <Developers>
        {matches.map(match => (
          <Developer key={match._id} data-testid={`developer_${match._id}`}>
            <Avatar src={match.avatar} />
            <Description>
              <strong>{match.name}</strong>
              <Bio>{match.bio}</Bio>
            </Description>
          </Developer>
        ))}
      </Developers>

      {developer && <Match developer={developer} setDeveloper={setDeveloper} />}
    </Container>
  );
}

Matches.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
