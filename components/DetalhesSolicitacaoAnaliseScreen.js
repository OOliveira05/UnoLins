import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Image source={require('../assets/Logo.png')} style={styles.headerLogo} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center', // Centraliza o título do cabeçalho
    });

    fetchSolicitacao();
    fetchLotes();
  }, [idSa]);

  const fetchSolicitacao = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise?id_sa=${parseIdSaToOriginalFormat(idSa)}`;
      const response = await axios.get(url);
      setSolicitacaoAnalise(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/lote/solicitacao-analise?idSa=${parseIdSaToOriginalFormat(idSa)}`;
      const response = await axios.get(url);
      setLotes(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarLote = () => {
    const formattedIdSa = parseIdSaToOriginalFormat(idSa);
    navigation.navigate('CadastrarLote', { idSa: formattedIdSa });
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {solicitacaoAnalise && (
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
              <TouchableOpacity style={styles.registrarButton} onPress={handleCadastrarLote}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cadastrar Lote</Text>
              </TouchableOpacity>
          </View>

          {/* Exemplo de exibição de lotes como cartões */}
          <View style={styles.lotesContainer}>
            {lotes.map((lote) => (
              <TouchableOpacity
                key={lote.id}
                style={styles.loteCard}
                onPress={() => {
                  navigation.navigate('DetalhesLote', { idLote: lote.id });
                }}
              >
                <Text style={styles.loteName}>Amostra: {lote.amostra}</Text>
                <Text style={styles.loteDetails}>Descrição: {lote.descricao}</Text>
                <Text style={styles.loteDetails}>Quantidade: {lote.quantidade}</Text>
                <Text style={styles.loteDetails}>Nota Fiscal: {lote.notaFiscal}</Text>
                <Text style={styles.loteDetails}>Data de Entrada: {lote.dataEntrada}</Text>
                <Text style={styles.loteDetails}>Data de Validade: {lote.dataValidade}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
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
  loteCard: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loteName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loteDetails: {
    fontSize: 14,
    color: '#555',
  },
  registrarButton: {
    backgroundColor: '#3A01DF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default DetalhesSolicitacaoAnaliseScreen;
