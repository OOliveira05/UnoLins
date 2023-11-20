import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import styles from './styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://uno-lims.up.railway.app/auth/login', {
        email,
        senha,
      });

      if (response.status === 200) {
        const { userToken, userInfo, expiracaoToken } = response.data;
        console.log('Login bem-sucedido!');
        console.log('Token de usuário:', userToken);
        console.log('Informações do usuário:', userInfo);
        console.log('Expiração do token:', expiracaoToken);

        navigation.reset({
          routes:[{name:'MainScreen'}]
      });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.response.data);
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
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
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={(text) => setSenha(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Entrar</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Ainda não é registrado?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginScreen;
