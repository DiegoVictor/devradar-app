import React, { useState, useCallback } from 'react';
import { AsyncStorage, Alert, DatePickerAndroid } from 'react-native';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import api from '~/services/api';
import { Container, Label, Input, Button, WhiteText, Cancel } from './styles';

export default function Book({ navigation }) {
  const id = navigation.getParam('id');
  const [date, setDate] = useState(new Date());

  const handleSubmit = useCallback(() => {
    (async () => {
      const user_id = await AsyncStorage.getItem('aircnc_user');
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
    })();
  }, [date]);

  const handleCancel = useCallback(() => {
    navigation.navigate('List');
  }, []);

  return (
    <Container>
      <Label>DATA DE INTERESSE *</Label>
      <Input
        placeholder="Qual data você quer reservar?"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={format(date, "dd'/'MM'/'yyyy")}
        onFocus={async () => {
          const { action, year, month, day } = await DatePickerAndroid.open({
            mode: 'spinner',
            date,
          });
          if (action === DatePickerAndroid.dateSetAction) {
            setDate(new Date(year, month, day));
          }
        }}
      />

      <Button onPress={handleSubmit}>
        <WhiteText>Solicitar reserva</WhiteText>
      </Button>

      <Cancel onPress={handleCancel}>
        <WhiteText>Cancelar</WhiteText>
      </Cancel>
    </Container>
  );
}

Book.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
