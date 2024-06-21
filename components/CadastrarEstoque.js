import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';

const CadastrarEstoque = () => {
  const [solicitantes, setSolicitantes] = useState([]);
  const navigation = useNavigation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: '',
      cnpj: '',
    },
  });
  const toast = useToast();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "", // Definindo o título do cabeçalho como vazio
    });
  
    fetchSolicitantes();
  }, [navigation]);
  
  

  const fetchSolicitantes = async () => {
    try {
      const { data } = await axios.get('https://uno-api-pdre.onrender.com/api/v1/solicitante/listagem');
      setSolicitantes(data);
    } catch (error) {
      console.error('Erro ao carregar solicitantes:', error);
    }
  };

  const cadastrar = async (data) => {
    const estoque = {
      id: '',
      nome: data.nome,
      solicitante: {
        id: '',
        cnpj: data.cnpj,
        nome: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: '',
        estado: '',
      },
    };

    try {
      await axios.post('https://uno-api-pdre.onrender.com/api/v1/estoque', estoque);
      reset();
      toast.show('Estoque criado com sucesso!', { type: 'success' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.show(error.response?.data.erro || 'Erro ao criar estoque', { type: 'danger' });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Cadastrar estoque</Text>
      <Text style={styles.description}>Informe os dados necessários para a criação de um novo estoque</Text>

      <Controller
        control={control}
        name="cnpj"
        render={({ field: { onChange, value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Solicitante</Text>
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o solicitante do estoque" value="" />
              {solicitantes.map((solicitante) => (
                <Picker.Item key={solicitante.cnpj} label={solicitante.nome} value={solicitante.cnpj} />
              ))}
            </Picker>
          </View>
        )}
      />

      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              placeholder="Nome do estoque"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(cadastrar)}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    width: '100%',
    maxWidth: 800,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  formItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop:5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 40,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3A01DF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CadastrarEstoque;
