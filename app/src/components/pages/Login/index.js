import React, { useState, useEffect } from 'react';
import { Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import Logo from '~/assets/logo.png';
import api from '~/services/api';
import { Container, Input, Button, Text } from './styles';

export default function Login({ navigation }) {
  const [developer, setDeveloper] = useState('');

  useEffect(() => {
    (async () => {
      const user = JSON.parse(await AsyncStorage.getItem('tindev_user'));

      if (user) {
        navigation.navigate('Main', user);
      }
    })();
  }, [navigation]);

  async function handleLogin() {
    const { data } = await api.post('developers', { username: developer });

    await AsyncStorage.setItem(
      'tindev_user',
      JSON.stringify({
        id: data.developer._id,
        token: data.token,
      })
    );
    navigation.navigate('Main');
  }

  return (
    <Container behavior="padding" enabled={Platform.OS === 'ios'}>
      <Image source={Logo} />
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuáro no Github"
        placeholderTextColor="#999"
        value={developer}
        onChangeText={setDeveloper}
      />
      <Button testID="submit" onPress={handleLogin}>
        <Text>Enviar</Text>
      </Button>
    </Container>
  );
}

Login.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
