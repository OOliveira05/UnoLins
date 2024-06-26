import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetalhesSolicitanteScreen = () => {
  const [solicitacoesAnalise, setSolicitacoesAnalise] = useState([]);
  const [solicitante, setSolicitante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { cnpj } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Image source={require('../assets/Logo.png')} style={styles.headerLogo} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center', // Centraliza o título do cabeçalho
    });

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedCnpj = String(cnpj);
        const solicitanteResponse = await axios.get(`https://uno-api-pdre.onrender.com/api/v1/solicitante?cnpj=${formattedCnpj}`);
        setSolicitante(solicitanteResponse.data);

        const solicitacoesAnaliseResponse = await axios.get(`https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise/solicitante?cnpj=${formattedCnpj}`);
        setSolicitacoesAnalise(solicitacoesAnaliseResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cnpj]);

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

  if (!solicitante) {
    return (
      <View style={styles.container}>
        <Text>Solicitante não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Detalhes do Solicitante</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>CNPJ:</Text>
        <Text style={styles.text}>{solicitante.cnpj}</Text>

        <Text style={styles.label}>Nome Fantasia:</Text>
        <Text style={styles.text}>{solicitante.nome}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.text}>{solicitante.telefone}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{solicitante.email}</Text>

        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.text}>{solicitante.endereco}</Text>

        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.text}>{solicitante.cidade}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.text}>{solicitante.estado}</Text>
      </View>

      <Text style={styles.heading}>Histórico de Projetos</Text>
      {solicitacoesAnalise.map((item) => (
        <TouchableOpacity
          key={item.idSa}
          style={styles.projectCard}
          onPress={() => navigation.navigate('DetalhesSolicitacaoAnaliseScreen', { idSa: item.idSa })}
        >
          <Text style={styles.projectName}>{item.nomeProjeto}</Text>
          <Text style={styles.projectDetails}>Tipo de Análise: {item.tipoAnalise}</Text>
          <Text style={styles.projectDetails}>Prazo Acordado: {item.prazoAcordado}</Text>
          <Text style={styles.projectDetails}>Conclusão: {item.conclusaoProjeto ? item.conclusaoProjeto : "Em andamento"}</Text>
          <Text style={styles.projectDetails}>Descrição: {item.descricaoProjeto}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  projectCard: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDetails: {
    fontSize: 14,
    color: '#555',
  },

  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default DetalhesSolicitanteScreen;
