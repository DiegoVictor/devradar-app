import React, { useCallback } from 'react';
import { FiPlusSquare } from 'react-icons/fi';

// import { useHistory } from 'react-router-dom';
import Heroes from '~/assets/heroes.png';
import Logo from '~/assets/logo.svg';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import { Container, Form } from './styles';
import Link from '~/components/Link';
import Input from '~/components/Input';
import api from '~/services/api';
import UserContext from '~/contexts/User';

export default () => {
  // const history = useHistory();
  const handleLogin = useCallback(async ({ id }, setUser) => {
    try {
      const { data } = await api.post('sessions', { id });
      localStorage.setItem(
        'bethehero_user',
        JSON.stringify({
          id,
          name: data.ong.name,
        })
      );
      // TODO update context
      setUser({ id, name: data.ong.name });
      // history.push('/incidents');
    } catch (err) {
      console.log(err);

      alert('Usuário ou senha incorreto(s)!');
    }
  }, []);
  return (
    <Layout>
      <Container>
        <section>
          <img src={Logo} alt="Be The Hero" />
          <UserContext.Consumer>
            {({ setUser }) => (
              <Form onSubmit={(data) => handleLogin(data, setUser)}>
                <h1>Faça seu logon</h1>

                <Input name="id" placeholder="Seu ID" />
                <Button type="submit">Entrar</Button>

                <Link to="/register">
                  <FiPlusSquare size={20} color="#E02041" />
                  Não tenho cadastro
                </Link>
              </Form>
            )}
          </UserContext.Consumer>
        </section>
        <img src={Heroes} alt="Heroes" />
      </Container>
    </Layout>
  );
};
