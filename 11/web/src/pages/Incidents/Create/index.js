import React, { useCallback, useContext } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import Logo from '~/assets/logo.svg';
import Layout from '~/components/Layout';
import Link from '~/components/Link';
import Button from '~/components/Button';
import Input from '~/components/Input';
import UserContext from '~/contexts/User';
import api from '~/services/api';
import { Container, Form, Section } from './styles';

export default () => {
  const { id } = useContext(UserContext);
  const history = useHistory();
  const handleCreate = useCallback(
    async ({ title, description, value }) => {
      try {
        await api.post(
          'incidents',
          { title, description, value },
          {
            headers: {
              Authorization: id,
            },
          }
        );

        history.push('/incidents');
      } catch (err) {
        alert('Erro ao cadastrar caso, tente novamente!');
      }
    },
    [history, id]
  );

  return (
    <Layout>
      <Container>
        <div>
          <Section>
            <img src={Logo} alt="Be The Hero" />
            <h1>Novo Caso</h1>
            <p>
              Descreva o caso detalhadamente para encontrar um héroi para
              resolver isso.
            </p>
            <Link to="/incidents">
              <FiArrowLeft size={20} color="#E02041" />
              Voltar
            </Link>
          </Section>

          <Form onSubmit={handleCreate}>
            <Input name="title" placeholder="Título do caso" />
            <Input type="textarea" name="description" placeholder="Descrição" />
            <Input name="value" placeholder="Valor em reais" />

            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Container>
    </Layout>
  );
};
