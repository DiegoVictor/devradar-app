import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { connect, subscribe, disconnect } from '~/services/socket';
import Match from '~/components/Match';
import Menu from '~/components/Menu';
import { Developers, Developer, Avatar, Description, Bio } from './styles';
import Layout from '~/components/Layout';

export default () => {
  const [developer, setDeveloper] = useState(null);
  const [matches, setMatches] = useState([]);
  const { id, token } = useContext(UserContext);

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(data);
    })();
  }, [id, token]);

  return (
    <Layout>
      <Menu active="matches" />

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
    </Layout>
  );
};
