import React, { useCallback, useMemo } from 'react';
import { Image, Linking, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';

import { useNavigation, useRoute } from '@react-navigation/native';
import Logo from '~/assets/logo.png';
import {
  Action,
  ActionText,
  Actions,
  Back,
  Box,
  Container,
  Description,
  Incident,
  Header,
  Label,
  Title,
  Value,
} from './styles';

export default () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { incident } = route.params;
  const formated_value = useMemo(() => {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(incident.value);
  }, [incident]);

  const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formated_value}`;

  const sendMail = useCallback(() => {
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.email],
      body: message,
    });
  });

  const sendWhatsApp = useCallback(() => {
    Linking.openURL(
      `whatsapp://send?phone:${incident.whatsapp}&text=${message}`
    );
  });

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Back onPress={navigation.goBack}>
          <Feather name="arrow-left" size={28} color="#E82041" />
        </Back>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Incident>
          <Label>ONG</Label>
          <Value>
            {incident.name} de {incident.city}/{incident.uf}
          </Value>

          <Label>CASO</Label>
          <Value>{incident.description}</Value>

          <Label>Valor</Label>
          <Value>{formated_value}</Value>
        </Incident>

        <Box>
          <Title>Salve o dia</Title>
          <Title>Seja o héroi desse caso</Title>

          <Description>Entre em contato:</Description>
          <Actions>
            <Action onPress={sendWhatsApp}>
              <ActionText>WhatsApp</ActionText>
            </Action>
            <Action onPress={sendMail}>
              <ActionText>Email</ActionText>
            </Action>
          </Actions>
        </Box>
      </ScrollView>
    </Container>
  );
};
