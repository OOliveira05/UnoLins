import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { getTranslation } from './translation';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

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

  
  const cadastrarSolicitante = async () => {
    try {
      if (cnpj.length !== 14 || cep.length !== 8 || !cnpj || !cep) {
        Alert.alert(translations.AtencaoPreenchaTodosCampos);
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
      Alert.alert(translations.SucessoAoCadastrar);
      limparCampos();
    } catch (error) {
      console.error('Erro ao cadastrar solicitante:', error);
      Alert.alert('Erro', translations.ErroAoCadastrar);
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
      <Text style={styles.headerText}>{translations.cadastroSolicitante}</Text>
      <TextInput
        placeholder="CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
        style={styles.input}
        keyboardType="numeric"
        maxLength={14}
      />
      <TextInput
        placeholder={translations.Nome}
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
        placeholder={translations.Rua}
        value={rua}
        onChangeText={setRua}
        style={styles.input}
      />
      <TextInput
        placeholder={translations.Numero}
        value={numero}
        onChangeText={setNumero}
        style={styles.input}
      />
      <TextInput
        placeholder={translations.Cidade}
        value={cidade}
        onChangeText={setCidade}
        style={styles.input}
      />
      <TextInput
        placeholder={translations.Estado}
        value={estado}
        onChangeText={setEstado}
        style={styles.input}
      />
      <TextInput
        placeholder={translations.Responsavel}
        value={responsavel}
        onChangeText={setResponsavel}
        style={styles.input}
      />
      <TextInput
        placeholder={translations.Telefone}
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
        <Text style={styles.buttonText}>{translations.Cadastrar}</Text>
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
