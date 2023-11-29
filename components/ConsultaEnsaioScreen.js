// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';  // Biblioteca para fazer requisições HTTP
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para exibir informações de um ensaio
const EnsaioInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

// Componente funcional para exibir mensagem de erro
const ErrorMessage = ({ message }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

// Componente funcional para a tela de consulta de ensaios
const ConsultaEnsaioScreen = () => {
  // Estados para controle de loading, dados dos ensaios e erro
  const [loading, setLoading] = useState(true);
  const [ensaios, setEnsaios] = useState([]);
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

  // Efeito para buscar os itens de análise e, em seguida, os ensaios associados a esses itens
  useEffect(() => {
    axios.get('https://uno-lims.up.railway.app/itens-de-analise')
      .then(response => {
        const itemIds = response.data.map(item => item.id);

        const requests = itemIds.map(itemId =>
          axios.get(`https://uno-lims.up.railway.app/ensaios/item-de-analise/${itemId}`)
            .then(ensaioResponse => ensaioResponse.data)
            .catch(error => {
              console.error(`Erro ao obter ensaio com ID ${itemId}:`, error);
              return null;
            })
        );

        // Promise.all para aguardar todas as requisições de ensaios serem concluídas
        Promise.all(requests)
          .then(ensaioResponses => {
            console.log('Respostas dos Ensaios:', ensaioResponses);

            // Aplanar o array de arrays para um array único de ensaios
            const flattenedEnsaios = ensaioResponses.flat();
            // Filtrar ensaios válidos (que não retornaram null)
            const ensaiosData = flattenedEnsaios.filter(ensaio => ensaio !== null);
            setEnsaios(ensaiosData);
            setLoading(false);
          })
          .catch(error => {
            console.error(error);
            setError(error);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error(error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Se ainda estiver carregando, exibe um indicador de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se houver erro, exibe a mensagem de erro
  if (error) {
    return <ErrorMessage message={translations.ErroCarregarDados} />;
  }

  // Se não houver ensaios, exibe uma mensagem informando sobre a falta de dados
  if (ensaios.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{translations.ErroCarregarDados}</Text>
      </View>
    );
  }

  // Renderiza as informações de cada ensaio em um ScrollView
  return (
    <ScrollView style={styles.container}>
      {ensaios.map(ensaio => (
        <View key={ensaio.id}>
          <EnsaioInfo label={translations.NomeEnsaio} value={ensaio.nomeEnsaio} />
          <EnsaioInfo label={translations.Especificacao} value={ensaio.especificacao} />
          <EnsaioInfo label={translations.IDItemAnalise} value={ensaio.itemDeAnaliseId} />
          <EnsaioInfo label="Status" value={ensaio.statusEnsaio} />
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

// Exporta o componente para ser utilizado em outras partes da aplicação
export default ConsultaEnsaioScreen;
