import React, { useState, useCallback } from 'react';
import { AsyncStorage, Alert } from 'react-native';
import api from '../../../services/api';

import { Container, Label, Input, Button, WhiteText, Cancel } from './styles';

export default function Book({ navigation }) {
  const id = navigation.getParam('id');
  const [date, setDate] = useState('');

  const handleSubmit = useCallback(() => {
    AsyncStorage.getItem('aircnc_user').then(async user_id => {
      await api.post(
        `spots/${id}/booking`,
        {
          date,
        },
        {
          headers: { user_id },
        }
      );

      Alert.alert('Solicitação de reserva enviada');
      navigation.navigate('List');
    });
  }, [date]);

  const handleCancel = useCallback(() => {
    navigation.navigate('List');
  }, []);

  return (
    <Container>
      <Label>DATA DE INTERESSE *</Label>
      <Input
        placeholder="Qual data voê quer reservar?"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={date}
        onChangeText={setDate}
      />

      <Button onPress={handleSubmit}>
        <WhiteText>Solicitar reserva</WhiteText>
      </Button>

      <Cancel onPress={handleCancel}>
        <WhiteText>Solicitar reserva</WhiteText>
      </Cancel>
    </Container>
  );
}
