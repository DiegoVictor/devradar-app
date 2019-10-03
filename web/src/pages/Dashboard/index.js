import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { Spots, Spot, Banner } from './styles';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
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

  return (
    <>
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
