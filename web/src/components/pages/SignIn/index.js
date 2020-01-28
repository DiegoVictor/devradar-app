import React, { useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import PropTypes from 'prop-types';

import Box from '~/components/Box';
import api from '~/services/api';

export default function SignIn({ history }) {
  const handleSubmit = useCallback(
    async ({ email }) => {
      const { data } = await api.post('sessions', { email });

      const { _id, token } = data;
      localStorage.setItem('aircnc_user', JSON.stringify({ id: _id, token }));

      history.push('/dashboard');
    },
    [history]
  );

  return (
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
  );
}

SignIn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
