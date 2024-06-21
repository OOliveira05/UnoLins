import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const ReagenteInfo = ({ label, value }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const DetalhesEstoque = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { nome } = route.params;
  const [loading, setLoading] = useState(true);
  const [reagentes, setReagentes] = useState([]);
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

    const fetchReagentes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`https://uno-api-pdre.onrender.com/api/v1/reagente?estoque=${nome}`);
        setReagentes(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReagentes();
  }, [nome, navigation]);

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

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.headerText}>Reagentes no estoque {nome}</Text>
      {reagentes.length === 0 ? (
        <Text>Não há reagentes cadastrados neste estoque.</Text>
      ) : (
        reagentes.map(reagente => (
          <View key={reagente.id} style={styles.reagenteContainer}>
            <ReagenteInfo label="ID" value={reagente.id} />
            <ReagenteInfo label="Nome" value={reagente.nome} />
            <ReagenteInfo label="Quantidade" value={reagente.quantidade} />
            <ReagenteInfo label="Unidade de medida" value={reagente.unidade} />
            <ReagenteInfo label="Fornecedor" value={reagente.fornecedor} />
            <ReagenteInfo label="Data de validade" value={reagente.dataValidade} />
            <ReagenteInfo label="Descrição" value={reagente.descricao} />
            {/* <TouchableOpacity
              style={styles.moreInfoButton}
              onPress={() => navigation.navigate('DetalhesReagente', { id: reagente.id })}
            >
              <Text style={styles.moreInfoButtonText}>Mais Informações</Text>
            </TouchableOpacity> */}
            <View style={styles.separator} />
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={() => navigation.navigate('CadastrarReagente', { nomeEstoque: nome })}
      >
        <Text style={styles.cadastrarButtonText}>Cadastrar Reagente</Text>
      </TouchableOpacity>
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
  reagenteContainer: {
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
    backgroundColor: '#1E90FF',
    borderRadius: 4,
    alignItems: 'center',
  },
  moreInfoButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  cadastrarButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3A01DF',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 60,
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default DetalhesEstoque;
