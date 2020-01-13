import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { AsyncStorage, ScrollView, Alert } from 'react-native';
import socketio from 'socket.io-client';
import Constants from 'expo-constants';

import Logo from '~/assets/logo.png';
import SpotList from '~/components/SpotList';
import { Container, Brand } from './styles';

const { API_URL } = Constants.manifest.extra;

export default () => {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    (async () => {
      const user_id = await AsyncStorage.getItem('aircnc_user');
      const socket = socketio(API_URL, {
        query: { user_id },
      });

      socket.on('booking_response', booking => {
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
