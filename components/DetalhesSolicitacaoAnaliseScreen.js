import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

// Definindo a função parseIdSaToOriginalFormat
const parseIdSaToOriginalFormat = (input) => {
    const sa = input.substring(0, 2); // Extrai os primeiros dois caracteres para SA
    const code = input.substring(2, 6); // Extrai os caracteres de 3 a 6 para o código (0001)
    const year = input.substring(6); // Extrai os caracteres a partir do 7º para o ano (2024)
    return `${sa}${code}${year}`;
  };
  
  

const DetalhesSolicitacaoAnaliseScreen = () => {
  const [solicitacaoAnalise, setSolicitacaoAnalise] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { idSa } = route.params;

  useEffect(() => {
    fetchSolicitacao();
    fetchLotes();
  }, [idSa]);

  const fetchSolicitacao = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise?id_sa=${parseIdSaToOriginalFormat(idSa)}`;
      console.log("URL da Solicitação de Análise:", url);
      const response = await axios.get(url);
      console.log("Solicitação de Análise:", response.data);
      setSolicitacaoAnalise(response.data);
    } catch (err) {
      setError(err);
      console.log("Erro ao buscar solicitação de análise:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/lote/solicitacao-analise?idSa=${parseIdSaToOriginalFormat(idSa)}`;
      console.log("URL de Lotes:", url);
      const response = await axios.get(url);
      console.log("Lotes:", response.data);
      setLotes(response.data);
    } catch (err) {
      setError(err);
      console.log("Erro ao buscar lotes:", err);
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.errorText}>Erro ao carregar dados.</Text>
      </View>
    );
  }

  return (
    solicitacaoAnalise && (
      <View style={styles.container}>
        <Text style={styles.heading}>Detalhes da Solicitação de Análise</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Id Solicitação de Análise</Text>
          <Text style={styles.text}>{solicitacaoAnalise.idSa}</Text>

          <Text style={styles.label}>CNPJ do Solicitante</Text>
          <Text style={styles.text}>{solicitacaoAnalise.solicitante.cnpj}</Text>

          <Text style={styles.label}>Solicitante</Text>
          <Text style={styles.text}>{solicitacaoAnalise.solicitante.nome}</Text>

          <Text style={styles.label}>Nome do Projeto</Text>
          <Text style={styles.text}>{solicitacaoAnalise.nomeProjeto}</Text>

          <Text style={styles.label}>Tipo de Análise</Text>
          <Text style={styles.text}>{solicitacaoAnalise.tipoAnalise}</Text>

          <Text style={styles.label}>Prazo Acordado</Text>
          <Text style={styles.text}>{solicitacaoAnalise.prazoAcordado}</Text>

          <Text style={styles.label}>Data de Conclusão</Text>
          <Text style={styles.text}>
            {solicitacaoAnalise.conclusaoProjeto ? solicitacaoAnalise.conclusaoProjeto : 'Não Finalizado'}
          </Text>

          <Text style={styles.label}>Descrição do Projeto</Text>
          <Text style={styles.text}>{solicitacaoAnalise.descricaoProjeto}</Text>
        </View>

        <View style={styles.lotesContainer}>
          <Text style={styles.heading}>Lotes</Text>
          <Button title="Cadastrar Lote" onPress={() => setIsDialogOpen(true)} />
        </View>

        <FlatList
          data={lotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.loteContainer}>
              <Text style={styles.loteName}>Amostra: {item.amostra}</Text>
              <Text style={styles.loteDetails}>Descrição: {item.descricao}</Text>
              <Text style={styles.loteDetails}>Quantidade: {item.quantidade}</Text>
            </View>
          )}
        />
      </View>
    )
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
  lotesContainer: {
    marginBottom: 20,
  },
  loteContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loteName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loteDetails: {
    fontSize: 14,
    color: '#555',
  },
});

export default DetalhesSolicitacaoAnaliseScreen;
