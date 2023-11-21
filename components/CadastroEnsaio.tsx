import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";

const CadastroEnsaioScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [nomeEnsaio, setNomeEnsaio] = useState("");
  const [especificacao, setEspecificacao] = useState("");
  const [itensDeAnalise, setItensDeAnalise] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const options = [
    "Desintegracao",
    "Dissolucao",
    "pH",
    "Dureza",
    "Friabilidade",
    "Umidade",
    "Viscosidade",
    "Solubilidade",
    "Teor_do_Ativo",
    "Teor_de_Impurezas",
    "Particulas_Visiveis",
    "Peso_Medio",
    "Karl_Fischer",
  ];

  useEffect(() => {
    axios
      .get("https://uno-lims.up.railway.app/itens-de-analise")
      .then((response) => {
        setItensDeAnalise(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar lista de itens de análise:", error);
      });
  }, []);

  const selecionarItem = (item) => {
    setItemSelecionado(item);
  };

  const cadastrarEnsaio = async () => {
    try {
      const response = await axios.post(
        "https://uno-lims.up.railway.app/ensaios",
        {
          nomeEnsaio: selectedOption || nomeEnsaio,
          especificacao,
          itemDeAnaliseId: itemSelecionado ? itemSelecionado.id : null,
        }
      );

      console.log("Ensaio cadastrado com sucesso!", response.data);
      Alert.alert("Sucesso", "Ensaio cadastrado com sucesso!");
      setNomeEnsaio("");
      setEspecificacao("");
      setItemSelecionado(null);
      setSelectedOption(null);
    } catch (error) {
      console.error("Erro ao cadastrar ensaio:", error);
      Alert.alert("Erro", "Erro ao cadastrar ensaio!");
    }
  };

  const renderOptions = () => (
    options.map((option) => (
      <TouchableOpacity
        key={option}
        style={styles.modalOption}
        onPress={() => {
          setSelectedOption(option);
          setShowOptionModal(false);
        }}
      >
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Cadastro de Ensaio</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowOptionModal(true)}
      >
        <Text>{selectedOption || 'Selecione o Ensaio'}</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Especificação"
        value={especificacao}
        onChangeText={setEspecificacao}
        style={styles.input}
      />
      <Text style={styles.label}>Selecione um Item de Análise:</Text>
      <ScrollView
  horizontal
  contentContainerStyle={styles.itensContainer}
>
  {itensDeAnalise.map((item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.itemButton,
        item === itemSelecionado && styles.selectedItemButton,
      ]}
      onPress={() => selecionarItem(item)}
    >
      <Text style={styles.itemButtonText}>
        ID: {item.id}
        {"\n"}
        Quantidade Recebida: {item.quantidadeRecebida}
        {"\n"}
        Quantidade Disponível: {item.quantidadeDisponivel}
        {"\n"}
        Unidade: {item.unidade}
        {"\n"}
        Tipo de Material: {item.tipoMaterial}
        {"\n"}
        Lote: {item.lote}
        {"\n"}
        Nota Fiscal: {item.notaFiscal}
        {"\n"}
        Condição: {item.condicao}
        {"\n"}
        Observação: {item.observacao}
        {"\n"}
        Solicitação de Análise ID: {item.solicitacaoDeAnaliseId}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={cadastrarEnsaio}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionModal}
        onRequestClose={() => setShowOptionModal(false)}
      >
        <View style={styles.modalContainer}>
          {renderOptions()}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: '#3A01DF',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  itensContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  itemButton: {
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 4,
  },
  selectedItemButton: {
    backgroundColor: "#3498db",
  },
  cadastrarButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  
});

export default CadastroEnsaioScreen;
