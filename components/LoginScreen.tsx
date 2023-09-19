// Importações necessárias
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles'; // Importe os estilos

// Definição do componente LoginScreen
const LoginScreen = () => {
  // Obtém o objeto de navegação
  const navigation = useNavigation();

  // Estados para armazenar o nome de usuário e a senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Função chamada quando o botão de login é pressionado
  const handleLogin = () => {
    // Verifica se o nome de usuário e a senha são "admin" e "1234"
    if (username === 'admin' && password === '1234') {
      // Navega para a tela 'MainScreen' se as credenciais são válidas
      navigation.navigate('MainScreen');
    } else {
      // Exibe um alerta se as credenciais são inválidas
      alert('Combinação de usuário e senha inválida');
    }
  };

  // Função chamada quando o botão de registro é pressionado
  const handleRegister = () => {
    // Navega para a tela 'RegisterScreen' ao pressionar o botão de registro
    navigation.navigate('RegisterScreen');
  };

  // Renderização do componente
  return (
    <View style={styles.container}>
      {/* Exibe a imagem do logo */}
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      {/* Exibe o texto de boas-vindas */}
      <Text style={styles.welcomeText}>Bem Vindo!</Text>
      
      {/* Campo de entrada para o nome de usuário */}
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      
      {/* Campo de entrada para a senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      
      {/* Botão de login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Entrar</Text>
      </TouchableOpacity>
    
      {/* Seção de registro */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Precisa se registrar?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Exporta o componente LoginScreen
export default LoginScreen;
