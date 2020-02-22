import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import api from '~/services/api';
import { Container, Label, Input, Button, WhiteText, Cancel } from './styles';

export default function Book({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;

  const [date, setDate] = useState(new Date());
  const [show_datepicker, setShowDatepicker] = useState(false);

  const handleSubmit = useCallback(() => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('aircnc_user'));
      await api.post(
        `spots/${id}/booking`,
        {
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
      {show_datepicker && (
        <DateTimePicker
          testID="datepicker"
          mode="date"
          value={date}
          onChange={(_, selected_date) => {
            setDate(selected_date);
            setShowDatepicker(false);
          }}
        />
      )}
      <Input
        testID="date"
        placeholder="Qual data você quer reservar?"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={format(date, "dd'/'MM'/'yyyy")}
        onFocus={() => {
          setShowDatepicker(true);
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
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
