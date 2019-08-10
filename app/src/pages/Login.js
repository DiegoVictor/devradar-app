import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import Logo from '../assets/logo.png';
import Api from '../services/Api';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    flex: 1,
    justifyContent: 'center',
    padding: 30
  },

  input: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderRadius: 4,
    borderWidth: 1,
    height: 46,
    marginTop: 20,
    paddingHorizontal: 15
  },

  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#DF4723',
    borderRadius: 4,
    justifyContent: 'center',
    height: 46,
    marginTop: 10,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default function Login({ navigation }) {
  const [developer, setDeveloper] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('developer').then(developer => {
      if (developer) {
        navigation.navigate('Main', { _id: developer });
      }
    });
  }, []);

  async function handleLogin() {
    const response = await Api.post('/developers', {username: developer});
    const { _id } = response.data;

    await AsyncStorage.setItem('developer', _id);
    navigation.navigate('Main', { _id });
  }

  return (
    <KeyboardAvoidingView 
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}
    >
      <Image source={Logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuáro no Github"
        placeholderTextColor="#999"
        style={styles.input}
        value={developer}
        onChangeText={setDeveloper}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}