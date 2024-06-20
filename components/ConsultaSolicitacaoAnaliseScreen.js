import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SolicitacaoInfo = ({ label, value }) => (
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

const ConsultaSolicitacaoScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Consultar Solicitação de Análise",
    });

    const fetchSolicitacoes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise/listagem');
        setSolicitacoes(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
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
    return <ErrorMessage onRetry={() => fetchSolicitacoes()} />;
  }

  if (solicitacoes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Não há solicitações de análise cadastradas.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {solicitacoes.map(solicitacao => (
        <View key={solicitacao.id}>
          <SolicitacaoInfo label="ID" value={solicitacao.idSa} />
          <SolicitacaoInfo label="Nome do Projeto" value={solicitacao.nomeProjeto} />
          <SolicitacaoInfo label="Tipo de Análise" value={solicitacao.tipoAnalise} />
          <SolicitacaoInfo label="Prazo Acordado" value={solicitacao.prazoAcordado} />
          <SolicitacaoInfo label="Conclusão do Projeto" value={solicitacao.conclusaoProjeto || "Não Concluído"} />
          <SolicitacaoInfo label="Descrição do Projeto" value={solicitacao.descricaoProjeto} />
          <SolicitacaoInfo label="Solicitante" value={solicitacao.solicitante?.nome || "Desconhecido"} />
          <TouchableOpacity
            style={styles.moreInfoButton}
            onPress={() => navigation.navigate('DetalhesSolicitacaoAnaliseScreen', { idSa: solicitacao.idSa })}
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
});

export default ConsultaSolicitacaoScreen;
