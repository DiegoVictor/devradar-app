import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import Like from '~/assets/like.png';
import Dislike from '~/assets/dislike.png';
import Loading from '~/components/Loading';
import api from '~/services/api';
import Match from '~/components/Match';
import Menu from '~/components/Menu';
import {
  Container,
  Developers,
  Developer,
  Bio,
  Actions,
  Center,
} from './styles';

export default function Main({ match, history }) {
  const [developers, setDevelopers] = useState([]);
  const [developer, setDeveloper] = useState(null);
  const { id } = match.params;

  const [preload, setPreloading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/developers', {
        headers: { user_id: id },
      });
      setDevelopers(data);
      setPreloading(true);
    })();
  }, [id]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      query: { developer_id: id },
    });

    socket.on('match', dev => {
      setDeveloper(dev);
    });
  }, [id]);

  async function handleLike(dev_id) {
    await api.post(
      `/developers/${dev_id}/like`,
      {},
      {
        headers: { user_id: id },
      }
    );
    setDevelopers(developers.filter(dev => dev._id !== dev_id));
  }

  async function handleDislike(dev_id) {
    await api.post(
      `/developers/${dev_id}/dislike`,
      {},
      {
        headers: { user_id: id },
      }
    );
    setDevelopers(developers.filter(dev => dev._id !== dev_id));
  }

  return (
    <Container>
      <Menu history={history} id={id} active="developers" />

      {developers.length > 0 ? (
        <Developers>
          {developers.map(dev => (
            <Developer key={dev._id}>
              <img src={dev.avatar} alt={dev.name} />
              <Bio>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </Bio>

              <Actions>
                <button
                  title="Sai da minha stack developer nutela"
                  type="button"
                  onClick={() => handleDislike(dev._id)}
                >
                  <img src={Dislike} alt="Dislike" />
                </button>
                <button
                  title="Bora #codar"
                  type="button"
                  onClick={() => handleLike(dev._id)}
                >
                  <img src={Like} alt="Like" />
                </button>
              </Actions>
            </Developer>
          ))}
        </Developers>
      ) : (
        <Center>
          {!preload ? <Loading /> : 'Sem sugestões no momento :('}
        </Center>
      )}

      {developer && <Match developer={developer} setDeveloper={setDeveloper} />}
    </Container>
  );
}

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
