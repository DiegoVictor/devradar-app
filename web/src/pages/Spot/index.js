import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Form, Input } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import Camera from '~/assets/camera.svg';
import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import Back from '~/components/Back';
import Box from '~/components/Box';
import { Thumbnail } from './styles';
import history from '~/services/history';
import Layout from '~/components/Layout';

const schema = Yup.object().shape({
  company: Yup.string().required('Informe o nome da sua empresa'),
  techs: Yup.string().required('Informe as tecnologias vocês usam'),
  price: Yup.string(),
});

export default function Spot({ match }) {
  const [spot, setSpot] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const { token } = useContext(UserContext);
  const { id: spot_id } = match.params;

  const showPreview = useCallback(event => {
    const file = event.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = useCallback(
    async ({ company, techs, price }) => {
      const data = new FormData();

      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      data.append('company', company);
      data.append('techs', techs);

      if (price) {
        data.append('price', price);
      }

      if (spot_id) {
        await api.put(`spots/${spot_id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        history.push(`/spots/${spot_id}`);
      } else {
        await api.post('spots', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        history.push('/dashboard');
      }
    },
    [spot_id, thumbnail, token]
  );

  useEffect(() => {
    (async () => {
      if (spot_id) {
        const { data } = await api.get(`spots/${spot_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSpot(data);
        setPreview(data.thumbnail_url);
      }
    })();
  }, [spot_id, token]);

  return (
    <Layout>
      <Back />
      <Box>
        <Form schema={schema} onSubmit={handleSubmit} initialData={spot}>
          <Thumbnail url={preview}>
            <input data-testid="banner" type="file" onChange={showPreview} />
            <img src={Camera} alt="Selecionar imagem" />
          </Thumbnail>

          <label htmlFor="company">EMPRESA *</label>
          <Input
            id="company"
            name="company"
            placeholder="Sua empresa incrível"
          />

          <label htmlFor="techs">
            TECNOLOGIAS * <span>(separadas por vírgula)</span>
          </label>
          <Input
            id="techs"
            name="techs"
            placeholder="Quais tecnologias usam?"
          />

          <label htmlFor="price">
            DIÁRIA * <span>(em branco para gratuito)</span>
          </label>
          <Input id="price" name="price" placeholder="Valor cobrado por dia" />

          <button type="submit">Enviar</button>
        </Form>
      </Box>
    </Layout>
  );
}

Spot.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};
