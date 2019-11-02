import React, { useCallback, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ScrollView, AsyncStorage, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import pt from 'date-fns/locale/pt-BR';

import {
  Container,
  Brand,
  Title,
  Bold,
  List,
  Spot,
  Columns,
  About,
  Big,
  Status,
  Thumbnail,
  Company,
  Price,
  Button,
  WhiteText,
} from './styles';
import Logo from '~/assets/logo.png';
import api from '~/services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const handleCancelation = useCallback(id => {
    AsyncStorage.getItem('aircnc_user').then(async user_id => {
      try {
        await api.post(
          `bookings/${id}/rejection`,
          {},
          {
            headers: {
              user_id,
            },
          }
        );

        setBookings(bookings.filter(booking => booking._id !== id));
        Alert.alert('Reserva cancelada');
      } catch (err) {
        const { error } = err.response.data;
        Alert.alert(error);
      }
    });
  });

  useEffect(() => {
    AsyncStorage.getItem('aircnc_user').then(async user_id => {
      const { data } = await api.get('bookings', {
        headers: { user_id },
      });

      setBookings(data);
    });
  }, []);

  return (
    <Container>
      <ScrollView>
        <Brand resizeMode="contain" source={Logo} />

        <Title>
          Seus spots <Bold>reservados/pendentes</Bold>
        </Title>
        <List
          data={bookings}
          keyExtractor={booking => booking._id}
          renderItem={({ item: booking }) => (
            <Spot>
              <Columns>
                <About>
                  <Thumbnail
                    resizeMode="cover"
                    source={{ uri: booking.spot.thumbnail_url }}
                  />
                </About>
                <Status>
                  <Text>Reserva para o dia:</Text>
                  <Big>
                    {format(parseISO(booking.date), "dd'/'MM'/'yyyy", {
                      locale: pt,
                    })}
                  </Big>
                  <Text>Status:</Text>
                  <Big>{booking.approved ? 'Aprovado' : 'Em aprovação'}</Big>
                </Status>
              </Columns>

              <Company>{booking.spot.company}</Company>
              <Price>
                {booking.spot.price
                  ? `R$ ${booking.spot.price}/DIA`
                  : 'GRATUITO'}
              </Price>
              <Button onPress={() => handleCancelation(booking._id)}>
                <WhiteText>Cancelar reserva</WhiteText>
              </Button>
            </Spot>
          )}
        />
      </ScrollView>
    </Container>
  );
}

Bookings.navigationOptions = {
  tabBarLabel: 'Bookings',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="date-range" size={20} color={tintColor} />
  ),
};
