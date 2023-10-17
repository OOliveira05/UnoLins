import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import RegisterScreen from './components/RegisterScreen';
import CadastroSolicitanteScreen from './components/CadastroSolicitanteScreen';
import ConsultaSolicitanteScreen from './components/ConsultaSolicitanteScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="CadastroSolicitanteScreen" component={CadastroSolicitanteScreen} />
        <Stack.Screen name="ConsultaSolicitanteScreen" component={ConsultaSolicitanteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
