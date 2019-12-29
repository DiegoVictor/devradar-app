import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import { format, parseISO } from 'date-fns';

import api from '~/services/api';
import Box from '~/components/Box';
import {
  Spots,
  Spot,
  Banner,
  Notifications,
  Notification,
  Accept,
  Cancel,
} from './styles';

export default () => {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);
  const user_id = localStorage.getItem('aircnc_user');

  useEffect(() => {
    (async () => {
      const response = await api.get(`/dashboard`, {
        headers: {
          user_id,
        },
      });

      setSpots(response.data);
    })();
  }, [user_id]);

  const socket = useMemo(
    () =>
      socketio(process.env.REACT_APP_API_URL, {
        query: { user_id },
      }),
    [user_id]
  );

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`pending`, {
        headers: {
          user_id,
        },
      });

      setRequests(
        data.map(request => {
          return {
            ...request,
            date: format(parseISO(request.date), "dd'/'MM'/'yyyy"),
          };
        })
      );
    })();
  }, [user_id]);

  useEffect(() => {
    socket.on('booking_request', data => {
      setRequests([
        ...requests,
        {
          ...data,
          date: format(parseISO(data.date), "dd'/'MM'/'yyyy"),
        },
      ]);
    });
  }, [requests, socket]);

  const approve = useCallback(
    id => {
      (async () => {
        await api.post(
          `bookings/${id}/approval`,
          {},
          {
            headers: {
              user_id: localStorage.getItem('aircnc_user'),
            },
          }
        );
        setRequests(requests.filter(request => request._id !== id));
      })();
    },
    [requests]
  );

  const reject = useCallback(
    id => {
      (async () => {
        await api.post(
          `bookings/${id}/rejection`,
          {},
          {
            headers: {
              user_id: localStorage.getItem('aircnc_user'),
            },
          }
        );
        setRequests(requests.filter(request => request._id !== id));
      })();
    },
    [requests]
  );

  return (
    <Box>
      <>
        {requests.length > 0 && (
          <Notifications>
            {requests.map(request => (
              <Notification key={request._id}>
                <p>
                  <strong>{request.user.email}</strong> está solicitando uma
                  nova reserva em <strong>{request.spot.company}</strong> para a
                  data:&nbsp;
                  <strong>{request.date}</strong>
                </p>
                <Accept type="button" onClick={() => approve(request._id)}>
                  ACEITAR
                </Accept>
                <Cancel type="button" onClick={() => reject(request._id)}>
                  REJEITAR
                </Cancel>
              </Notification>
            ))}
          </Notifications>
        )}
        <Spots>
          {spots.map(spot => (
            <Link to={`/spots/${spot._id}`} key={spot._id}>
              <Spot key={spot._id}>
                <Banner url={spot.thumbnail_url} />
                <strong>{spot.company}</strong>
                <span>
                  {spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}
                </span>
              </Spot>
            </Link>
          ))}
        </Spots>
        <Link to="/spot">
          <button type="button">Novo spot</button>
        </Link>
      </>
    </Box>
  );
};
