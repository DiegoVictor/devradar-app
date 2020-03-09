import React, { useCallback, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import pt from 'date-fns/locale/pt-BR';

import Logo from '~/assets/logo.png';
import api from '~/services/api';
import { disconnect, connect, subscribe } from '~/services/socket';
import {
  Container,
  Brand,
  Title,
  Bold,
  Centralize,
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

export default () => {
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const handleRefresh = useCallback(() => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('aircnc_user'));
      const { data } = await api.get('bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(data);
      setRefreshing(false);
    })();
  });

  const handleCancelation = useCallback(id => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('aircnc_user'));

      try {
        await api.post(
          `bookings/${id}/rejection`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(bookings.filter(booking => booking._id !== id));
        Alert.alert('Reserva cancelada');
      } catch (err) {
        const { error } = err.response.data;
        Alert.alert(error);
      }
    })();
  });

  useEffect(() => {
    (async () => {
      const { _id: user_id } = JSON.parse(
        await AsyncStorage.getItem('aircnc_user')
      );

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
    handleRefresh();
  }, []);

  return (
    <Container>
      <Centralize>
        <List
          data={bookings}
          keyExtractor={booking => booking._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <>
              <Brand resizeMode="contain" source={Logo} />

              <Title>
                Seus spots <Bold>reservados/pendentes</Bold>
              </Title>
            </>
          }
          renderItem={({ item: booking }) => (
            <Spot testID={`booking_${booking._id}`}>
              <Columns>
                <About>
                  <Thumbnail
                    resizeMode="cover"
                    source={{ uri: booking.spot.thumbnail_url }}
                  />
                </About>
                <Status>
                  <Text>Reserva para o dia:</Text>
                  <Big testID={`booking_date_${booking._id}`}>
                    {format(parseISO(booking.date), "dd'/'MM'/'yyyy", {
                      locale: pt,
                    })}
                  </Big>
                  <Text>Status:</Text>
                  <Big testID={`booking_status_${booking._id}`}>
                    {booking.approved ? 'Aprovado' : 'Em aprovação'}
                  </Big>
                </Status>
              </Columns>

              <Company>{booking.spot.company}</Company>
              <Price testID={`booking_price_${booking._id}`}>
                {booking.spot.price
                  ? `R$ ${booking.spot.price}/DIA`
                  : 'GRATUITO'}
              </Price>
              <Button
                testID={`booking_cancel_${booking._id}`}
                onPress={() => handleCancelation(booking._id)}
              >
                <WhiteText>Cancelar reserva</WhiteText>
              </Button>
            </Spot>
          )}
        />
      </Centralize>
    </Container>
  );
};
