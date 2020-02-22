import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Logo from '~/assets/logo.png';
import SpotList from '~/components/SpotList';
import { connect, disconnect, subscribe } from '~/services/socket';
import { Container, Brand } from './styles';

export default () => {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    (async () => {
      disconnect();
      connect({ user_id });

      subscribe('booking_response', booking => {
        const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
        Alert.alert(
          `Sua reserva em ${booking.spot.company} para ${date} foi ${
            booking.approved ? 'APROVADA' : 'REJEITADA'
          }`
        );
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const technologies = await AsyncStorage.getItem('aircnc_techs');
      if (technologies) {
        const list = technologies.split(',').map(tech => tech.trim());
        setTechs(list);
      }
    })();
  }, []);

  return (
    <Container>
      <ScrollView>
        <Brand resizeMode="contain" source={Logo} />

        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </Container>
  );
};
