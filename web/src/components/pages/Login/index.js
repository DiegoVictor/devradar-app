import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import Logo from '~/assets/logo.svg';
import api from '~/services/api';
import { Container, Button } from './styles';

export default function Login({ history }) {
  async function handleSubmit({ username }) {
    const { data } = await api.post('developers', { username });
    localStorage.setItem('tindev_user', data._id);
    history.push(`/developers/${data._id}`);
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <img src={Logo} alt="Tindev" />
        <Input
          name="username"
          type="text"
          placeholder="Digite seu usuário no Github"
        />
        <Button type="submit">Enviar</Button>
      </Form>
    </Container>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
