import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';

const CadastrarAnalise = ({ lote, fetchLote, fetchAnalises, isOpen }) => {
  const [ensaios, setEnsaios] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { idLote } = route.params;

  useEffect(() => {
    fetchEnsaios();
  }, []);

  const fetchEnsaios = async () => {
    try {
      const { data } = await axios.get('https://uno-api-pdre.onrender.com/api/v1/ensaio');
      setEnsaios(data);
    } catch (error) {
      console.error('Error fetching ensaios:', error);
    }
  };

  const loteSchema = z.object({
    especificacao: z.string().nonempty('Especificação é obrigatória'),
    resultado: z.string().nonempty('Resultado é obrigatório'),
    unidade: z.string().nonempty('Unidade é obrigatória'),
    observacao: z.string(),
    ensaio: z.string().nonempty('Ensaio é obrigatório'),
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      especificacao: '',
      resultado: '',
      unidade: '',
      observacao: '',
      ensaio: '',
    },
  });

  const cadastrar = async (data) => {
    setLoading(true);
    try {
      const analise = {
        id: '',
        especificacao: Number(data.especificacao),
        resultado: Number(data.resultado),
        unidade: data.unidade,
        observacao: data.observacao,
        lote: {
          id: idLote,
          amostra: '',
          notaFiscal: '',
          dataEntrada: '',
          dataValidade: '',
          descricao: '',
          quantidade: 0,
          solicitacaoAnalise: {
            nomeProjeto: '',
            tipoAnalise: '',
            prazoAcordado: '',
            conclusaoProjeto: '',
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
        },
        ensaio: {
          id: '',
          nome: data.ensaio,
        },
      };


      await axios.post('https://uno-api-pdre.onrender.com/api/v1/analise', analise);

      reset({
        especificacao: '',
        resultado: '',
        unidade: '',
        observacao: '',
        ensaio: '',
      });

      toast.show('Análise cadastrada com sucesso', { type: 'success' });

    
    } catch (error) {
      console.log('Erro ao cadastrar análise:', error);
      toast.show('Erro ao cadastrar análise. Verifique os dados e tente novamente.', { type: 'danger' });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Cadastrar Nova Análise</Text>
      <Text style={styles.description}>Informe os dados da análise efetuada</Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="ensaio"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ensaio</Text>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={[styles.picker, errors.ensaio && styles.inputError]}
              >
                <Picker.Item label="Selecione o ensaio efetuado" value="" />
                {ensaios.map((ensaio) => (
                  <Picker.Item label={ensaio.nome} value={ensaio.nome} key={ensaio.id} />
                ))}
              </Picker>
              {errors.ensaio && <Text style={styles.errorText}>{errors.ensaio.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="especificacao"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Especificação</Text>
              <TextInput
                placeholder="Especificação"
                style={[styles.input, errors.especificacao && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.especificacao && <Text style={styles.errorText}>{errors.especificacao.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="resultado"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Resultado</Text>
              <TextInput
                placeholder="Resultado"
                style={[styles.input, errors.resultado && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.resultado && <Text style={styles.errorText}>{errors.resultado.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="unidade"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Unidade</Text>
              <TextInput
                placeholder="Unidade"
                style={[styles.input, errors.unidade && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.unidade && <Text style={styles.errorText}>{errors.unidade.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="observacao"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Observação</Text>
              <TextInput
                placeholder="Observação"
                style={[styles.input, styles.textArea, errors.observacao && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
              />
              {errors.observacao && <Text style={styles.errorText}>{errors.observacao.message}</Text>}
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
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
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
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CadastrarAnalise;
