import React, { useCallback, useEffect, useState, useContext } from 'react';
import { parseISO, format } from 'date-fns';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Back from '~/components/Back';
import Box from '~/components/Box';
import { Spot, Banner, Techs, Bookings, LinkButton } from './styles';
import Layout from '~/components/Layout';

export default function Details({ match }) {
  const [spot, setSpot] = useState(null);
  const { token } = useContext(UserContext);
  const { id: spot_id } = match.params;

  const reject = useCallback(
    booking_id => {
      (async () => {
        await api.post(`bookings/${booking_id}/rejection`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const bookings = spot.bookings.filter(
          booking => booking._id !== booking_id
        );
        setSpot({ ...spot, bookings });
      })();
    },
    [spot, token]
  );

  const deleteSpot = useCallback(
    id => {
      (async () => {
        await api.delete(`spots/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        history.push('/dashboard');
      })();
    },
    [token]
  );

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`spots/${spot_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSpot({
        ...data,
        bookings: data.bookings.map(booking => ({
          ...booking,
          date: format(parseISO(booking.date), "dd'/'MM'/'yyyy"),
        })),
      });
    })();
  }, [spot_id, token]);

  return (
    <Layout>
      <Back />
      {spot && (
        <Box>
          <ul>
            <Spot>
              <div>
                <Techs>
                  {spot.techs.map(tech => (
                    <span key={tech}>{tech}</span>
                  ))}
                </Techs>
                <LinkButton to={`/spots/${spot_id}/edit`} data-testid="edit">
                  Editar
                </LinkButton>
              </div>
              <Banner url={spot.thumbnail_url} data-testid="banner" />
              <strong>{spot.company}</strong>
              <span>
                {spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}
              </span>
            </Spot>
          </ul>
          {spot.bookings.length > 0 ? (
            <Bookings>
              <thead>
                <tr>
                  <th colSpan="3">Reservas aprovadas</th>
                </tr>
              </thead>
              <tbody>
                {spot.bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.user.email}</td>
                    <td>{booking.date}</td>
                    <td>
                      <button
                        data-testid={`booking_reject_${booking.id}`}
                        type="button"
                        onClick={() => reject(booking._id)}
                      >
                        <svg
                          style={{ width: '23px', height: '23px' }}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#555"
                            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                          />
                        </svg>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Bookings>
          ) : (
            <button
              data-testid="delete"
              type="button"
              onClick={() => deleteSpot(spot_id)}
            >
              Remover Spot
            </button>
          )}
        </Box>
      )}
    </Layout>
  );
}

Details.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};
