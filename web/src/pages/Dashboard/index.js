import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { disconnect, connect, subscribe } from '~/services/socket';
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
import Layout from '~/components/Layout';

export default () => {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);
  const { id: user_id, token } = useContext(UserContext);

  const approve = useCallback(
    booking_id => {
      (async () => {
        await api.post(
          `bookings/${booking_id}/approval`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(requests.filter(request => request._id !== booking_id));
      })();
    },
    [requests, token]
  );

  const reject = useCallback(
    booking_id => {
      (async () => {
        await api.post(
          `bookings/${booking_id}/rejection`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(requests.filter(request => request._id !== booking_id));
      })();
    },
    [requests, token]
  );

  useEffect(() => {
    (async () => {
      const response = await api.get(`/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSpots(response.data);
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('pending', {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, [token]);

  useEffect(() => {
    disconnect();
    connect({ user_id });
    subscribe('booking_request', data => {
      setRequests([
        ...requests,
        {
          ...data,
          date: format(parseISO(data.date), "dd'/'MM'/'yyyy"),
        },
      ]);
    });
  }, [requests, user_id]);

  return (
    <Layout>
      <Box>
        {requests.length > 0 && (
          <Notifications>
            {requests.map(request => (
              <Notification
                key={request._id}
                data-testid={`notification_${request._id}`}
              >
                <p>
                  <strong>{request.user.email}</strong> está solicitando uma
                  nova reserva em <strong>{request.spot.company}</strong> para a
                  data:&nbsp;
                  <strong>{request.date}</strong>
                </p>
                <Accept
                  data-testid={`notification_approve_${request._id}`}
                  type="button"
                  onClick={() => approve(request._id)}
                >
                  ACEITAR
                </Accept>
                <Cancel
                  data-testid={`notification_reject_${request._id}`}
                  type="button"
                  onClick={() => reject(request._id)}
                >
                  REJEITAR
                </Cancel>
              </Notification>
            ))}
          </Notifications>
        )}
        {spots.length > 0 && (
          <Spots>
            {spots.map(spot => (
              <Link to={`/spots/${spot._id}`} key={spot._id}>
                <Spot key={spot._id} data-testid={`spot_${spot._id}`}>
                  <Banner url={spot.thumbnail_url} />
                  <strong>{spot.company}</strong>
                  <span>
                    {spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}
                  </span>
                </Spot>
              </Link>
            ))}
          </Spots>
        )}
        <Link to="/spot" data-testid="new">
          <button type="button">Novo spot</button>
        </Link>
      </Box>
    </Layout>
  );
};
