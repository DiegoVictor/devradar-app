import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import api from '~/services/api';
import {
  Container,
  Title,
  Bold,
  List,
  Spot,
  Thumbnail,
  Company,
  Price,
  Button,
  WhiteText,
} from './styles';

export default function SpotList({ tech, ...props }) {
  const navigation = useNavigation();
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('aircnc_user'));

      const { data } = await api.get('spots', {
        params: { tech },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSpots(data);
    })();
  }, [tech]);

  const handleNavigate = useCallback(spot => {
    navigation.navigate('Book', { id: spot._id });
  }, []);

  return (
    <Container {...props}>
      <Title>
        Empresas que usam <Bold>{tech}</Bold>
      </Title>

      <ScrollView>
        <List
          data={spots}
          keyExtractor={spot => spot._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: spot }) => (
            <Spot testID={`spot_${spot._id}`}>
              <Thumbnail
                resizeMode="cover"
                source={{ uri: spot.thumbnail_url }}
              />
              <Company>{spot.company}</Company>
              <Price>{spot.price ? `R$ ${spot.price}/DIA` : 'GRATUITO'}</Price>
              <Button
                testID={`spot_book_${spot._id}`}
                onPress={() => handleNavigate(spot)}
              >
                <WhiteText>Solicitar reserva</WhiteText>
              </Button>
            </Spot>
          )}
        />
      </ScrollView>
    </Container>
  );
}

SpotList.propTypes = {
  tech: PropTypes.string.isRequired,
};
