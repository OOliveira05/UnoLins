import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
        alert('Por favor, preencha todos os campos corretamente.');
        return;
      }

      const response = await axios.post('https://uno-lims.up.railway.app/solicitantes', {
        cnpj: cnpj,
        nome: nome,
        cep: cep,
        endereco: rua,
        numero: numero,
        cidade: cidade,
        estado: estado,
        responsavel: responsavel,
        telefone: telefone,
        email: email,
      });

      console.log('Solicitante cadastrado com sucesso!', response.data);
      alert('Solicitante cadastrado com sucesso!');
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
    } catch (error) {
      console.error('Erro ao cadastrar solicitante:', error);
      alert('Erro ao cadastrar solicitante!');
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
