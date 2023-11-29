// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';  // Biblioteca para fazer requisições HTTP
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para exibir informações de um solicitante
const SolicitanteInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

// Componente funcional para exibir uma mensagem de erro
const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{translations.ErroCarregarDados}</Text>
  </View>
);

// Componente principal para a tela de consulta de solicitantes
const ConsultaSolicitanteScreen = () => {
  // Estados para controlar o estado de carregamento, dados dos solicitantes e erros
  const [loading, setLoading] = useState(true);
  const [solicitantes, setSolicitantes] = useState([]);
  const [error, setError] = useState(null);

  // Estados para gerenciar o idioma da interface e as traduções
  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

  // Efeito para verificar e atualizar o idioma ao carregar o componente
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

  // Efeito para atualizar as traduções com base no idioma selecionado
  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

  // Efeito para fazer uma requisição GET ao servidor e obter os dados dos solicitantes
  useEffect(() => {
    axios.get('https://uno-lims.up.railway.app/solicitantes')
      .then(response => {
        setSolicitantes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Condições de renderização com base no estado de carregamento e presença de erros
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessage />;
  }

  // Condição para quando não há solicitantes cadastrados
  if (solicitantes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{translations.ErroCarregarDados}</Text>
      </View>
    );
  }

  // Renderização do componente com informações dos solicitantes
  return (
    <ScrollView style={styles.container}>
      {solicitantes.map(solicitante => (
        <View key={solicitante.cnpj}>
          {/* Componente SolicitanteInfo para exibir informações do solicitante */}
          <SolicitanteInfo label="CNPJ" value={solicitante.cnpj} />
          <SolicitanteInfo label={translations.Nome} value={solicitante.nome} />
          <SolicitanteInfo label={translations.Rua} value={`${solicitante.endereco}, ${solicitante.numero}`} />
          <SolicitanteInfo label={translations.Cidade} value={solicitante.cidade} />
          <SolicitanteInfo label={translations.Estado} value={solicitante.estado} />
          <SolicitanteInfo label={translations.Responsavel} value={solicitante.responsavel} />
          <SolicitanteInfo label={translations.Telefone} value={solicitante.telefone} />
          <SolicitanteInfo label="Email" value={solicitante.email} />
          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default ConsultaSolicitanteScreen;
