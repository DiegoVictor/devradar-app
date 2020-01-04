import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from 'react-native-dotenv';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

import Logo from '~/assets/logo.png';
import Match from '~/components/Match';
import api from '~/services/api';
import {
  Container,
  Brand,
  Title,
  Developers,
  Developer,
  Avatar,
  Description,
  Bio,
  Text,
  Empty,
} from './styles';

export default function Matches({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [developer, setDeveloper] = useState(null);

  const handleRefresh = useCallback(() => {
    AsyncStorage.getItem('tindev_user').then(async user_id => {
      const { data } = await api.get('matches', {
        headers: {
          user_id,
        },
      });
      setMatches(data);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  useEffect(() => {
    AsyncStorage.getItem('tindev_user').then(async id => {
      const socket = io(API_URL, {
        query: { developer_id: id },
      });

      socket.on('match', dev => {
        setDeveloper(dev);
      });
    });
  }, []);

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <Container>
      <TouchableOpacity onPress={handleLogout}>
        <Brand source={Logo} />
      </TouchableOpacity>
      <Title>Matches</Title>

      {matches.length > 0 ? (
        <Developers
          data={matches}
          keyExtractor={match => match._id}
          showsHorizontalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item: match }) => (
            <Developer key={match._id}>
              <View>
                <Avatar source={{ uri: match.avatar }} />
              </View>
              <Description>
                <Text>{match.name}</Text>
                <Bio>{match.bio}</Bio>
              </Description>
            </Developer>
          )}
        />
      ) : (
        <View>
          <Empty>Nenhum match até o momento</Empty>
        </View>
      )}

      {developer && <Match developer={developer} setDeveloper={setDeveloper} />}
    </Container>
  );
}

Matches.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
