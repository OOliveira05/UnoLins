// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MenuModal from './MenuModal';  // Componente modal para o menu

// Definição do componente de tela principal (MainScreen)
const MainScreen = ({ navigation }) => {
  // Estado para controlar a visibilidade do menu
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Renderização do componente com elementos de interface de usuário
  return (
    <View style={styles.container}>
      {/* Botão para abrir o menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuVisible(true)}
      >
        <Text style={styles.menuButtonText}>☰ Menu</Text>
      </TouchableOpacity>

      {/* Componente modal para o menu */}
      <MenuModal
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={(screen) => {
          setIsMenuVisible(false);
          navigation.navigate(screen);
        }}
      />

      {/* Logo no centro da tela */}
      <Image source={require('../assets/Logo.png')} style={styles.logo} />
    </View>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default MainScreen;
