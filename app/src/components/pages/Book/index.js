import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { format, parse } from 'date-fns';
import PropTypes from 'prop-types';

import api from '~/services/api';
import { Container, Label, Input, Button, WhiteText, Cancel } from './styles';

export default function Book({ navigation }) {
  const id = navigation.getParam('id');
  const [date, setDate] = useState(new Date());

  const handleSubmit = useCallback(() => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('aircnc_user'));
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
        onChangeText={value => {
          setDate(parse(value, 'dd/MM/yyyy', new Date()));
        }}
        onFocus={async () => {
          const { action, year, month, day } = await DateTimePicker.open({
            mode: 'spinner',
            date,
          });
          if (action === DateTimePicker.dateSetAction) {
            setDate(new Date(year, month, day));
          }
        }}
      />

      <Button testID="submit" onPress={handleSubmit}>
        <WhiteText>Solicitar reserva</WhiteText>
      </Button>

      <Cancel testID="cancel" onPress={handleCancel}>
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
