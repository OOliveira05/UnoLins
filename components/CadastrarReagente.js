import React, { useState, useEffect }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { useToast } from 'react-native-toast-notifications';

const CadastrarReagente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nomeEstoque, fetchReagentes } = route.params;
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      nome: '',
      dataValidade: new Date(),
      fornecedor: '',
      descricao: '',
      unidade: '',
      quantidade: '',
    },
  });
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const toast = useToast();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "", // Definindo o título do cabeçalho como vazio
    });
  }, [navigation]);

  const cadastrar = async (data) => {
    try {
      const yearValidade = data.dataValidade.getFullYear();
      const monthValidade = String(data.dataValidade.getMonth() + 1).padStart(2, '0');
      const dayValidade = String(data.dataValidade.getDate()).padStart(2, '0');

      const reagente = {
        id: '',
        nome: data.nome,
        dataValidade: `${yearValidade}-${monthValidade}-${dayValidade}`,
        fornecedor: data.fornecedor,
        descricao: data.descricao,
        unidade: data.unidade,
        quantidade: Number(data.quantidade),
        estoque: {
          id: '',
          nome: nomeEstoque,
          solicitante: {
            id: '',
            cnpj: '',
            nome: '',
            telefone: '',
            email: '',
            endereco: '',
            cidade: '',
            estado: '',
          },
        },
      };

      await axios.post('https://uno-api-pdre.onrender.com/api/v1/reagente', reagente);

      reset({
        nome: '',
        dataValidade: new Date(),
        fornecedor: '',
        descricao: '',
        unidade: '',
        quantidade: '',
      });

      toast.show('Reagente cadastrado com sucesso!', { type: 'success' });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      toast.show('Falha ao cadastrar reagente. Tente novamente.', { type: 'danger' });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Reagente</Text>
        <Text style={styles.label}>Nome do reagente</Text>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Nome do reagente"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text style={styles.label}>Data de validade</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
          <Text>
            {format(new Date(), 'PPP')}
          </Text>
        </TouchableOpacity>
        {isDatePickerVisible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setDatePickerVisibility(false);
              setValue('dataValidade', selectedDate || new Date());
            }}
          />
        )}
        <Text style={styles.label}>Fornecedor</Text>
        <Controller
          control={control}
          name="fornecedor"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Fornecedor"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text style={styles.label}>Quantidade de entrada</Text>
        <Controller
          control={control}
          name="quantidade"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Quantidade de entrada"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
        />
        <Text style={styles.label}>Unidade</Text>
        <Controller
          control={control}
          name="unidade"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Unidade"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text style={styles.label}>Descrição do reagente</Text>
        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descrição do reagente"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
            />
          )}
        />
        <TouchableOpacity
            style={styles.registrarButton}
            onPress={handleSubmit(cadastrar)}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
    
      </ScrollView>
    </KeyboardAvoidingView>
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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  textarea: {
    height: 100,
  },
  registrarButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CadastrarReagente;
