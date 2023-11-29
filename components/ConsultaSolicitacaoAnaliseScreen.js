// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";  // Biblioteca para fazer requisições HTTP
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para exibir informações de uma solicitação
const SolicitacaoInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

// Componente funcional para exibir mensagem de erro
const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Ocorreu um erro ao carregar os dados.</Text>
  </View>
);

// Componente funcional para a tela de consulta de solicitações de análise
const ConsultaSolicitacaoAnaliseScreen = () => {
  // Estados para controle de loading, dados das solicitações e erro
  const [loading, setLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [error, setError] = useState(null);

  // Estados para gerenciar o idioma da interface e as traduções
  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

  // Efeito para verificar e atualizar o idioma ao carregar o componente
  useEffect(() => {
    const updateLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@language');
        if (savedLanguage && savedLanguage !== language) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error reading language from AsyncStorage', error);
      }
    };

    updateLanguage();
  }, [language]);

  // Efeito para atualizar as traduções com base no idioma selecionado
  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

  // Efeito para buscar as solicitações de análise ao carregar o componente
  useEffect(() => {
    axios
      .get("https://uno-lims.up.railway.app/solicitacoes-de-analise")
      .then((response) => {
        setSolicitacoes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Se ainda estiver carregando, exibe um indicador de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se houver erro, exibe a mensagem de erro
  if (error) {
    return <ErrorMessage />;
  }

  // Se não houver solicitações, exibe uma mensagem informando sobre a falta de dados
  if (solicitacoes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{translations.ErroCarregarDados}</Text>
      </View>
    );
  }

  // Renderiza as informações de cada solicitação em um ScrollView
  return (
    <ScrollView style={styles.container}>
      {solicitacoes.map((solicitacao) => (
        <View key={solicitacao.id}>
          <SolicitacaoInfo
            label={translations.NomeProjeto}
            value={solicitacao.nomeProjeto}
          />
          <SolicitacaoInfo
            label={translations.PrazoAcordado}
            value={solicitacao.prazoAcordado}
          />
          <SolicitacaoInfo
            label={translations.TipoAnalise}
            value={solicitacao.tipoDeAnalise}
          />
          <SolicitacaoInfo
            label={translations.DescriçãoServicos}
            value={solicitacao.descricaoDosServicos}
          />
          <SolicitacaoInfo
            label={translations.InformacoesAdicionais}
            value={solicitacao.informacoesAdicionais || "-"}
          />
          <SolicitacaoInfo
            label={translations.SelecioneodoEnvioResultado}
            value={solicitacao.modoEnvioResultado}
          />
          <SolicitacaoInfo
            label={translations.Responsavel}
            value={solicitacao.responsavelAbertura}
          />
          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

// Exporta o componente para ser utilizado em outras partes da aplicação
export default ConsultaSolicitacaoAnaliseScreen;
