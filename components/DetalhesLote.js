import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetalhesLote = () => {
  const [lote, setLote] = useState(null);
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { idLote } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    fetchLote();
    fetchAnalises();
  }, []);

  const fetchLote = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/lote/${idLote}`;
      const response = await axios.get(url);
      setLote(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalises = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/analise/${idLote}`;
      const response = await axios.get(url);
      setAnalises(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarAnalise = () => {
    // Implemente a navegação para a tela de cadastro de análise
    // Por exemplo: navigation.navigate('CadastrarAnalise', { idLote });
    console.log('Implemente a navegação para a tela de cadastro de análise');
  };

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
        <Text style={styles.errorText}>Erro ao carregar dados do lote.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Id Solicitação de Análise</Text>
          <Text style={styles.text}>{lote.solicitacaoAnalise.idSa}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Nome do Projeto</Text>
          <Text style={styles.text}>{lote.solicitacaoAnalise.nomeProjeto}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Amostra</Text>
          <Text style={styles.text}>{lote.amostra}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Nota Fiscal</Text>
          <Text style={styles.text}>{lote.notaFiscal}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Data de Entrada</Text>
          <Text style={styles.text}>{lote.dataEntrada}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Data de Validade</Text>
          <Text style={styles.text}>{lote.dataValidade}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Quantidade</Text>
          <Text style={styles.text}>{lote.quantidade}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.text}>{lote.descricao === '' ? '-' : lote.descricao}</Text>
        </View>
      </View>

      <View style={styles.analisesContainer}>
        <View style={styles.analisesHeader}>
          <Text style={styles.analisesHeaderText}>Análises</Text>
          <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarAnalise}>
            <Text style={styles.cadastrarButtonText}>Cadastrar Análise</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.analisesList}>
          {analises.map((analise, index) => (
            <View key={index} style={styles.analiseItem}>
              <Text style={styles.analiseItemText}>{`Análise ${index + 1}: ${analise.nome}`}</Text>
              <Text style={styles.analiseItemText}>{`Resultado: ${analise.resultado}`}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  analisesContainer: {
    marginTop: 20,
  },
  analisesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analisesHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cadastrarButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analisesList: {
    marginTop: 10,
  },
  analiseItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  analiseItemText: {
    fontSize: 16,
    color: '#555',
  },
});

export default DetalhesLote;
