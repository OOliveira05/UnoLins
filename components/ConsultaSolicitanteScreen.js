import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SolicitanteInfo = ({ label, value }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const ErrorMessage = ({ onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Erro ao carregar dados.</Text>
    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Tentar Novamente</Text>
    </TouchableOpacity>
  </View>
);

const ConsultaSolicitanteScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [solicitantes, setSolicitantes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Image source={require('../assets/Logo.png')} style={styles.headerLogo} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center', // Centraliza o título do cabeçalho
    });

    const fetchSolicitantes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('https://uno-api-pdre.onrender.com/api/v1/solicitante/listagem');
        setSolicitantes(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitantes();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorMessage onRetry={() => fetchSolicitantes()} />;
  }

  if (solicitantes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Não há solicitantes cadastrados.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Consultar Solicitante</Text>
      {solicitantes.map(solicitante => (
        <View key={solicitante.cnpj}>
          <SolicitanteInfo label="CNPJ" value={solicitante.cnpj} />
          <SolicitanteInfo label="Nome" value={solicitante.nome} />
          <SolicitanteInfo label="Rua" value={solicitante.endereco} />
          <SolicitanteInfo label="Cidade" value={solicitante.cidade} />
          <SolicitanteInfo label="Estado" value={solicitante.estado} />
          <SolicitanteInfo label="Responsável" value={solicitante.responsavel} />
          <SolicitanteInfo label="Telefone" value={solicitante.telefone} />
          <SolicitanteInfo label="Email" value={solicitante.email} />
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('DetalhesSolicitanteScreen', { cnpj: solicitante.cnpj })}
          >
            <Text style={styles.detailsButtonText}>Mais Informações</Text>
          </TouchableOpacity>
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
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
  retryButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF6347',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  detailsButton: {
    padding: 10,
    backgroundColor: '#3A01DF',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default ConsultaSolicitanteScreen;
