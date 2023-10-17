import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const MenuModal = ({ isVisible, onClose, onNavigate }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onNavigate('MainScreen')}>
          <Text>Main Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate('CadastroSolicitanteScreen')}>
          <Text>Cadastro de Solicitante</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate('ConsultaSolicitanteScreen')}>
          <Text>Consulta de Solicitante</Text>
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
});

export default MenuModal;
