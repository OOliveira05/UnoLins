import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

// Definição do esquema de validação com zod
const solicitanteSchema = z.object({
  cnpj: z
    .string()
    .regex(
      new RegExp("\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}"),
      "Formato do CNPJ inválido!"
    ),
  nome: z.string().nonempty("Campo nome é obrigatório!"),
  telefone: z
    .string()
    .regex(
      new RegExp("^\\(\\d{2}\\) \\d{5}-\\d{4}$"),
      "Formato do telefone inválido!"
    ),
  email: z.string().email("Formato de email inválido!"),
  endereco: z.string().nonempty("Campo endereço é obrigatório!"),
  cidade: z.string().nonempty("Campo cidade é obrigatório!"),
  estado: z.string().nonempty("Campo estado é obrigatório!"),
});

const RegistroSolicitanteScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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

  // Configuração do formulário com react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(solicitanteSchema),
    defaultValues: {
      cnpj: "",
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
      cidade: "",
      estado: "",
    },
  });

  // Função para cadastrar solicitante
  const cadastrarSolicitante = async (data) => {
    setLoading(true);
    try {
      await axios.post(
        "https://uno-api-pdre.onrender.com/api/v1/solicitante",
        data
      );

      reset();
      Alert.alert("Sucesso", "Solicitante cadastrado com sucesso!");
    } catch (error) {
      if (error.response) {
        Alert.alert("Erro", error.response.data.erro);
      } else {
        Alert.alert("Erro", "Erro ao registrar solicitante. Verifique suas informações e tente novamente.");
      }
      console.error("Erro ao registrar solicitante:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Cadastrar Solicitante</Text>
        <Text style={styles.subHeaderText}>Informe abaixo os dados do novo cliente do laboratório</Text>

        <View style={styles.formRow}>
          <Controller
            control={control}
            name="cnpj"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CNPJ</Text>
                <TextInput
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  style={[styles.input, errors.cnpj && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Fantasia</Text>
                <TextInput
                  placeholder="Nome Fantasia"
                  style={[styles.input, errors.nome && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}
              </View>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  placeholder="(00) 00000-0000"
                  style={[styles.input, errors.telefone && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                />
                <Text style={styles.descriptionText}>
                  Informe um telefone para contato com o responsável pelo solicitante
                </Text>
                {errors.telefone && <Text style={styles.errorText}>{errors.telefone.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="contato@exemplo.com"
                  style={[styles.input, errors.email && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                />
                <Text style={styles.descriptionText}>
                  Informe um email para contato com o responsável pelo solicitante
                </Text>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Controller
            control={control}
            name="endereco"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                  placeholder="Rua Exemplo 123"
                  style={[styles.input, errors.endereco && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.endereco && <Text style={styles.errorText}>{errors.endereco.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="cidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                  placeholder="Cidade"
                  style={[styles.input, errors.cidade && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.cidade && <Text style={styles.errorText}>{errors.cidade.message}</Text>}
              </View>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Controller
            control={control}
            name="estado"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Estado</Text>
                <TextInput
                  placeholder="Estado"
                  style={[styles.input, errors.estado && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.estado && <Text style={styles.errorText}>{errors.estado.message}</Text>}
              </View>
            )}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3A01DF" />
        ) : (
          <TouchableOpacity
            style={styles.registrarButton}
            onPress={handleSubmit(cadastrarSolicitante)}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    width: '100%',
    maxWidth: 800,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  inputError: {
    borderColor: 'red',
  },
  descriptionText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
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

  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default RegistroSolicitanteScreen;
