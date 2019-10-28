import React, { useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import api from '~/services/api';

export default function SignIn({ history }) {
  const handleSubmit = useCallback(
    async ({ email }) => {
      const response = await api.post('sessions', { email });

      const { _id } = response.data;
      localStorage.setItem('aircnc_user', _id);

      history.push('/dashboard');
    },
    [history]
  );

  return (
    <>
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
        />

        <button type="submit">Enviar</button>
      </Form>
    </>
  );
}

SignIn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
