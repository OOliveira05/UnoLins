import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const EnsaioInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Ocorreu um erro ao carregar os dados.</Text>
  </View>
);

const ConsultaEnsaioScreen = () => {
  const [loading, setLoading] = useState(true);
  const [ensaios, setEnsaios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://uno-lims.up.railway.app/ensaios')
      .then(response => {
        setEnsaios(response.data);
        setLoading(false);
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
        <Text>Não há ensaios disponíveis.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {ensaios.map(ensaio => (
        <View key={ensaio.id}>
          <EnsaioInfo label="Nome do Ensaio" value={ensaio.nomeEnsaio} />
          <EnsaioInfo label="Especificação" value={ensaio.especificacao} />
          <EnsaioInfo label="ID do Item de Análise" value={ensaio.itemDeAnaliseId} />
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
