import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
import { disconnect, connect, subscribe } from '~/services/socket';

export default function Matches({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [developer, setDeveloper] = useState(null);

  const handleRefresh = useCallback(() => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('tindev_user'));
      const { data } = await api.get('matches', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMatches(data);
      setRefreshing(false);
    })();
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  useEffect(() => {
    (async () => {
      const { id: developer_id } = JSON.parse(
        await AsyncStorage.getItem('tindev_user')
      );

      disconnect();
      connect({ developer_id });
      subscribe('match', dev => {
        setDeveloper(dev);
      });
    })();
  }, []);

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <Container>
      <TouchableOpacity testID="logout" onPress={handleLogout}>
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

      {developer && (
        <Match
          testID="match"
          developer={developer}
          setDeveloper={setDeveloper}
        />
      )}
    </Container>
  );
}

Matches.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
