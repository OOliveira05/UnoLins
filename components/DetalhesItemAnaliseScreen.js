// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios"; // Biblioteca para fazer requisições HTTP

// Componente funcional para a tela de detalhes do item de análise
const DetalhesItemAnaliseScreen = ({ route }) => {
  // Extração do ID do item de análise dos parâmetros de navegação
  const { itemId } = route.params;

  // Estados para armazenar informações do item de análise e controlar o estado de carregamento
  const [itemAnalise, setItemAnalise] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar informações do item de análise ao carregar o componente
  useEffect(() => {
    const fetchItemAnalise = async () => {
      try {
        // Requisição HTTP para obter informações do item de análise com base no ID
        const response = await axios.get(`https://uno-lims.up.railway.app/itens-de-analise/${itemId}`);
        
        // Atualização do estado com os dados do item de análise
        setItemAnalise(response.data);
        
        // Finalização do estado de carregamento
        setLoading(false);

        // Log do ID para depuração
        console.log("ID:", itemId);
      } catch (error) {
        // Tratamento de erro ao buscar informações do item de análise
        console.error("Erro ao buscar informações do ItemAnalise:", error);
        
        // Finalização do estado de carregamento em caso de erro
        setLoading(false);
      }
    };

    // Chamada da função de busca ao montar o componente
    fetchItemAnalise();
  }, [itemId]);

  // Estrutura do componente a ser renderizada
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Renderização condicional com base no estado de carregamento */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : itemAnalise ? (
        <>
          {/* Detalhes do item de análise */}
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


          {/* Exibindo informações da Solicitação de Análise */}
          <View style={styles.infoContainer}>
  <Text style={styles.label}>Solicitação de Análise:</Text>
  <View style={styles.textContainer}>
    <Text style={styles.text}>ID: {itemAnalise.solicitacaoDeAnalise.id}</Text>
    <Text style={styles.text}>Nome do Projeto: {itemAnalise.solicitacaoDeAnalise.nomeProjeto}</Text>
    <Text style={styles.text}>Abertura SA: {itemAnalise.solicitacaoDeAnalise.aberturaSA}</Text>
    <Text style={styles.text}>Entrada dos Materiais: {itemAnalise.solicitacaoDeAnalise.entradaDosMateriais}</Text>
    <Text style={styles.text}>Prazo Acordado: {itemAnalise.solicitacaoDeAnalise.prazoAcordado}</Text>
    <Text style={styles.text}>Tipo de Análise: {itemAnalise.solicitacaoDeAnalise.tipoDeAnalise}</Text>
    <Text style={styles.text}>Descrição dos Serviços: {itemAnalise.solicitacaoDeAnalise.descricaoDosServicos}</Text>
    <Text style={styles.text}>Informações Adicionais: {itemAnalise.solicitacaoDeAnalise.informacoesAdicionais}</Text>
    <Text style={styles.text}>Modo de Envio do Resultado: {itemAnalise.solicitacaoDeAnalise.modoEnvioResultado}</Text>
    <Text style={styles.text}>Responsável Abertura: {itemAnalise.solicitacaoDeAnalise.responsavelAbertura}</Text>
    <Text style={styles.text}>Solicitante CNPJ: {itemAnalise.solicitacaoDeAnalise.solicitanteCnpj}</Text>
  </View>
</View>
         
          {/* Exibindo informações dos ensaios associados */}
            <View style={styles.infoContainer}>
  <Text style={styles.label}>Ensaio(s):</Text>
  <View style={{ flexDirection: 'column' }}>
    {itemAnalise.Ensaio.map((ensaio) => (
      <View key={ensaio.id} style={{ marginBottom: 10 }}>
        <Text style={styles.text}>ID do Ensaio: {ensaio.id}</Text>
        <Text style={styles.text}>Nome do Ensaio: {ensaio.nomeEnsaio}</Text>
        <Text style={styles.text}>Especificação: {ensaio.especificacao}</Text>
        <Text style={styles.text}>Status Ensaio: {ensaio.statusEnsaio}</Text>
      </View>
    ))}
  </View>
</View>
        </>
      ) : (
        <Text style={styles.text}>Não foi possível carregar as informações.</Text>
      )}
     </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
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
  textContainer: {
    marginLeft: 10, // Espaçamento para melhorar a leitura
    marginBottom:10,
  },
});

export default DetalhesItemAnaliseScreen;
