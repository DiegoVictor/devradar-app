import React, { useCallback, useState, useEffect } from 'react';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

import Logo from '~/assets/logo.png';
import api from '~/services/api';
import { Container, Form, Label, Input, Button, WhiteText } from './styles';

export default () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');

  const handleSubmit = useCallback(() => {
    (async () => {
      const { data } = await api.post('sessions', { email });
      const {
        token,
        user: { _id },
      } = data;

      await AsyncStorage.setItem('aircnc_user', JSON.stringify({ token, _id }));
      await AsyncStorage.setItem('aircnc_techs', techs);

      navigate('App', { screen: 'List' });
    })();
  }, [email, techs]);

  useEffect(() => {
    (async () => {
      const user = JSON.parse(await AsyncStorage.getItem('aircnc_user'));
      if (user) {
        navigate('App', { screen: 'List' });
      }
    })();
  }, []);

  return (
    <Container behavior="padding">
      <Image source={Logo} />

      <Form>
        <Label>SEU EMAIL *</Label>
        <Input
          placeholder="Seu email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Label>TECNOLOGIAS *</Label>
        <Input
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <Button testID="submit" onPress={handleSubmit}>
          <WhiteText>Encontrar spots</WhiteText>
        </Button>
      </Form>
    </Container>
  );
};
