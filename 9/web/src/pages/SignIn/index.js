import React, { useCallback, useContext } from 'react';
import { Form, Input } from '@rocketseat/unform';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Box from '~/components/Box';
import Layout from '~/components/Layout';

export default () => {
  const user = useContext(UserContext);
  const handleSubmit = useCallback(
    async ({ email }) => {
      const { data } = await api.post('sessions', { email });

      const {
        user: { _id: id },
        token,
      } = data;

      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
      user.id = id;
      user.token = token;

      history.push('/dashboard');
    },
    [user.id, user.token]
  );

  return (
    <Layout>
      <Box>
        <p>
          Ofereça <strong>spots</strong> para programadores e encontre{' '}
          <strong>talentos</strong> para sua empresa
        </p>

        <Form onSubmit={handleSubmit}>
          <label htmlFor="email">Email *</label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Seu melhor email"
            required
          />

          <button type="submit">Enviar</button>
        </Form>
      </Box>
    </Layout>
  );
};
