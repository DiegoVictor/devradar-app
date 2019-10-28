import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '~/services/api';

import {
  Spots,
  Spot,
  Banner,
  Notifications,
  Notification,
  Accept,
  Cancel,
} from './styles';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/dashboard`, {
        headers: {
          user_id: localStorage.getItem('aircnc_user'),
        },
      });

      setSpots(response.data);
    })();
  }, []);

  const user_id = localStorage.getItem('aircnc_user');
  const socket = useMemo(
    () =>
      socketio('http://localhost:3333', {
        query: { user_id },
      }),
    [user_id]
  );

  useEffect(() => {
    socket.on('booking_request', data => {
      setRequests([...requests, data]);
    });
  }, [requests, socket]);

  const approve = useCallback(
    id => {
      (async () => {
        await api.post(`bookings/${id}/approval`);
        setRequests(requests.filter(request => request._id !== id));
      })();
    },
    [requests]
  );

  const reject = useCallback(
    id => {
      (async () => {
        await api.post(`bookings/${id}/rejection`);
        setRequests(requests.filter(request => request._id !== id));
      })();
    },
    [requests]
  );

  return (
    <>
      <Notifications>
        {requests.map(request => (
          <Notification key={request._id}>
            <p>
              <strong>{request.user.email}</strong> está solicitando uma nova
              reserva em <strong>{request.spot.company}</strong> para a
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
      <Spots>
        {spots.map(spot => (
          <Spot key={spot._id}>
            <Banner url={spot.thumbnail_url} />
            <strong>{spot.company}</strong>
            <span>{spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}</span>
          </Spot>
        ))}
      </Spots>
      <Link to="/spot">
        <button type="button">Novo spot</button>
      </Link>
    </>
  );
}
