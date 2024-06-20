import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastProvider } from 'react-native-toast-notifications';

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
import CadastrarLote from './components/CadastrarLote';
import DetalhesSolicitanteScreen from './components/DetalhesSolicitanteScreen';
import DetalhesSolicitacaoAnaliseScreen from './components/DetalhesSolicitacaoAnaliseScreen';
import DetalhesLote from './components/DetalhesLote';
import CadastrarAnalise from './components/CadastrarAnalise';
import CadastrarEstoque from './components/CadastrarEstoque';
import ConsultaEstoque from './components/ConsultaEstoque';
import DetalhesEstoque from './components/DetalhesEstoque';
import CadastrarReagente from './components/CadastrarReagente';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
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
          <Stack.Screen name="CadastrarLote" component={CadastrarLote} />
          <Stack.Screen name="DetalhesSolicitanteScreen" component={DetalhesSolicitanteScreen} />
          <Stack.Screen name="DetalhesSolicitacaoAnaliseScreen" component={DetalhesSolicitacaoAnaliseScreen} />
          <Stack.Screen name="DetalhesLote" component={DetalhesLote} />
          <Stack.Screen name="CadastrarAnalise" component={CadastrarAnalise} />
          <Stack.Screen name="CadastrarEstoque" component={CadastrarEstoque} />
          <Stack.Screen name="ConsultaEstoque" component={ConsultaEstoque} />
          <Stack.Screen name="DetalhesEstoque" component={DetalhesEstoque} />
          <Stack.Screen name="CadastrarReagente" component={CadastrarReagente} />

          
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
};

export default App;
