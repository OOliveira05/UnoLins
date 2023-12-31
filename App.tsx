// Importações necessárias do React e do React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importações dos componentes de tela
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import RegisterScreen from './components/RegisterScreen';
import CadastroSolicitanteScreen from './components/CadastroSolicitanteScreen';
import ConsultaSolicitanteScreen from './components/ConsultaSolicitanteScreen';
import CadastroItemAnaliseScreen from './components/CadastroItemAnaliseScreen';
import CadastroSolicitacaoAnaliseScreen from './components/CadastroSolicitacaoAnaliseScreen';
import CadastroEnsaioScreen from './components/CadastroEnsaio';
import ConsultaEnsaioScreen from './components/ConsultaEnsaioScreen';
import ConsultaItemAnaliseScreen from './components/ConsultaItemAnaliseScreen';
import ConsultaSolicitacaoAnaliseScreen from './components/ConsultaSolicitacaoAnaliseScreen';
import LeituraQRCodeScreen from './components/LeituraQRCodeScreen';
import DetalhesItemAnaliseScreen from './components/DetalhesItemAnaliseScreen';

// Criação de uma pilha de navegação usando o createStackNavigator
const Stack = createNativeStackNavigator();

// Componente principal do aplicativo
const App = () => {
  return (
    // O componente NavigationContainer é utilizado para envolver toda a navegação
    <NavigationContainer>
      {/* Definição da pilha de navegação */}
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* Definição de cada tela na pilha */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        <Stack.Screen name="CadastroItemAnaliseScreen" component={CadastroItemAnaliseScreen} />
        <Stack.Screen name="CadastroSolicitacaoAnaliseScreen" component={CadastroSolicitacaoAnaliseScreen} />
        <Stack.Screen name="CadastroEnsaioScreen" component={CadastroEnsaioScreen} />
        <Stack.Screen name="CadastroSolicitanteScreen" component={CadastroSolicitanteScreen} />
        
        <Stack.Screen name="ConsultaEnsaioScreen" component={ConsultaEnsaioScreen} />
        <Stack.Screen name="ConsultaItemAnaliseScreen" component={ConsultaItemAnaliseScreen} />
        <Stack.Screen name="ConsultaSolicitacaoAnaliseScreen" component={ConsultaSolicitacaoAnaliseScreen} />
        <Stack.Screen name="ConsultaSolicitanteScreen" component={ConsultaSolicitanteScreen} />

        <Stack.Screen name="LeituraQRCodeScreen" component={LeituraQRCodeScreen} />

        <Stack.Screen name="DetalhesItemAnaliseScreen" component={DetalhesItemAnaliseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Exportação do componente principal
export default App;
