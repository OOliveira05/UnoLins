import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

const DetalhesItemAnaliseScreen = ({ route }) => {
  const { itemId } = route.params;
  const [itemAnalise, setItemAnalise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemAnalise = async () => {
      try {
        const response = await axios.get(`https://uno-lims.up.railway.app/item-analise/${itemId}`);
        setItemAnalise(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar informações do ItemAnalise:", error);
        setLoading(false);
      }
    };

    fetchItemAnalise();
  }, [itemId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : itemAnalise ? (
        <>
          <Text style={styles.title}>Detalhes do Item de Análise</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.text}>{itemAnalise.id}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Quantidade Recebida:</Text>
            <Text style={styles.text}>{itemAnalise.quantidadeRecebida}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Quantidade Disponível:</Text>
            <Text style={styles.text}>{itemAnalise.quantidadeDisponivel}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Unidade:</Text>
            <Text style={styles.text}>{itemAnalise.unidade}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Tipo de Material:</Text>
            <Text style={styles.text}>{itemAnalise.tipoMaterial}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Lote:</Text>
            <Text style={styles.text}>{itemAnalise.lote}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nota Fiscal:</Text>
            <Text style={styles.text}>{itemAnalise.notaFiscal}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Condição:</Text>
            <Text style={styles.text}>{itemAnalise.condicao}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Observação:</Text>
            <Text style={styles.text}>{itemAnalise.observacao}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>ID Solicitação de Análise:</Text>
            <Text style={styles.text}>{itemAnalise.solicitacaoDeAnaliseId}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.text}>Não foi possível carregar as informações.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default DetalhesItemAnaliseScreen;
