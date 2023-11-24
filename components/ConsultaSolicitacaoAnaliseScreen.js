import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { getTranslation } from './translation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SolicitacaoInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Ocorreu um erro ao carregar os dados.</Text>
  </View>
);

const ConsultaSolicitacaoAnaliseScreen = () => {
  const [loading, setLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

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

  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessage />;
  }

  if (solicitacoes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{translations.ErroCarregarDados}</Text>
      </View>
    );
  }

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

export default ConsultaSolicitacaoAnaliseScreen;
