import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import api from '~/services/api';
import Logo from '~/assets/logo.png';
import Dislike from '~/assets/dislike.png';
import Like from '~/assets/like.png';
import Match from '~/components/Match';
import {
  Container,
  Brand,
  Title,
  Cards,
  Developer,
  Avatar,
  Bio,
  Name,
  Description,
  Empty,
  Actions,
  Button,
} from './styles';
import { disconnect, connect, subscribe } from '~/services/socket';

export default function Main({ navigation }) {
  const [developers, setDevelopers] = useState([]);
  const [developer, setDeveloper] = useState(null);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('tindev_user');
      const { data } = await api.get('developers', {
        headers: { user_id: id },
      });
      setDevelopers(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const developer_id = await AsyncStorage.getItem('tindev_user');

      disconnect();
      connect({ developer_id });
      subscribe('match', dev => {
        setDeveloper(dev);
      });
    })();
  }, []);

  async function handleLike() {
    const id = await AsyncStorage.getItem('tindev_user');
    const [dev, ...rest] = developers;
    await api.post(
      `developers/${dev._id}/like`,
      {},
      {
        headers: { user_id: id },
      }
    );
    setDevelopers(rest);
  }

  async function handleDislike() {
    const id = await AsyncStorage.getItem('tindev_user');
    const [dev, ...rest] = developers;
    await api.post(
      `developers/${dev._id}/dislike`,
      {},
      {
        headers: { user_id: id },
      }
    );
    setDevelopers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <Container>
      <TouchableOpacity testID="logout" onPress={handleLogout}>
        <Brand source={Logo} />
      </TouchableOpacity>
      <Title>Developers</Title>

      <Cards>
        {developers.length > 0 ? (
          developers.map((dev, index) => (
            <Developer
              testID={`developer_${dev._id}`}
              key={dev._id}
              index={developers.length - index}
            >
              <Avatar source={{ uri: dev.avatar }} />
              <Bio>
                <Name>{dev.name}</Name>
                <Description numberOfLines={3}>{dev.bio}</Description>
              </Bio>
            </Developer>
          ))
        ) : (
          <Empty>Sem sugestões no momento :(</Empty>
        )}
      </Cards>

      {developers.length > 0 && (
        <Actions>
          <Button testID="dislike" onPress={handleDislike}>
            <Image source={Dislike} />
          </Button>
          <Button testID="like" onPress={handleLike}>
            <Image source={Like} />
          </Button>
        </Actions>
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

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

Main.navigationOptions = {
  title: 'Developers',
};
