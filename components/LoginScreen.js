// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';  // Biblioteca para fazer requisições HTTP
import styles from './styles';  // Importação de estilos CSS para o componente

// Definição do componente de tela de login
const LoginScreen = () => {
  // Utilização do hook de navegação do React Navigation
  const navigation = useNavigation();

  // Definição de estados para armazenar o email e senha digitados pelo usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para lidar com o evento de login
  const handleLogin = async () => {
    try {
      // Envia uma requisição POST para a URL especificada com as credenciais do usuário
      const response = await axios.post('https://uno-lims.up.railway.app/auth/login', {
        email,
        senha,
      });

      // Se a resposta do servidor for bem-sucedida (status 200)
      if (response.status === 200) {
        // Extrai informações importantes da resposta
        const { userToken, userInfo, expiracaoToken } = response.data;

        // Exibe informações de sucesso no console
        console.log('Login bem-sucedido!');
        console.log('Token de usuário:', userToken);
        console.log('Informações do usuário:', userInfo);
        console.log('Expiração do token:', expiracaoToken);

        // Reseta a navegação para a tela MainScreen após o login bem-sucedido
        navigation.reset({
          routes: [{ name: 'MainScreen' }]
        });
      }
    } catch (error) {
      // Se houver um erro durante o login, exibe mensagens de erro no console e alerta
      console.error('Erro ao fazer login:', error.response.data);
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  // Função para lidar com o evento de registro
  const handleRegister = () => {
    // Navega para a tela de registro (RegisterScreen)
    navigation.navigate('RegisterScreen');
  };

  // Renderização do componente com elementos de interface de usuário
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
        secureTextEntry  // Oculta os caracteres da senha
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

// Exporta o componente para ser utilizado em outras partes da aplicação
export default LoginScreen;
