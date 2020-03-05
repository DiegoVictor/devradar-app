import React, { useEffect, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import Logo from '~/assets/logo.svg';
import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import { Container, Nav, Href, Profile } from './styles';

export default function Menu({ active }) {
  const user = useContext(UserContext);
  const { id, token } = useMemo(() => user, [user]);
  const [me, setMe] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('tindev_user');
    delete user.id;
    delete user.token;
    history.push('/');
  };

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/developers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMe(data);
    })();
  }, [id, token]);

  return (
    <>
      {me && (
        <Container>
          <Nav>
            <img src={Logo} alt="Tindev" />
            {['developers', 'matches'].map(slug => (
              <Href to={`/${slug}`} active={active === slug ? 1 : 0} key={slug}>
                {slug}
              </Href>
            ))}
          </Nav>
          <button
            data-testid="logout"
            type="button"
            onClick={handleLogout}
            title="Sair"
          >
            <Profile>
              <img title="Sair" src={me.avatar} alt={me.name} />
              <div className="logout">
                <svg width="24px" height="24px" viewBox="0 0 24 24">
                  <path
                    fill="#DF4723"
                    d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"
                  />
                </svg>
              </div>
            </Profile>
          </button>
        </Container>
      )}
    </>
  );
}

Menu.propTypes = {
  active: PropTypes.string.isRequired,
};
