import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      navigation.navigate('MainScreen');
    } else {
      alert('Combinação de usuário e senha inválida');
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      <Text style={styles.welcomeText}>Bem Vindo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Entrar</Text>
      </TouchableOpacity>
    
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Precisa se registrar?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    position: 'relative',
    bottom:50, 
    width: 100, 
    height: 100,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 30,
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 25,
    paddingLeft: 8,
    borderRadius: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerText: {
    fontSize: 18,
    marginRight: 5,
  },
  registerLink: {
    fontSize: 18,
    color: '#3A01DF',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
