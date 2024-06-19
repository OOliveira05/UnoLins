import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useToast } from 'react-native-toast-notifications';

const solicitacaoAnaliseSchema = z.object({
  nomeProjeto: z.string(),
  prazoAcordado: z.date(),
  tipoAnalise: z.string(),
  descricaoProjeto: z.string(),
  cnpj: z.string(),
});

const CadastrarSolicitacaoAnalise = () => {
  const toast = useToast();
  const [solicitantes, setSolicitantes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchSolicitantes();
  }, []);

  const fetchSolicitantes = async () => {
    try {
      const { data } = await axios.get('https://uno-api-pdre.onrender.com/api/v1/solicitante/listagem');
      setSolicitantes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(solicitacaoAnaliseSchema),
    defaultValues: {
      nomeProjeto: '',
      prazoAcordado: new Date(),
      tipoAnalise: '',
      descricaoProjeto: '',
      cnpj: '',
    },
  });

  const cadastrar = async (data) => {
    try {
      const year = data.prazoAcordado.getFullYear();
      const month = String(data.prazoAcordado.getMonth() + 1).padStart(2, '0');
      const day = String(data.prazoAcordado.getDate()).padStart(2, '0');

      const solicitacaoAnalise = {
        nomeProjeto: data.nomeProjeto,
        prazoAcordado: `${year}-${month}-${day}`,
        tipoAnalise: data.tipoAnalise,
        descricaoProjeto: data.descricaoProjeto,
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

      await axios.post('https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise', solicitacaoAnalise);
      reset({
        nomeProjeto: '',
        prazoAcordado: new Date(),
        tipoAnalise: '',
        descricaoProjeto: '',
        cnpj: '',
      });

      toast.show('Solicitação de Análise cadastrada com sucesso', { type: 'success' });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.show(error.response?.data.erro, { type: 'danger' });
      } else {
        console.error(error);
      }
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('prazoAcordado', selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Solicitação de Análise</Text>
      <Text style={styles.description}>Informe abaixo as informações de abertura do novo projeto</Text>
      <Controller
        control={control}
        name="cnpj"
        render={({ field: { onChange, value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Solicitante</Text>
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              <Picker.Item label="Selecione o solicitante do projeto" value="" />
              {solicitantes.map((solicitante) => (
                <Picker.Item key={solicitante.cnpj} label={solicitante.nome} value={solicitante.cnpj} />
              ))}
            </Picker>
          </View>
        )}
      />
      <Controller
        control={control}
        name="nomeProjeto"
        render={({ field: { onChange, value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Nome do Projeto</Text>
            <TextInput style={styles.input} placeholder="Nome do Projeto" onChangeText={onChange} value={value} />
          </View>
        )}
      />
      <Controller
        control={control}
        name="tipoAnalise"
        render={({ field: { onChange, value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Tipo de Análise</Text>
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              <Picker.Item label="Selecione um tipo de análise para o projeto" value="" />
              <Picker.Item label="Desenvolvimento" value="DESENVOLVIMENTO" />
              <Picker.Item label="Degradação Forçada" value="DEGRADACAO_FORCADA" />
              <Picker.Item label="Validação" value="VALIDACAO" />
              <Picker.Item label="Controle" value="CONTROLE" />
              <Picker.Item label="Solubilidade" value="SOLUBILIDADE" />
              <Picker.Item label="Estabilidade" value="ESTABILIDADE" />
              <Picker.Item label="Perfil de Dissolução" value="PERFIL_DISSOLUCAO" />
              <Picker.Item label="Solventes Residuais" value="SOLVENTES_RESIDUAIS" />
              <Picker.Item label="Sumário de Validação" value="SUMARIO_VALIDACAO" />
            </Picker>
          </View>
        )}
      />
      <Controller
        control={control}
        name="prazoAcordado"
        render={({ field: { value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Prazo Acordado</Text>
            {Platform.OS === 'android' ? (
              <>
                <Button title={value.toDateString()} onPress={showDatePickerModal} />
                {showDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </>
            ) : (
              <DateTimePicker
                value={value}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={{ width: '100%' }}
              />
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="descricaoProjeto"
        render={({ field: { onChange, value } }) => (
          <View style={styles.formItem}>
            <Text style={styles.label}>Descrição do Projeto</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              numberOfLines={4}
              placeholder="Descrição do Projeto"
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />
      <Button title="Cadastrar" onPress={handleSubmit(cadastrar)} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default CadastrarSolicitacaoAnalise;
