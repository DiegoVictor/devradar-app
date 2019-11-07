import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { AsyncStorage, ScrollView, Alert } from 'react-native';
import socketio from 'socket.io-client';
import Constants from 'expo-constants';

import Logo from '~/assets/logo.png';
import { Container, Brand } from './styles';
import SpotList from '~/components/SpotList';

const { API_URL } = Constants.manifest.extra;

export default function List() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('aircnc_user').then(user_id => {
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
    });
  }, []);

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
      <ScrollView>
        <Brand resizeMode="contain" source={Logo} />

        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </Container>
  );
}
