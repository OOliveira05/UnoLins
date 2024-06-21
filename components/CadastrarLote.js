import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { z } from 'zod';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const loteSchema = z.object({
  amostra: z.string(),
  notaFiscal: z.string(),
  dataEntrada: z.date(),
  dataValidade: z.date(),
  descricao: z.string(),
  quantidade: z.string(),
});

const CadastrarLote = ({ route, fetchLotes, isOpen, setIsOpen, navigation }) => {
  const { idSa } = route.params; // Recebe o idSa passado pela navegação

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Image source={require('../assets/Logo.png')} style={styles.headerLogo} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center', // Centraliza o título do cabeçalho
    });
  }, [navigation]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      amostra: '',
      notaFiscal: '',
      dataEntrada: undefined,
      dataValidade: undefined,
      descricao: '',
      quantidade: '',
    },
  });

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showDatePickerEntrada, setShowDatePickerEntrada] = useState(false);
  const [showDatePickerValidade, setShowDatePickerValidade] = useState(false);

  const cadastrar = async (data) => {
    setLoading(true);
    try {
      const yearEntrada = data.dataEntrada.getFullYear();
      const monthEntrada = String(data.dataEntrada.getMonth() + 1).padStart(2, '0');
      const dayEntrada = String(data.dataEntrada.getDate()).padStart(2, '0');

      const yearValidade = data.dataValidade.getFullYear();
      const monthValidade = String(data.dataValidade.getMonth() + 1).padStart(2, '0');
      const dayValidade = String(data.dataValidade.getDate()).padStart(2, '0');

      const lote = {
        id: '',
        amostra: data.amostra,
        notaFiscal: data.notaFiscal,
        dataEntrada: `${yearEntrada}-${monthEntrada}-${dayEntrada}`,
        dataValidade: `${yearValidade}-${monthValidade}-${dayValidade}`,
        descricao: data.descricao,
        quantidade: Number(data.quantidade),
        solicitacaoAnalise: {
          idSa: idSa,
          nomeProjeto: '',
          prazoAcordado: '',
          tipoAnalise: '',
          descricaoProjeto: '',
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

      await axios.post('https://uno-api-pdre.onrender.com/api/v1/lote', lote);

      reset({
        amostra: '',
        notaFiscal: '',
        dataEntrada: undefined,
        dataValidade: undefined,
        descricao: '',
        quantidade: '',
      });

      toast.show('Lote cadastrado com sucesso', { type: 'success' });

      // Navegar de volta para a tela anterior
      navigation.goBack();

    } catch (error) {
      console.log('Erro ao cadastrar lote:', error);
      toast.show('Erro ao cadastrar lote. Verifique os dados e tente novamente.', { type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Cadastrar Novo Lote</Text>
      <Text style={styles.description}>Informe os dados de entrada do novo lote de amostra</Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="amostra"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amostra</Text>
              <TextInput
                placeholder="Nome da amostra"
                style={[styles.input, errors.amostra && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.amostra && <Text style={styles.errorText}>{errors.amostra.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="notaFiscal"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nota Fiscal</Text>
              <TextInput
                placeholder="Nota Fiscal"
                style={[styles.input, errors.notaFiscal && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.notaFiscal && <Text style={styles.errorText}>{errors.notaFiscal.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="dataEntrada"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Entrada</Text>
              <TouchableOpacity onPress={() => setShowDatePickerEntrada(true)}>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  style={[styles.input, errors.dataEntrada && styles.inputError]}
                  value={value ? format(new Date(value), 'yyyy-MM-dd') : ''}
                  editable={false}
                />
              </TouchableOpacity>
              {showDatePickerEntrada && (
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePickerEntrada(false);
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              )}
              {errors.dataEntrada && <Text style={styles.errorText}>{errors.dataEntrada.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="dataValidade"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Validade</Text>
              <TouchableOpacity onPress={() => setShowDatePickerValidade(true)}>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  style={[styles.input, errors.dataValidade && styles.inputError]}
                  value={value ? format(new Date(value), 'yyyy-MM-dd') : ''}
                  editable={false}
                />
              </TouchableOpacity>
              {showDatePickerValidade && (
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePickerValidade(false);
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              )}
              {errors.dataValidade && <Text style={styles.errorText}>{errors.dataValidade.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="quantidade"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quantidade de amostras</Text>
              <TextInput
                placeholder="Quantidade..."
                style={[styles.input, errors.quantidade && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
              {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Detalhes de entrada do lote</Text>
              <TextInput
                placeholder="Descrição do lote..."
                style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
              />
              {errors.descricao && <Text style={styles.errorText}>{errors.descricao.message}</Text>}
            </View>
          )}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit(cadastrar)}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 20,
    marginRight: 10,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  button: {
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
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default CadastrarLote;
