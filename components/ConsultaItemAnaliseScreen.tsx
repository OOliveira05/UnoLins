import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";

const ItemAnaliseInfo = ({ label, value }) => (
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

const ConsultaItemAnaliseScreen = () => {
  const [loading, setLoading] = useState(true);
  const [itensAnalise, setItensAnalise] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://uno-lims.up.railway.app/itens-de-analise")
      .then((response) => {
        setItensAnalise(response.data);
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

  if (itensAnalise.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Não há itens de análise disponíveis.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {itensAnalise.map((itemAnalise) => (
        <View key={itemAnalise.id}>
          <ItemAnaliseInfo
            label="Quantidade"
            value={itemAnalise.quantidade.toString()}
          />
          <ItemAnaliseInfo label="Unidade" value={itemAnalise.unidade} />
          <ItemAnaliseInfo
            label="Tipo de Material"
            value={itemAnalise.tipoMaterial}
          />
          <ItemAnaliseInfo label="Lote" value={itemAnalise.lote} />
          <ItemAnaliseInfo label="Nota Fiscal" value={itemAnalise.notaFiscal} />
          <ItemAnaliseInfo label="Condição" value={itemAnalise.condicao} />
          <ItemAnaliseInfo
            label="Observação"
            value={itemAnalise.observacao || "-"}
          />
          <ItemAnaliseInfo
            label="ID Solicitação de Análise"
            value={itemAnalise.solicitacaoDeAnaliseId}
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

export default ConsultaItemAnaliseScreen;
