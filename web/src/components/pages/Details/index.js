import React, { useCallback, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import PropTypes from 'prop-types';

import { Spot, Banner, Techs, Bookings, LinkButton } from './styles';
import api from '~/services/api';
import Box from '~/components/Box';
import Back from '~/components/Back';

export default function Details({ match, history }) {
  const [spot, setSpot] = useState(null);
  const { id } = match.params;
  const user_id = localStorage.getItem('aircnc_user');

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`spots/${id}`);

      setSpot({
        ...data,
        bookings: data.bookings.map(booking => ({
          ...booking,
          date: format(parseISO(booking.date), "dd'/'MM'/'yyyy"),
        })),
      });
    })();
  }, [id]);

  const reject = useCallback(
    booking_id => {
      (async () => {
        await api.post(`bookings/${booking_id}/rejection`);
        const bookings = spot.bookings.filter(
          booking => booking._id !== booking_id
        );
        setSpot({ ...spot, bookings });
      })();
    },
    [spot]
  );

  const deleteSpot = useCallback(
    spot_id => {
      (async () => {
        await api.delete(`spots/${spot_id}`, {
          headers: {
            user_id,
          },
        });
        history.push('/dashboard');
      })();
    },
    [history, user_id]
  );

  return (
    <>
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
                  <LinkButton to={`/spots/${id}/edit`}>Editar</LinkButton>
                </div>
                <Banner url={spot.thumbnail_url} />
                <strong>{spot.company}</strong>
                <span>
                  {spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}
                </span>
              </Spot>
            </ul>
            {spot.bookings.length > 0 && (
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
            )}

            {spot.bookings.length === 0 && (
              <button type="button" onClick={() => deleteSpot(id)}>
                Remover Spot
              </button>
            )}
      </Box>
      )}
    </>
  );
}

Details.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};
