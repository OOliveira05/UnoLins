import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Text, View, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const tiposDeAnalise = [
  { label: 'Desenvolvimento', value: 'DESENVOLVIMENTO' },
  { label: 'Degradação Forçada', value: 'DEGRADACAO_FORCADA' },
  { label: 'Validação', value: 'VALIDACAO' },
  { label: 'Controle', value: 'CONTROLE' },
  { label: 'Solubilidade', value: 'SOLUBILIDADE' },
  { label: 'Estabilidade', value: 'ESTABILIDADE' },
  { label: 'Perfil de Dissolução', value: 'PERFIL_DISSOLUCAO' },
  { label: 'Solventes Residuais', value: 'SOLVENTES_RESIDUAIS' },
  { label: 'Sumário de Validação', value: 'SUMARIO_VALIDACAO' },
];

const CadastrarSolicitacaoAnalise = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTipoAnalise, setSelectedTipoAnalise] = useState(null);
  const [solicitantes, setSolicitantes] = useState([]);
  const [selectedSolicitante, setSelectedSolicitante] = useState(null);

  useEffect(() => {
    const fetchSolicitantes = async () => {
      try {
        const response = await axios.get('https://uno-api-pdre.onrender.com/api/v1/solicitante/listagem');
        setSolicitantes(response.data);
      } catch (error) {
        console.error('Erro ao buscar solicitantes:', error);
        Alert.alert('Erro ao buscar solicitantes:', error.message);
      }
    };

    fetchSolicitantes();
  }, []);

  

  const onSubmit = async (data) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const solicitacaoAnalise = {
        ...data,
        prazoAcordado: formattedDate,
        tipoAnalise: selectedTipoAnalise,
        cnpj: selectedSolicitante,
      };

      console.log('Dados enviados para a API:', solicitacaoAnalise);

      await axios.post('https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise', solicitacaoAnalise);

      setValue('nomeProjeto', '');
      setValue('descricaoProjeto', '');
      setValue('cnpj', '');
      setSelectedDate(new Date());
      setSelectedTipoAnalise(null);
      setSelectedSolicitante(null);

      Alert.alert('Sucesso', 'Solicitação de Análise cadastrada com sucesso');
    } catch (error) {
      console.error('Erro ao cadastrar solicitação de análise:', error);
      Alert.alert('Erro', 'Erro ao cadastrar solicitação de análise');
    }
  };

  const handleDateChange = (event, date) => {
    const selectedDate = date || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(selectedDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Cadastrar Solicitação de Análise</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome do Projeto:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Nome do Projeto"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="nomeProjeto"
          defaultValue=""
        />

        <View style={styles.selectContainer}>
          <Text style={styles.label}>Solicitante:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSolicitante}
              onValueChange={(itemValue, itemIndex) => setSelectedSolicitante(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o Solicitante" value={null} />
              {solicitantes.map((solicitante) => (
                <Picker.Item key={solicitante.id} label={solicitante.nome} value={solicitante.cnpj} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.selectContainer}>
          <Text style={styles.label}>Tipo de Análise:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTipoAnalise}
              onValueChange={(itemValue, itemIndex) => setSelectedTipoAnalise(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o Tipo de Análise" value={null} />
              {tiposDeAnalise.map((tipo) => (
                <Picker.Item key={tipo.value} label={tipo.label} value={tipo.value} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Data Combinada:</Text>
        <View style={styles.dateContainer}>
          <TextInput
            value={selectedDate.toLocaleDateString()}
            style={[styles.input, styles.dateInput]}
            editable={false}
            placeholderTextColor="#000"
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>Selecionar Data</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Descrição do Projeto:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Descrição do Projeto"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="descricaoProjeto"
          defaultValue=""
        />

        <TouchableOpacity style={styles.cadastrarButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dateButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#3A01DF',
    borderRadius: 4,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  cadastrarButton: {
    marginTop: 20,
    backgroundColor: '#3A01DF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CadastrarSolicitacaoAnalise;
