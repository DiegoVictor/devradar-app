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
    AsyncStorage.getItem('tindev_user').then(dev_id => {
      if (dev_id) {
        navigation.navigate('Main', { _id: dev_id });
      }
    });
  }, [navigation]);

  async function handleLogin() {
    const response = await api.post('developers', { username: developer });
    const { _id } = response.data;

    await AsyncStorage.setItem('tindev_user', _id);
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
      <Button onPress={handleLogin}>
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
