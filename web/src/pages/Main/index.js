import React, { useEffect, useState, useContext } from 'react';

import Like from '~/assets/like.png';
import Dislike from '~/assets/dislike.png';
import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { connect, subscribe, disconnect } from '~/services/socket';
import Layout from '~/components/Layout';
import Loading from '~/components/Loading';
import Match from '~/components/Match';
import Menu from '~/components/Menu';
import { Developers, Developer, Bio, Actions, Center } from './styles';

export default () => {
  const [developers, setDevelopers] = useState([]);
  const [developer, setDeveloper] = useState(null);
  const [preload, setPreloading] = useState(false);

  const { id, token } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/developers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDevelopers(data);
      setPreloading(true);
    })();
  }, [token]);

  useEffect(() => {
    disconnect();
    connect({ developer_id: id });
    subscribe('match', dev => {
      setDeveloper(dev);
    });
  }, [id]);

  async function handleLike(dev_id) {
    await api.post(
      `/developers/${dev_id}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setDevelopers(developers.filter(dev => dev._id !== dev_id));
  }

  async function handleDislike(dev_id) {
    await api.post(
      `/developers/${dev_id}/dislike`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setDevelopers(developers.filter(dev => dev._id !== dev_id));
  }

  return (
    <Layout>
      <Menu active="developers" />

      {developers.length > 0 ? (
        <Developers>
          {developers.map(dev => (
            <Developer key={dev._id} data-testid={`developer_${dev._id}`}>
              <img src={dev.avatar} alt={dev.name} />
              <Bio>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </Bio>

              <Actions>
                <button
                  data-testid={`developer_dislike_${dev._id}`}
                  title="Sai da minha stack developer nutela"
                  type="button"
                  onClick={() => handleDislike(dev._id)}
                >
                  <img src={Dislike} alt="Dislike" />
                </button>
                <button
                  data-testid={`developer_like_${dev._id}`}
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
    </Layout>
  );
};
