import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslation } from './translation';

const MenuModal = ({ isVisible, onClose, onNavigate }) => {

  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));
  

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

  useEffect(() => {
    fetchLanguage();
  }, [language, isVisible]);

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

  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

  

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
