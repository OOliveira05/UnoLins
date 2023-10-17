import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const CadastroSolicitanteScreen = () => {
  const [cnpj, setCnpj] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const cadastrarSolicitante = async () => {
    try {
      const response = await axios.post('https://uno-api-vz2y.onrender.com/api/v1/solicitante', {
        Cnpj: cnpj,
        NomeFantasia: nomeFantasia,
        Cep: cep,
        Rua: rua,
        Numero: numero,
        Cidade: cidade,
        Estado: estado,
      });

      console.log('Solicitante cadastrado com sucesso!', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar solicitante:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cadastro de Solicitante</Text>
      <TextInput
        placeholder="CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
        style={styles.input}
      />
      <TextInput
        placeholder="Nome Fantasia"
        value={nomeFantasia}
        onChangeText={setNomeFantasia}
        style={styles.input}
      />
      <TextInput
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
        style={styles.input}
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
      <Button title="Cadastrar" onPress={cadastrarSolicitante} />
    </View>
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
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default CadastroSolicitanteScreen;
