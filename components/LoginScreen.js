// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';  // Importação de estilos CSS para o componente

// Definição do componente de tela de login
const LoginScreen = () => {
  // Utilização do hook de navegação do React Navigation
  const navigation = useNavigation();

  // Definição de estados para armazenar o email e senha digitados pelo usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para lidar com o evento de login
  const handleLogin = () => {
    // Reseta a navegação para a tela MainScreen diretamente
    navigation.reset({
      routes: [{ name: 'MainScreen' }]
    });
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
