import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../services/Api';
import Logo from '../assets/logo.png';
import Dislike from '../assets/dislike.png';
import Like from '../assets/like.png';
import Match from '../assets/itsamatch.png';
import io from 'socket.io-client';
import { host, port } from '../config/app';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    flex: 1,
    justifyContent: 'space-between'
  },

  cardsContainer: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    maxHeight: 500
  },

  card: {
    borderColor: '#DDDDDD',
    borderRadius: 8,
    borderWidth: 1,
    margin: 30,
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  avatar: {
    flex: 1,
    height: 300
  },

  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15
  },

  name: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold'
  },

  bio: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 5
  },

  logo: {
    marginTop: 30
  },

  buttonsContainer: {
    marginBottom: 30,
    flexDirection: 'row'
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 20,
    width: 50,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },

  empty: {
    alignSelf: 'center',
    color: '#999999',
    fontSize: 24,
    fontWeight: 'bold'
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center'
  },

  matchAvatar: {
    borderColor: '#FFFFFF',
    borderRadius: 80,
    borderWidth: 5,
    height: 160,
    marginVertical: 30,
    width: 160
  },

  matchName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold'
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain'
  },

  matchBio: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    paddingHorizontal: 30,
    textAlign: 'center'
  },

  closeMatch: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center'
  },
});

export default function Main({ navigation }) {
  const id = navigation.getParam('_id');
  const [developers, setDevelopers] = useState([]);
  const [match_developer, setMatchDeveloper] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await Api.get('/developers', {
        headers: { user: id }
      });
      setDevelopers(response.data);
    })();
  }, [id]);

  useEffect(() => {
    const socket = io(`${host}:${port}`, {
      query: { developer_id: id }
    });

    socket.on('match', developer => {
      setMatchDeveloper(developer);
    });
  }, [id]);

  async function handleLike() {
    const [ developer, ...rest ] = developers;
    await Api.post(`/developers/${developer._id}/like`, {}, {
      headers: { user: id }
    });
    setDevelopers(rest);
  };

  async function handleDislike() {
    const [ developer, ...rest ] = developers;
    await Api.post(`/developers/${developer._id}/dislike`, {}, {
      headers: { user: id }
    });
    setDevelopers(rest);
  };

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (<SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={handleLogout}>
      <Image style={styles.logo} source={Logo} />
    </TouchableOpacity>
    <View style={styles.cardsContainer}>
      { developers.length > 0 ? (
        developers.map((developer, index) => (
          <View key={developer._id} style={[styles.card, { zIndex: (developers.length - index) }]}>
            <Image style={styles.avatar} source={{  uri: developer.avatar }} />
            <View style={styles.footer}>
              <Text style={styles.name}>{ developer.name }</Text>
              <Text style={styles.bio} numberOfLines={3}>{ developer.bio }</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>Sem sugestões no momento :(</Text>
      ) }
    </View>

    { developers.length > 0 && (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDislike}>
          <Image source={Dislike} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Image source={Like} />
        </TouchableOpacity>
      </View>
    )}

    { match_developer && (
      <View style={styles.matchContainer}>
        <Image style={styles.matchImage} source={Match} />

        <Image style={styles.matchAvatar} source={{ uri: match_developer.avatar }} />
        <Text style={styles.matchName}>{ match_developer.name }</Text>
        <Text style={styles.matchBio}>{ match_developer.bio }</Text>
        <TouchableOpacity  onPress={() => setMatchDeveloper(null)}>
          <Text style={styles.closeMatch}>FECHAR</Text>
        </TouchableOpacity>
      </View>
    )}
  </SafeAreaView>);
}