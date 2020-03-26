import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import Logo from '~/assets/logo.svg';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import Link from '~/components/Link';
import UserContext from '~/contexts/User';
import api from '~/services/api';
import { Container, Incidents, Header } from './styles';

export default () => {
  const {
    user: { id, name },
  } = useContext(UserContext);
  const [incidents, setIncidents] = useState([]);
  const history = useHistory();

  const handleLogout = useCallback(
    (setUser) => {
      localStorage.removeItem('bethehero_user');
      // TODO erase context user
      setUser({});
      history.push('/');
    },
    [history]
  );

  const handleDeleteIncident = useCallback(
    async (incident_id) => {
      try {
        await api.delete(`/incidents/${incident_id}`, {
          headers: {
            Authorization: id,
          },
        });
        setIncidents(
          incidents.filter((incident) => incident.id !== incident_id)
        );
      } catch (err) {
        alert('Erro ao remover caso, tente novamente!');
      }
    },
    [incidents, id]
  );

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/ong_incidents', {
        headers: {
          Authorization: id,
        },
      });
      setIncidents(data);
    })();
  }, [id]);

  return (
    <Layout>
      <Container>
        <Header>
          <img src={Logo} alt="Be The Hero" />
          <span>Olá, {name}</span>

          <Link to="/incidents/create">
            <Button type="button">Novo caso</Button>
          </Link>

          <UserContext.Consumer>
            {({ setUser }) => (
              <button type="button" onClick={() => handleLogout(setUser)}>
                <FiPower size={20} color="#E02041" />
              </button>
            )}
          </UserContext.Consumer>
        </Header>

        <h1>Casos</h1>

        <Incidents>
          {incidents.map((incident) => (
            <li key={String(incident.id)}>
              <strong>Caso:</strong>
              <p>{incident.title}</p>
              <strong>Descrição:</strong>
              <p>{incident.description}</p>

              <strong>Valor:</strong>
              <p>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(incident.value)}
              </p>

              <button
                type="button"
                onClick={() => handleDeleteIncident(incident.id)}
              >
                <FiTrash2 size={20} color="#A8A8B3" />
              </button>
            </li>
          ))}
        </Incidents>
      </Container>
    </Layout>
  );
};
