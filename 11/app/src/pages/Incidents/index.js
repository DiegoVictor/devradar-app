import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Logo from '~/assets/logo.png';
import {
  Button,
  ButtonText,
  Container,
  Description,
  Incidents,
  Incident,
  Header,
  Label,
  Strong,
  Text,
  Title,
  Value,
} from './styles';
import api from '~/services/api';

export default () => {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const goToDetail = useCallback(
    (incident) => {
      navigation.navigate('Detail', { incident });
    },
    [navigation]
  );

  const getPage = useCallback(async () => {
    if (loading || (total > 0 && total === incidents.length)) {
      return;
    }

    setLoading(true);

    const { headers, data } = await api.get('incidents', {
      params: { page },
    });
    setIncidents([...incidents, ...data]);
    setTotal(headers['x-total-count']);

    setPage(page + 1);
    setLoading(false);
  }, [loading, total, incidents]);

  useEffect(() => {
    getPage();
  }, []);

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Text>
          Total de <Strong>{total} casos</Strong>.
        </Text>
      </Header>
      <Title>Bem-vindo!</Title>
      <Description>Escolha um dos casos abaixo e salve o dia.</Description>

      <Incidents
        data={incidents}
        keyExtractor={(incident) => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={getPage}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <Incident>
            <Label>ONG</Label>
            <Value>{incident.name}</Value>

            <Label>CASO</Label>
            <Value>{incident.title}</Value>

            <Label>Valor</Label>
            <Value>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(incident.value)}
            </Value>

            <Button
              onPress={() => {
                goToDetail(incident);
              }}
            >
              <ButtonText>Ver mais detalhes</ButtonText>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </Button>
          </Incident>
        )}
      />
    </Container>
  );
};
