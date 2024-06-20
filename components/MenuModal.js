// Importações necessárias
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

// Componente funcional para o Menu Modal
const MenuModal = ({ isVisible, onClose, onNavigate }) => {
  // Renderização do componente
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastroSolicitanteScreen')}>
          <Text style={styles.menuItemText}>Cadastro de Solicitante</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaSolicitanteScreen')}>
          <Text style={styles.menuItemText}>Consulta de Solicitante</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastroSolicitacaoAnaliseScreen')}>
          <Text style={styles.menuItemText}>Cadastro de Solicitação de Análise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaSolicitacaoAnaliseScreen')}>
          <Text style={styles.menuItemText}>Consulta de Solicitação de Análise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('LeituraQRCodeScreen')}>
          <Text style={styles.menuItemText}>Leitura de QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('CadastrarEstoque')}>
          <Text style={styles.menuItemText}>Cadastrar Estoque</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('ConsultaEstoque')}>
          <Text style={styles.menuItemText}>Consultar Estoque</Text>
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
