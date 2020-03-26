import React, { useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import Logo from '~/assets/logo.svg';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Layout from '~/components/Layout';
import Link from '~/components/Link';
import { Container, Form, Section } from './styles';
import api from '~/services/api';

export default () => {
  const history = useHistory();
  const handleRegister = useCallback(
    async ({ name, email, whatsapp, city, state }) => {
      try {
        await api.post('ongs', {
          name,
          email,
          whatsapp,
          city,
          uf: state,
        });

        history.push('/');
      } catch (err) {
        alert('Erro ao cadastrar ONG, tente novamente!');
      }
    },
    [history]
  );

  return (
    <Layout>
      <Container>
        <div>
          <Section>
            <img src={Logo} alt="Be The Hero" />
            <h1>Cadastro</h1>
            <p>
              Faça seu cadastro, entre na plataforma e ajude pessoas a
              encontrarem os casos da sua ONG.
            </p>
            <Link to="/">
              <FiArrowLeft size={20} color="#E02041" />
              Já tenho cadastro
            </Link>
          </Section>

          <Form onSubmit={handleRegister}>
            <Input name="name" placeholder="Nome da ONG" />
            <Input name="email" type="email" placeholder="Email" />
            <Input name="whatsapp" placeholder="WhatsApp" />

            <div>
              <Input name="city" placeholder="Cidade" />
              <Input name="state" placeholder="UF" style={{ width: 80 }} />
            </div>

            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Container>
    </Layout>
  );
};
