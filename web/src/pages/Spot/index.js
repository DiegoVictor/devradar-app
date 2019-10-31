import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import PropTypes from 'prop-types';

import api from '~/services/api';
import Camera from '~/assets/camera.svg';
import { Thumbnail } from './styles';

export default function Spot({ history, match }) {
  const [spot, setSpot] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const showPreview = useCallback(event => {
    const file = event.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  }, []);
  const { id } = match.params;

  useEffect(() => {
    (async () => {
      if (id) {
        const { data } = await api.get(`spots/${id}`, {});
        setSpot(data);
        setPreview(data.thumbnail_url);
      }
    })();
  }, [id]);

  const handleSubmit = useCallback(
    async ({ company, techs, price }) => {
      const data = new FormData();

      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      data.append('company', company);
      data.append('techs', techs);
      data.append('price', price);

      if (id) {
        await api.put(`spots/${id}`, data, {
          headers: {
            user_id: localStorage.getItem('aircnc_user'),
          },
        });
        history.push(`/spots/${id}`);
      } else {
        await api.post('spots', data, {
          headers: {
            user_id: localStorage.getItem('aircnc_user'),
          },
        });
        history.push('/dashboard');
      }
    },
    [history, id, thumbnail]
  );

  return (
    <Form onSubmit={handleSubmit} initialData={spot}>
      <Thumbnail url={preview}>
        <input type="file" onChange={showPreview} />
        <img src={Camera} alt="Selecionar imagem" />
      </Thumbnail>

      <label htmlFor="company">EMRESA *</label>
      <Input id="company" name="company" placeholder="Sua empresa incrível" />

      <label htmlFor="techs">
        TECNOLOGIAS * <span>(separadas por vírgula)</span>
      </label>
      <Input id="techs" name="techs" placeholder="Quais tecnologias usam?" />

      <label htmlFor="price">
        DIÁRIA * <span>(em branco para gratuito)</span>
      </label>
      <Input id="price" name="price" placeholder="Valor cobrado por dia" />

      <button type="submit">Cadastrar</button>
    </Form>
  );
}

Spot.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
