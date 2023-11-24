import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { getTranslation } from './translation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnsaioInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{translations.ErroCarregarDados}</Text>
  </View>
);
const ConsultaEnsaioScreen = () => {
  const [loading, setLoading] = useState(true);
  const [ensaios, setEnsaios] = useState([]);
  const [error, setError] = useState(null);

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

  if (ensaios.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{translations.ErroCarregarDados}</Text>
      </View>
    );
  }

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

export default ConsultaEnsaioScreen;
