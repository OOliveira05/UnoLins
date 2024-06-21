import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EstoqueInfo = ({ label, value }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const ConsultaEstoque = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [estoques, setEstoques] = useState([]);
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

    const fetchEstoques = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('https://uno-api-pdre.onrender.com/api/v1/estoque');
        setEstoques(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstoques();
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
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados.</Text>
      </View>
    );
  }

  if (estoques.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Não há estoques cadastrados.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Consultar Estoque</Text>
      {estoques.map(estoque => (
        <View key={estoque.id} style={styles.estoqueContainer}>
          <EstoqueInfo label="ID" value={estoque.id} />
          <EstoqueInfo label="Nome" value={estoque.nome} />
          <EstoqueInfo label="CNPJ" value={estoque.solicitante.cnpj} />
          <TouchableOpacity
            style={styles.moreInfoButton}
            onPress={() => navigation.navigate('DetalhesEstoque', { nome: estoque.nome })}
          >
            <Text style={styles.moreInfoButtonText}>Mais Informações</Text>
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
  estoqueContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
  moreInfoButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3A01DF',
    borderRadius: 4,
    alignItems: 'center',
  },
  moreInfoButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
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

export default ConsultaEstoque;
