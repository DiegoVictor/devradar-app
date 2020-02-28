import React, { useEffect, useState, useCallback } from 'react';
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import api from '~/services/api';
import { connect, disconnect, subscribe } from '~/services/socket';
import Dev from '~/components/Dev';
import { Map, Search, Input, Button } from './styles';

export default () => {
  const [current_region, setCurrentRegion] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    (async () => {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    })();
  }, []);

  useEffect(() => {
    subscribe('new_developers', developer => {
      setDevelopers([...developers, developer]);
    });
  }, [developers]);

  const handleRegionChange = useCallback(region => {
    setCurrentRegion(region);
  }, []);

  const handleSearch = useCallback(() => {
    (async () => {
      const { latitude, longitude } = current_region;
      if (techs.length > 0) {
        const { data } = await api.get('search', {
          params: {
            latitude,
            longitude,
            techs,
          },
        });

        setDevelopers(data);

        disconnect();
        connect(latitude, longitude, techs);
      }
    })();
  }, [current_region, techs]);

  if (!current_region) {
    return <View />;
  }

  return (
    <>
      <Map
        onRegionChangeComlpete={handleRegionChange}
        initialRegion={current_region}
      >
        {developers.map(dev => (
          <Dev key={dev._id} dev={dev} />
        ))}
      </Map>
      <Search>
        <Input
          placeholder="Buscar devs por tecnologia"
          placeholderTextColor="#999"
          autoCaptalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <Button onPress={handleSearch}>
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </Button>
      </Search>
    </>
  );
};
