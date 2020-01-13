import React, { useEffect, useState, useCallback } from 'react';
import { withNavigation } from 'react-navigation';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';

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

export function SpotList({ tech, navigation, ...props }) {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('spots', {
        params: { tech },
      });

      setSpots(response.data);
    })();
  }, []);

  const handleNavigate = useCallback(spot => {
    navigation.navigate('Book', { id: spot._id });
  }, []);

  return (
    <Container>
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(SpotList);
