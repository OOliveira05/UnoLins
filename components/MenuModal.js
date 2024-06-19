// Importações necessárias
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslation } from './translation';

// Componente funcional para o Menu Modal
const MenuModal = ({ isVisible, onClose, onNavigate }) => {
  // Estados para gerenciar o idioma e traduções
  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

  // Função para buscar o idioma salvo no AsyncStorage
  const fetchLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error reading language from AsyncStorage', error);
    }
  };

  // Efeito para buscar o idioma ao montar o componente e quando o modal é exibido
  useEffect(() => {
    fetchLanguage();
  }, [language, isVisible]);

  // Efeito para atualizar o idioma quando ele é alterado no AsyncStorage
  useEffect(() => {
    const updateLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@language');
        if (savedLanguage && savedLanguage !== language) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error reading language from AsyncStorage', error);
      }
    };

    updateLanguage();
  }, [language]);

  // Efeito para atualizar as traduções quando o idioma é alterado
  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

  // Renderização do componente
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastroSolicitanteScreen')}>
          <Text style={styles.menuItemText}>{translations.cadastroSolicitante}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaSolicitanteScreen')}>
          <Text style={styles.menuItemText}>{translations.ConsultadeSolicitante}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastroItemAnaliseScreen')}>
          <Text style={styles.menuItemText}>{translations.CadastrodeItemdeAnalise}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaItemAnaliseScreen')}>
          <Text style={styles.menuItemText}>{translations.ConsultadeItemdeAnalise}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastroSolicitacaoAnaliseScreen')}>
          <Text style={styles.menuItemText}>{translations.CadastrodeSolicitaçãodeAnalise}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaSolicitacaoAnaliseScreen')}>
          <Text style={styles.menuItemText}>{translations.ConsultadeSolicitaçãodeAnalise}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastroEnsaioScreen')}>
          <Text style={styles.menuItemText}>{translations.CadastrodeEnsaio}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaEnsaioScreen')}>
          <Text style={styles.menuItemText}>{translations.ConsultadeEnsaio}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('LeituraQRCodeScreen')}>
          <Text style={styles.menuItemText}>{translations.LeituradeQRCode}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastrarLote')}>
          <Text style={styles.menuItemText}>{translations.LeituradeQRCode}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MenuModal;
