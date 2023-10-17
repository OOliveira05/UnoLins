import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const ConsultaSolicitanteScreen = () => {
  const [solicitantes, setSolicitantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://uno-api-vz2y.onrender.com/api/v1/solicitantes')
      .then(response => {
        setSolicitantes(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
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
        <View key={solicitante.Cnpj}>
          <Text style={styles.label}>CNPJ:</Text>
          <Text style={styles.text}>{solicitante.Cnpj}</Text>

          <Text style={styles.label}>Nome Fantasia:</Text>
          <Text style={styles.text}>{solicitante.NomeFantasia}</Text>

          <Text style={styles.label}>Ativo:</Text>
          <Text style={styles.text}>{solicitante.Ativo ? 'Ativo' : 'Inativo'}</Text>

          <Text style={styles.label}>CEP:</Text>
          <Text style={styles.text}>{solicitante.Cep}</Text>

          <Text style={styles.label}>Rua:</Text>
          <Text style={styles.text}>{solicitante.Rua}</Text>

          <Text style={styles.label}>Número:</Text>
          <Text style={styles.text}>{solicitante.Numero}</Text>

          <Text style={styles.label}>Cidade:</Text>
          <Text style={styles.text}>{solicitante.Cidade}</Text>

          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.text}>{solicitante.Estado}</Text>

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
});

export default ConsultaSolicitanteScreen;
