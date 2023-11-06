import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const SolicitanteInfo = ({ label, value }) => (
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

const ConsultaSolicitanteScreen = () => {
  const [loading, setLoading] = useState(true);
  const [solicitantes, setSolicitantes] = useState([]);
  const [error, setError] = useState(null);

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

  if (solicitantes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Não há solicitantes disponíveis.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {solicitantes.map(solicitante => (
        <View key={solicitante.cnpj}>
          <SolicitanteInfo label="CNPJ" value={solicitante.cnpj} />
          <SolicitanteInfo label="Nome" value={solicitante.nome} />
          <SolicitanteInfo label="Endereço" value={`${solicitante.endereco}, ${solicitante.numero}`} />
          <SolicitanteInfo label="Cidade" value={solicitante.cidade} />
          <SolicitanteInfo label="Estado" value={solicitante.estado} />
          <SolicitanteInfo label="Responsável" value={solicitante.responsavel} />
          <SolicitanteInfo label="Telefone" value={solicitante.telefone} />
          <SolicitanteInfo label="Email" value={solicitante.email} />
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

export default ConsultaSolicitanteScreen;
