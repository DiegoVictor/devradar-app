import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

import Logo from '../../../assets/logo.png';
import { Container, Brand } from './styles';
import SpotList from '../../SpotList';

export default function List() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('aircnc_techs').then(technologies => {
      if (technologies) {
        const list = technologies.split(',').map(tech => tech.trim());
        setTechs(list);
      }
    });
  }, []);

  return (
    <Container>
      <Brand resizeMode="contain" source={Logo} />

      {techs.map(tech => (
        <SpotList key={tech} tech={tech} />
      ))}
    </Container>
  );
}
