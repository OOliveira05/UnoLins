import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const CadastroSolicitanteScreen = () => {
  const [cnpj, setCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const cadastrarSolicitante = async () => {
    try {
      if (cnpj.length !== 14 || cep.length !== 8 || !cnpj || !cep) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos corretamente.');
        return;
      }

      const response = await axios.post('https://uno-lims.up.railway.app/solicitantes', {
        cnpj,
        nome,
        cep,
        endereco: rua,
        numero,
        cidade,
        estado,
        responsavel,
        telefone,
        email,
      });

      console.log('Solicitante cadastrado com sucesso!', response.data);
      Alert.alert('Sucesso', 'Solicitante cadastrado com sucesso!');
      limparCampos();
    } catch (error) {
      console.error('Erro ao cadastrar solicitante:', error);
      Alert.alert('Erro', 'Erro ao cadastrar solicitante!');
    }
  };

  const limparCampos = () => {
    setCnpj('');
    setNome('');
    setCep('');
    setRua('');
    setNumero('');
    setCidade('');
    setEstado('');
    setResponsavel('');
    setTelefone('');
    setEmail('');
  };

  return (
    <ScrollView>
         <View style={styles.container}>
      <Text style={styles.headerText}>Cadastro de Solicitante</Text>
      <TextInput
        placeholder="CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
        style={styles.input}
        keyboardType="numeric"
        maxLength={14}
      />
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
        style={styles.input}
        keyboardType="numeric"
        maxLength={8}
      />
      <TextInput
        placeholder="Rua"
        value={rua}
        onChangeText={setRua}
        style={styles.input}
      />
      <TextInput
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
        style={styles.input}
      />
      <TextInput
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
        style={styles.input}
      />
      <TextInput
        placeholder="Estado"
        value={estado}
        onChangeText={setEstado}
        style={styles.input}
      />
      <TextInput
        placeholder="Responsável"
        value={responsavel}
        onChangeText={setResponsavel}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={cadastrarSolicitante}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#3A01DF',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  cadastrarButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CadastroSolicitanteScreen;
